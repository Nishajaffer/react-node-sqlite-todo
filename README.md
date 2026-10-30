# Full-Stack Todo App

A beginner-friendly Todo application built with React (Vite), Node.js, Express, and SQLite.

## Features
- Create, list, edit, complete, and delete tasks
- Tasks persist in a local SQLite database (`backend/todos.db`)
- React frontend communicates with the Express REST API

## Requirements
- Node.js 20.19+ or 22.12+
- npm

## 1. Start the backend

Open Terminal:

```bash
cd backend
npm install
npm run dev
```

The API runs at http://localhost:5000. The SQLite database is created automatically.

Test it by opening http://localhost:5000/api/health in your browser. You should see:

```json
{"status":"ok"}
```

## 2. Start the frontend

Open a **second Terminal window**:

```bash
cd react-node-sqlite-todo/frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually http://localhost:5173.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/todos` | Get all tasks |
| POST | `/api/todos` | Create a task |
| PUT | `/api/todos/:id` | Update task text or completion |
| DELETE | `/api/todos/:id` | Delete a task |

Example POST body:

```json
{"title":"Learn React"}
```

## 3. Push the project to GitHub

Create an empty repository on GitHub (do not add a README, license, or .gitignore if you already have these files locally).

In Terminal, move into the project root (the folder containing this README):

```bash
cd path/to/react-node-sqlite-todo
git init
git add .
git commit -m "Initial commit: full-stack todo app"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace `YOUR-USERNAME` and `YOUR-REPOSITORY` with your GitHub username and repository name.

For later changes:

```bash
git add .
git commit -m "Describe your changes"
git push
```

## Important Git note
The `.gitignore` excludes `node_modules`, local SQLite database files, and environment files. Your code will be pushed, but your locally created task data will not. Never commit passwords, API keys, or other secrets.

## Troubleshooting
- If `npm run dev` says a package is missing, run `npm install` in that app's folder.
- If port 5000 is already in use, stop the other process using it before starting this backend.
- Keep both Terminal windows running while using the app.
