import { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:5000/api/todos";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadTodos() {
    try {
      setError("");
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Could not load tasks.");
      setTodos(await response.json());
    } catch (err) {
      setError(`${err.message} Make sure the backend is running on port 5000.`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTodos();
  }, []);

  async function addTodo(event) {
    event.preventDefault();
    const title = newTitle.trim();
    if (!title) return;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not add task.");
      setTodos((current) => [data, ...current]);
      setNewTitle("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleTodo(todo) {
    try {
      const response = await fetch(`${API_URL}/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not update task.");
      setTodos((current) => current.map((item) => item.id === todo.id ? data : item));
    } catch (err) {
      setError(err.message);
    }
  }

  async function saveEdit(id) {
    const title = editingTitle.trim();
    if (!title) {
      setError("Task title cannot be empty.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save task.");
      setTodos((current) => current.map((item) => item.id === id ? data : item));
      setEditingId(null);
      setEditingTitle("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteTodo(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not delete task.");
      setTodos((current) => current.filter((todo) => todo.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  const visibleTodos = useMemo(() => todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  }), [todos, filter]);

  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <main className="page">
      <section className="todo-card">
        <header className="header">
          <div>
            <p className="eyebrow">STAY ORGANIZED</p>
            <h1>My Todo List</h1>
            <p className="subtitle">Small steps make big progress.</p>
          </div>
          <div className="count-badge">{completedCount}/{todos.length} done</div>
        </header>

        <form className="add-form" onSubmit={addTodo}>
          <input
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            placeholder="What do you need to do?"
            aria-label="New task"
            maxLength={200}
          />
          <button type="submit">Add task</button>
        </form>

        {error && <p className="error" role="alert">{error}</p>}

        <nav className="filters" aria-label="Filter tasks">
          {["all", "active", "completed"].map((value) => (
            <button
              type="button"
              key={value}
              className={filter === value ? "filter active-filter" : "filter"}
              onClick={() => setFilter(value)}
            >
              {value[0].toUpperCase() + value.slice(1)}
            </button>
          ))}
        </nav>

        {loading ? (
          <p className="empty">Loading tasks...</p>
        ) : visibleTodos.length === 0 ? (
          <div className="empty">
            <span className="empty-icon">✓</span>
            <p>{todos.length === 0 ? "No tasks yet. Add your first task!" : "No tasks in this filter."}</p>
          </div>
        ) : (
          <ul className="todo-list">
            {visibleTodos.map((todo) => (
              <li className="todo-item" key={todo.id}>
                <input
                  className="check"
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo)}
                  aria-label={`Mark ${todo.title} as ${todo.completed ? "active" : "completed"}`}
                />

                {editingId === todo.id ? (
                  <form
                    className="edit-form"
                    onSubmit={(event) => { event.preventDefault(); saveEdit(todo.id); }}
                  >
                    <input
                      autoFocus
                      value={editingTitle}
                      onChange={(event) => setEditingTitle(event.target.value)}
                      aria-label="Edit task title"
                      maxLength={200}
                    />
                    <button type="submit" className="small-button save">Save</button>
                    <button type="button" className="small-button" onClick={() => setEditingId(null)}>Cancel</button>
                  </form>
                ) : (
                  <>
                    <span className={todo.completed ? "todo-title completed" : "todo-title"}>
                      {todo.title}
                    </span>
                    <div className="actions">
                      <button
                        type="button"
                        className="icon-button"
                        aria-label={`Edit ${todo.title}`}
                        onClick={() => { setEditingId(todo.id); setEditingTitle(todo.title); }}
                      >Edit</button>
                      <button
                        type="button"
                        className="icon-button delete"
                        aria-label={`Delete ${todo.title}`}
                        onClick={() => deleteTodo(todo.id)}
                      >Delete</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}

        <footer className="footer">
          {todos.length - completedCount} task(s) remaining
        </footer>
      </section>
      <p className="credit">React · Node.js · Express · SQLite</p>
    </main>
  );
}
