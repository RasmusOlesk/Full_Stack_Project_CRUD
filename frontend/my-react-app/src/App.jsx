import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { useEffect, useState } from "react";
import {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
} from "./services/taskService";
import "./App.css";

const emptyForm = {
    title: "",
    description: "",
    priority: "Medium",
    status: "Pending",
    dueDate: "",
};

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
    const [tasks, setTasks] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadTasks();
    }, []);

    async function loadTasks() {
        try {
            const data = await getTasks();
            setTasks(data);
        } catch {
            setError("Ülesannete laadimine ebaõnnestus");
        }
    }

    function handleChange(event) {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setMessage("");

        try {
            const taskData = {
                ...form,
                dueDate: new Date(form.dueDate).toISOString(),
            };

            if (editingId) {
                await updateTask(editingId, taskData);
                setMessage("Ülesanne muudeti edukalt");
            } else {
                await createTask(taskData);
                setMessage("Ülesanne lisati edukalt");
            }

            setForm(emptyForm);
            setEditingId(null);
            await loadTasks();
        } catch {
            setError("Salvestamine ebaõnnestus");
        }
    }

    function startEdit(task) {
        setEditingId(task.id);
        setForm({
            title: task.title,
            description: task.description,
            priority: task.priority,
            status: task.status,
            dueDate: task.dueDate.slice(0, 10),
        });
    }

    async function handleDelete(id) {
        try {
            await deleteTask(id);
            setMessage("Ülesanne kustutati");
            await loadTasks();
        } catch {
            setError("Kustutamine ebaõnnestus");
        }
    }

    return (
        <main className="app">
            <h1>Task Manager</h1>

            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}

            <form onSubmit={handleSubmit} className="task-form">
                <input
                    name="title"
                    placeholder="Pealkiri"
                    value={form.title}
                    onChange={handleChange}
                    required
                />

                <textarea
                    name="description"
                    placeholder="Kirjeldus"
                    value={form.description}
                    onChange={handleChange}
                />

                <select name="priority" value={form.priority} onChange={handleChange}>
                    <option value="Low">Madal</option>
                    <option value="Medium">Keskmine</option>
                    <option value="High">Kõrge</option>
                </select>

                <select name="status" value={form.status} onChange={handleChange}>
                    <option value="Pending">Ootel</option>
                    <option value="InProgress">Töös</option>
                    <option value="Done">Valmis</option>
                </select>

                <input
                    type="date"
                    name="dueDate"
                    value={form.dueDate}
                    onChange={handleChange}
                    required
                />

                <button type="submit">
                    {editingId ? "Salvesta muudatused" : "Lisa ülesanne"}
                </button>
            </form>

            <section className="task-list">
                {tasks.map((task) => (
                    <article key={task.id} className="task-card">
                        <h2>{task.title}</h2>
                        <p>{task.description}</p>
                        <p>Prioriteet: {task.priority}</p>
                        <p>Staatus: {task.status}</p>
                        <p>Tähtaeg: {new Date(task.dueDate).toLocaleDateString()}</p>

                        <button onClick={() => startEdit(task)}>Muuda</button>
                        <button onClick={() => handleDelete(task.id)}>Kustuta</button>
                    </article>
                ))}
            </section>
        </main>
    );
}

export default App
export default App;