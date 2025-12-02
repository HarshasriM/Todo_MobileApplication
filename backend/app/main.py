from fastapi import FastAPI
from app.database import init_db
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth_routes, user_routes, todos_routes

app = FastAPI(title="Todo API")

@app.on_event("startup")
def on_startup():
    init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


app.include_router(auth_routes.router)
app.include_router(user_routes.router)
app.include_router(todos_routes.router)


@app.get("/")
def read_root():
    return {"message": "Todo API is running 🚀"}
