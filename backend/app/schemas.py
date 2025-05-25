from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    firstname: str
    lastname: str
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    firstname: str
    lastname: str
    email: EmailStr
    created: datetime


    class Config:
        orm_mode = True


class ProductBase(BaseModel):
    name: str
    description: str | None = None
    price: int
    quantity: int
    

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True
