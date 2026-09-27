# Learning Management System (LMS)

React.js + Bootstrap frontend and Node.js + Express.js + MongoDB backend.

## Project Structure

- `frontend/` - React + Vite + Bootstrap admin/application frontend
- `backend/` - Node.js + Express + Mongoose API
- `frontend/src/components/` - reusable UI components
- `frontend/src/pages/` - admin, instructor, student and auth pages
- `frontend/src/routes/` - frontend routing
- `frontend/src/services/` - API/service layer
- `backend/src/config/` - database and application configuration
- `backend/src/models/` - MongoDB/Mongoose models
- `backend/src/controllers/` - request controllers
- `backend/src/routes/` - API routes
- `backend/src/middlewares/` - middleware
- `backend/src/services/` - business/service layer
- `backend/src/validators/` - request validation

## Requirements

- Node.js 18+
- MongoDB local installation or MongoDB Atlas

## 1. Backend

```bash
cd backend
copy .env.example .env
npm install
npm run dev
```

For Linux/macOS:

```bash
cp .env.example .env
npm install
npm run dev
```

Backend:
`http://localhost:5016`

Health check:
`http://localhost:5016/api/health`

## 2. Frontend

Open another terminal:

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

For Linux/macOS:

```bash
cp .env.example .env
npm install
npm run dev
```

Frontend:
`http://localhost:5173`

## MongoDB

Default database:

`lms_database`

Change `MONGO_URI` inside `backend/.env` if using MongoDB Atlas.

## Next Development Steps

The project intentionally starts with a clean structure. We can add functionality one module at a time:

1. Admin navbar
2. Admin sidebar
3. Admin dashboard
4. Login/authentication
5. Roles and authorization
6. User management
7. Course management
8. Category management
9. Instructor management
10. Student management
11. Lessons/videos/materials
12. Enrollment
13. Assessments/quizzes
14. Reports
15. Settings
