import express from "express";
import cors from "cors";
import db from "./db.js";

const app = express();
const PORT = 5000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/todos", (_req, res) => {
  const todos = db
    .prepare("SELECT id, title, completed, created_at FROM todos ORDER BY id DESC")
    .all()
    .map((todo) => ({ ...todo, completed: Boolean(todo.completed) }));

  res.json(todos);
});

app.post("/api/todos", (req, res) => {
  const title = typeof req.body.title === "string" ? req.body.title.trim() : "";

  if (!title) {
    return res.status(400).json({ error: "Task title is required." });
  }

  const result = db
    .prepare("INSERT INTO todos (title) VALUES (?)")
    .run(title);

  const todo = db
    .prepare("SELECT id, title, completed, created_at FROM todos WHERE id = ?")
    .get(result.lastInsertRowid);

  res.status(201).json({ ...todo, completed: Boolean(todo.completed) });
});

app.put("/api/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid task ID." });
  }

  const existing = db.prepare("SELECT * FROM todos WHERE id = ?").get(id);
  if (!existing) {
    return res.status(404).json({ error: "Task not found." });
  }

  const updates = [];
  const values = [];

  if (Object.hasOwn(req.body, "title")) {
    const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
    if (!title) return res.status(400).json({ error: "Task title cannot be empty." });
    updates.push("title = ?");
    values.push(title);
  }

  if (Object.hasOwn(req.body, "completed")) {
    if (typeof req.body.completed !== "boolean") {
      return res.status(400).json({ error: "Completed must be true or false." });
    }
    updates.push("completed = ?");
    values.push(req.body.completed ? 1 : 0);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: "Provide a title or completed value." });
  }

  values.push(id);
  db.prepare(`UPDATE todos SET ${updates.join(", ")} WHERE id = ?`).run(...values);

  const updated = db.prepare(
    "SELECT id, title, completed, created_at FROM todos WHERE id = ?"
  ).get(id);

  res.json({ ...updated, completed: Boolean(updated.completed) });
});

app.delete("/api/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid task ID." });
  }

  const result = db.prepare("DELETE FROM todos WHERE id = ?").run(id);
  if (result.changes === 0) {
    return res.status(404).json({ error: "Task not found." });
  }

  res.json({ message: "Task deleted." });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong on the server." });
});

app.listen(PORT, () => {
  console.log(`Todo API running at http://localhost:${PORT}`);
});
