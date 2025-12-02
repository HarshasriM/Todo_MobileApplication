# 🧩 Todo API – Backend (FastAPI + PostgreSQL)

A secure REST API built with **FastAPI**, **PostgreSQL**, **SQLAlchemy**, and **JWT authentication**.

---

## 🚀 Features

- JWT authentication (Login & Signup)
- Create, list and complete todos
- User profile route
- SQLAlchemy ORM with PostgreSQL
- Proper project structure with routers, models, schemas, dependencies
- `.env` file for sensitive data

---

## 🛠 Tech Stack

- Python FastAPI
- SQLModel + SQLAlchemy
- PostgreSQL
- JWT Authentication
- Uvicorn
- dotenv

---

## 📁 Project Structure

```
app/
  main.py
  database.py
  models.py
  schemas.py
  utils/
    auth.py
    dependencies.py
  routers/
    auth_routes.py
    user_routes.py
    todo_routes.py
```

---

## 🔐 Environment Variables

Create a `.env` file:

```
DATABASE_URL=postgresql+psycopg2://postgres:<password>@localhost:5432/todo_db
JWT_SECRET_KEY=your_secret
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

(Do NOT commit this file)

---

## ▶️ Run the Backend

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the server:

```bash
uvicorn app.main:app --reload
```

Swagger UI:

```
http://127.0.0.1:8000/docs
```

---

## 🧪 API Endpoints

### Auth

#### Signup

```bash
curl -X POST http://127.0.0.1:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","full_name":"Test User","password":"password123"}'
```

#### Login

```bash
curl -X POST http://127.0.0.1:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

### Profile

```bash
curl http://127.0.0.1:8000/users/me \
  -H "Authorization: Bearer <token>"
```

---

### Todos

#### List todos

```bash
curl http://127.0.0.1:8000/todos/ \
  -H "Authorization: Bearer <token>"
```

#### Create Todo

```bash
curl -X POST http://127.0.0.1:8000/todos/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"My new todo"}'
```

#### Mark complete

```bash
curl -X PATCH http://127.0.0.1:8000/todos/1/complete \
  -H "Authorization: Bearer <token>"
```

#### Edit todo

```bash
curl -X PUT http://127.0.0.1:8000/todos/1/edit \
  -H "Authorization: Bearer <token>"\
  -H "Content-Type: application/json" \
  -d '{"title":"My edited todo"}'
```

