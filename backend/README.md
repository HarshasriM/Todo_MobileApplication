# Todo API Backend

[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688.svg)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11-blue.svg)](https://www.python.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791.svg)](https://www.postgresql.org/)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-red.svg)](https://www.sqlalchemy.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A production-ready REST API backend for the Todo Mobile Application, built with FastAPI, PostgreSQL, and modern Python best practices. Features secure JWT authentication, comprehensive CRUD operations, and scalable architecture.

## Overview

This backend service provides a robust foundation for todo management applications with enterprise-grade security, data persistence, and API design. Built using FastAPI for high performance and automatic API documentation, integrated with PostgreSQL for reliable data storage.

## Features

### Core Functionality
- **JWT Authentication**: Secure user registration and login with token-based authentication
- **User Management**: Complete user profile management with secure password handling
- **Todo Operations**: Full CRUD operations for todo items with user isolation
- **Database Integration**: PostgreSQL with SQLAlchemy ORM for reliable data persistence
- **API Documentation**: Automatic interactive API documentation with Swagger UI

### Security & Performance
- **Password Security**: Bcrypt hashing for password storage
- **Token Management**: JWT tokens with configurable expiration
- **Input Validation**: Comprehensive request validation using Pydantic
- **Error Handling**: Structured error responses with proper HTTP status codes
- **CORS Support**: Configurable cross-origin resource sharing

### Architecture
- **Modular Design**: Clean separation of concerns with routers, models, and utilities
- **Dependency Injection**: FastAPI's dependency system for clean code architecture
- **Environment Configuration**: Secure configuration management with environment variables
- **Database Migrations**: SQLAlchemy-based database schema management

## Technology Stack

### Backend Framework
- **FastAPI**: Modern, fast web framework for building APIs with Python 3.11+
- **Uvicorn**: ASGI server for high-performance async/await support
- **Pydantic**: Data validation and serialization using Python type annotations

### Database & ORM
- **PostgreSQL**: Advanced open-source relational database
- **SQLAlchemy**: Python SQL toolkit and Object-Relational Mapping (ORM) library
- **Psycopg2**: PostgreSQL adapter for Python

### Security & Authentication
- **JWT (JSON Web Tokens)**: Stateless authentication mechanism
- **Bcrypt**: Secure password hashing algorithm
- **Python-JOSE**: JWT token creation and validation

### Development Tools
- **Python-dotenv**: Environment variable management
- **Python-multipart**: Form data parsing support

## Project Architecture

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application entry point
│   ├── config.py              # Application configuration
│   ├── database.py            # Database connection and session management
│   ├── models.py              # SQLAlchemy database models
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth_routes.py     # Authentication endpoints
│   │   ├── user_routes.py     # User management endpoints
│   │   └── todos_routes.py    # Todo CRUD endpoints
│   └── utils/
│       ├── __init__.py
│       ├── auth.py            # Authentication utilities
│       └── dependencies.py    # FastAPI dependencies
├── requirements.txt           # Python dependencies
├── .env.example              # Environment variables template
└── README.md                 # Project documentation
```

## Installation & Setup

### Prerequisites
- Python 3.11 or higher
- PostgreSQL 12 or higher
- pip (Python package installer)

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/HarshasriM/Todo_MobileApplication.git
   cd Todo_MobileApplication/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   
   # Windows
   .\venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Database Setup**
   
   Create a PostgreSQL database:
   ```sql
   CREATE DATABASE todo_db;
   CREATE USER todo_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE todo_db TO todo_user;
   ```

5. **Environment Configuration**
   
   Create a `.env` file in the backend root directory:
   ```env
   # Database Configuration
   DATABASE_URL=postgresql+psycopg2://todo_user:your_password@localhost:5432/todo_db
   
   # JWT Configuration
   JWT_SECRET_KEY=your-super-secret-jwt-key-here
   ACCESS_TOKEN_EXPIRE_MINUTES=1440
   
   # Application Configuration
   DEBUG=True
   CORS_ORIGINS=["http://localhost:3000", "http://127.0.0.1:3000"]
   ```

6. **Initialize Database**
   ```bash
   python -c "from app.database import engine; from app.models import Base; Base.metadata.create_all(bind=engine)"
   ```

## Running the Application

### Development Mode
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Production Mode
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```



### API Documentation

### Interactive Documentation
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`


### API Usage Examples

### Authentication

**User Registration:**
```bash
curl -X POST "http://localhost:8000/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "full_name": "John Doe",
    "password": "securepassword123"
  }'
```

**User Login:**
```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123"
  }'
```

### Todo Operations

**Create Todo:**
```bash
curl -X POST "http://localhost:8000/todos/" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project documentation",
    "description": "Write comprehensive README files"
  }'
```

**Get All Todos:**
```bash
curl -X GET "http://localhost:8000/todos/" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Update Todo:**
```bash
curl -X PATCH "http://localhost:8000/todos/1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated task title",
    "description": "Updated description"
  }'
```

**Mark Todo Complete:**
```bash
curl -X PATCH "http://localhost:8000/todos/1/complete" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Todos Table
```sql
CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the coding standards
4. Add tests for new functionality
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Style
- Follow PEP 8 guidelines
- Use type hints for all functions
- Write comprehensive docstrings
- Maintain test coverage above 90%

---

**Built with ❤️ using FastAPI and modern Python practices**

