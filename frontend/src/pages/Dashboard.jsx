/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import axios from "axios";

export function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  // FETCH TASKS
  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:5000/api/tasks");
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ADD TASK
  const addTask = async () => {
    if (!title.trim()) return;

    await axios.post("http://localhost:5000/api/tasks", {
      userId: "user123",
      title,
    });

    setTitle("");
    fetchTasks();
  };

  // DELETE TASK
  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`);
    fetchTasks();
  };

  // START EDIT
  const startEdit = (task) => {
    setEditId(task._id);
    setEditText(task.title);
  };

  // UPDATE TASK
  const updateTask = async () => {
    await axios.put(`http://localhost:5000/api/tasks/${editId}`, {
      title: editText,
    });

    setEditId(null);
    setEditText("");
    fetchTasks();
  };

  // TOGGLE COMPLETE
  const toggleComplete = async (task) => {
    await axios.put(`http://localhost:5000/api/tasks/${task._id}`, {
      completed: !task.completed,
    });

    fetchTasks();
  };

  // ✅ RETURN JSX (THIS WAS MISSING)
  return (
    <div className="container">
      <h2 style={{ textAlign: "center" }}>Dashboard</h2>

      {/* ADD TASK */}
      <input
        placeholder="New Task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={addTask}>Add</button>

      {/* TASK LIST */}
      {tasks.map((t) => (
        <div className="task" key={t._id}>
          {editId === t._id ? (
            <>
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
              <button onClick={updateTask}>Save</button>
            </>
          ) : (
            <>
              <span
                style={{
                  textDecoration: t.completed ? "line-through" : "none",
                }}
              >
                {t.title}
              </span>

              <div>
                <button onClick={() => toggleComplete(t)}>
                  {t.completed ? "Undo" : "Done"}
                </button>

                <button onClick={() => startEdit(t)}>Edit</button>

                <button onClick={() => deleteTask(t._id)}>Delete</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
