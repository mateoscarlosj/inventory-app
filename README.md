# Inventory Management App

A full-stack inventory management application with:
- Backend: FastAPI (Python) REST API with PostgreSQL database
- Frontend: React (TypeScript) and Material UI
- Containerization: Docker & Docker Compose
- Database Migrations: Alembic

## Features

- CRUD products (name, description, price, quantity)
- Database migrations with Alembic
- Responsive React UI with Material-UI
- Dockerized for easy deployment

## Prerequisites
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)


____
# Setup & Run
Clone the repository:

```bash
git clone git@github.com:mateoscarlosj/inventory-app.git
cd inventory-app
```

## Start services with Docker Compose

```bash
docker-compose up --build
```

This will build and start:

- PostgreSQL database (postgres service)

- FastAPI backend (backend service)

- React frontend (frontend service)

The backend runs on [http://localhost:8000](http://localhost:8000)

The frontend runs on [http://localhost:3000](http://localhost:3000)

## Environment Variables

You can configure environment variables in .env or inside docker-compose.yml:

- DATABASE_URL: PostgreSQL connection string (default: postgres://inventory:inventory@postgres:5432/inventorydb)

- SECRET_KEY: JWT secret key

- ALGORITHM: JWT algorithm (default: HS256)

- ACCESS_TOKEN_EXPIRE_MINUTES: Token expiration time


## Testing Users
You can use the following test accounts to authenticate and try out the application:

User1:
 - Username: cjtest123
 - Password: secret123

User2:
 - Username: usertest2
 - Password: secret123

___

# Development

### Backend
1. Go to backend folder:
```bash
cd backend
```

2. Create a virtual environment (if you don't have one yet):
```bash
python3 -m venv venv
```

3. Activate the virtual environment:

- On Linux/macOS:
```bash
source venv/bin/activate
```
- On Windows (cmd.exe):
```bash
.\venv\Scripts\activate.bat
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Run the server with auto-reload:
```bash
uvicorn main:app --reload
```


### Frontend
1. Go to frontend folder:
```bash
cd frontend
```
2. Install dependencies:
```bash
npm install
```

3. Start frontend:
```bash
npm start
```
___

# API Documentation


### Accessing the API docs
Once the backend server is running (by default on http://localhost:8000), you can access the documentation at:

 - Swagger UI (Interactive API Explorer): [http://localhost:8000/docs](http://localhost:8000/docs)

- Redoc (Static API Reference): [http://localhost:8000/redoc](http://localhost:8000/redoc)