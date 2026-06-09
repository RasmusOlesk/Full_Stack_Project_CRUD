import { useEffect, useState } from "react";
import { createTask, deleteTask, getTasks, updateTask } from "./services/taskService";
import "./App.css";

const emptyForm = {
  title: "",
  description: "",
  priority: "Medium",
  status: "Pending",
  dueDate: "",
};

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // -----------------------------
  // Andmete laadimine
  // -----------------------------
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setTasks(await getTasks());
    } catch {
      setError("Ülesannete laadimine ebaõnnestus");
    }
  };

  // -----------------------------
  // Event handlerid
  // -----------------------------
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const taskData = {
      ...form,
      dueDate: new Date(form.dueDate).toISOString(),
    };

    try {
      if (editingId) {
        await updateTask(editingId, taskData);
        setMessage("Ülesanne muudeti edukalt");
      } else {
        await createTask(taskData);
        setMessage("Ülesanne lisati edukalt");
      }

      setForm(emptyForm);
      setEditingId(null);
      loadTasks();
    } catch {
      setError("Salvestamine ebaõnnestus");
    }
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate.slice(0, 10),
    });
  };

  const handleDelete = async (id) => {
    setError("");
    setMessage("");

    try {
      await deleteTask(id);
      setMessage("Ülesanne kustutati");
      loadTasks();
    } catch {
      setError("Kustutamine ebaõnnestus");
    }
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <main className="app">
      <h1>Task Manager</h1>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      {/* Vorm */}
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

      {/* Ülesannete nimekiri */}
      {tasks.length === 0 ? (
        <p className="empty-state">Ühtegi ülesannet ei ole veel lisatud.</p>
      ) : (
        <section className="task-list">
          {tasks.map((task) => (
            <article key={task.id} className="task-card">
              <h2>{task.title}</h2>
              <p>{task.description}</p>
              <p>Prioriteet: {task.priority}</p>
              <p>Staatus: {task.status}</p>
              <p>Tähtaeg: {new Date(task.dueDate).toLocaleDateString()}</p>

              <div className="task-actions">
                <button onClick={() => startEdit(task)}>Muuda</button>
                <button onClick={() => handleDelete(task.id)}>Kustuta</button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
