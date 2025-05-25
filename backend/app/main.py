from app.settings import settings
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routes import  products, users

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Invetory System",
    docs_url="/docs",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.allow_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(users.router, prefix="/v1/api")
app.include_router(products.router, prefix="/v1/api")
