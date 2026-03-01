import { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";
import Loader from "./components/Loader";     
import Toast from "./components/Toast";

const API = "http://localhost:3000";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("success");

  useEffect(() => {
  if (toast) {
    const timer = setTimeout(() => {
      setToast("");
    }, 3000);

    return () => clearTimeout(timer);
  }
}, [toast]);

  async function register() {
  try {
    setLoading(true);
    await axios.post(`${API}/register`, { email, password });

    setToast("Usuário criado com sucesso!");
    setToastType("success");

    
    setEmail("");
    setPassword("");

  } catch {
    setToast("Erro ao registrar");
    setToastType("error");
  } finally {
    setLoading(false);
  }
}

  async function login() {
  try {
    setLoading(true);
    const res = await axios.post(`${API}/login`, { email, password });

    setToken(res.data.token);
    localStorage.setItem("token", res.data.token);

    setToast("Login realizado!");
    setToastType("success");

    
    setEmail("");
    setPassword("");

  } catch {
    setToast("Erro ao logar");
    setToastType("error");
  } finally {
    setLoading(false);
  }
}

useEffect(() => {
  const saved = localStorage.getItem("token");
  if (saved) {
    setToken(saved);
  }
}, []);

  async function loadTasks() {
    const res = await axios.get(`${API}/tasks`, {
      headers: { Authorization: token },
    });
    setTasks(res.data);
  }

 async function addTask() {
  await axios.post(
    `${API}/tasks`,
    { title },
    { headers: { Authorization: token } }
  );

  setTitle(""); 
  loadTasks();
}

  async function toggleTask(id, completed) {
    await axios.put(
      `${API}/tasks/${id}`,
      { completed: completed ? 0 : 1 },
      { headers: { Authorization: token } }
    );
    loadTasks();
  }

  async function deleteTask(id) {
    await axios.delete(`${API}/tasks/${id}`, {
      headers: { Authorization: token },
    });
    loadTasks();
  }

  useEffect(() => {
    if (token) loadTasks();
  }, [token]);

 function logout() {
  localStorage.removeItem("token");
  setToken("");
  setTasks([]);

  
  setEmail("");
  setPassword("");
  setTitle("");

  setToast("Logout realizado!");
  setToastType("success");
}

  return (
  <div className="container">
    <Toast message={toast} type={toastType} />
    {!token ? (
      <>
        <h2>TaskFlow</h2>
        <input
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />
        <input
          placeholder="Senha"
          type="password"
          onChange={e => setPassword(e.target.value)}
        />
        <button className="success" onClick={register}>
          Registrar
        </button>
        <button className="primary" onClick={login}>
          Login
        </button>
      </>
    ) : (
      <>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Minhas Tarefas</h2>
          <button className="danger" onClick={logout}>
            Logout
          </button>
        </div>
        <input
           placeholder="Nova tarefa"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <button className="primary" onClick={addTask}>
          Adicionar
        </button>

        {tasks.map(task => (
          <div className="task" key={task.id}>
            <span
              style={{
                textDecoration: task.completed ? "line-through" : "none"
              }}
              onClick={() => toggleTask(task.id, task.completed)}
            >
              {task.title}
            </span>
            <button
              className="danger"
              onClick={() => deleteTask(task.id)}
            >
              X
            </button>
          </div>
        ))}
      </>
    )}
  </div>
);
}

export default App;