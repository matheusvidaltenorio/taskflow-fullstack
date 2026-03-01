const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./database");
const authMiddleware = require("./middleware");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  db.run(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, hashed],
    function (err) {
      if (err) return res.status(400).json({ message: "Usuário já existe" });
      res.json({ message: "Usuário criado" });
    }
  );
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, user) => {
      if (!user) return res.status(400).json({ message: "Usuário não encontrado" });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(400).json({ message: "Senha inválida" });

      const token = jwt.sign({ id: user.id }, "secret_key", {
        expiresIn: "1d",
      });

      res.json({ token });
    }
  );
});

app.get("/tasks", authMiddleware, (req, res) => {
  db.all(
    "SELECT * FROM tasks WHERE user_id = ?",
    [req.userId],
    (err, tasks) => {
      res.json(tasks);
    }
  );
});

app.post("/tasks", authMiddleware, (req, res) => {
  const { title } = req.body;

  db.run(
    "INSERT INTO tasks (title, user_id) VALUES (?, ?)",
    [title, req.userId],
    function () {
      res.json({ id: this.lastID, title, completed: 0 });
    }
  );
});

app.put("/tasks/:id", authMiddleware, (req, res) => {
  const { completed } = req.body;

  db.run(
    "UPDATE tasks SET completed = ? WHERE id = ? AND user_id = ?",
    [completed, req.params.id, req.userId],
    () => {
      res.json({ message: "Atualizado" });
    }
  );
});

app.delete("/tasks/:id", authMiddleware, (req, res) => {
  db.run(
    "DELETE FROM tasks WHERE id = ? AND user_id = ?",
    [req.params.id, req.userId],
    () => {
      res.json({ message: "Deletado" });
    }
  );
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));