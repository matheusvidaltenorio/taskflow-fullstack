# 🚀 TaskFlow - Fullstack Task Manager

Sistema fullstack de gerenciamento de tarefas com autenticação JWT.

🌍 **Aplicação Online:**  
Frontend: https://taskflow-fullstack-7103.onrender.com/  
Backend: https://taskflow-backend-l2s0.onrender.com  

---

## 📌 Tecnologias Utilizadas

### 🖥 Frontend
- React
- Vite
- Axios
- CSS personalizado
- Deploy via Render (Static Site)

### ⚙ Backend
- Node.js
- Express
- SQLite
- JWT (Autenticação)
- Bcrypt (Criptografia de senha)
- CORS
- Deploy via Render (Web Service)

---

## 🔐 Funcionalidades

✅ Registro de usuário  
✅ Login com autenticação JWT  
✅ Persistência de login com localStorage  
✅ Criar tarefas  
✅ Marcar tarefa como concluída  
✅ Deletar tarefa  
✅ Logout  
✅ Proteção de rotas no backend  

---

## 🧠 Como funciona

1. Usuário se registra
2. Senha é criptografada com bcrypt
3. Login gera um token JWT
4. Token é armazenado no localStorage
5. Requisições protegidas enviam token no header `Authorization`
6. Middleware valida o token antes de liberar acesso às tarefas

---

## ⚙️ Rodando localmente

### 🔹 Clonar repositório

```bash
git clone https://github.com/matheusvidaltenorio/taskflow-fullstack.git
