/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import axios from "axios";

export function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const startEdit = (task) => {
    setEditId(task._id);
    setEditText(task.title);
  };

  const updateTask = async () => {
    await axios.put(`http://localhost:5000/api/tasks/${editId}`, {
      title: editText,
    });

    setEditId(null);
    setEditText("");
    fetchTasks();
  };

  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:5000/api/tasks");
    setTasks(res.data);
  };

  const addTask = async () => {
    await axios.post("http://localhost:5000/api/tasks", {
      userId: "user123",
      title,
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`);
    fetchTasks();
  };

  const toggleComplete = async (task) => {
    await axios.put(`http://localhost:5000/api/tasks/${task._id}`, {
      completed: !task.completed,
    });

    fetchTasks(); // refresh list
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  {
    tasks.map((t) => (
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
              style={{ textDecoration: t.completed ? "line-through" : "none" }}
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
    ));
  }
}
