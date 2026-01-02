# 📝 Task Management System (MERN Stack)

A full-stack **Task Management System** built using the **MERN stack** that allows users to create, manage, and track tasks with role-based access control, priority management, and secure authentication.

This project fulfills all the requirements of a **Simple Task Management System** and demonstrates clean backend architecture, structured frontend components, and proper authorization handling.

## 🚀 Features Overview

### 🔐 Authentication & Authorization
- Secure user authentication using **JWT**
- Password hashing with **bcrypt**
- Users can register as:
  - **Admin**
  - **User**
- Role-based access is enforced across the application
  
### 👥 Role-Based Permissions

#### 👑 Admin
- Create, edit, delete **any task**
- Assign tasks to users
- View all tasks in the system
- Change task priority (Low / Medium / High)
- Update task status (Pending / Completed)
- Manage users (add / remove users)

#### 👤 User
- Full control over **tasks they create**
  - Edit
  - Delete
  - Update status
- For tasks **assigned by Admin**:
  - Can **view task details**
  - Can **mark task as Completed / Pending**
  - ❌ Cannot edit or delete those tasks
- Cannot manage users

## ✅ Task Management Features

### 🆕 Task Creation
- Users can create tasks with:
  - Title
  - Description
  - Due Date
  - Priority (Low / Medium / High)
- Admin can assign tasks to any user
- Users can create tasks for themselves

### 📋 Task Listing
- Tasks are displayed in a paginated list
- Data is fetched using **AJAX (Axios)** without page reload
- Each task displays:
  - Title
  - Due Date
  - Priority
  - Status (Pending / Completed)

### 🔍 Task Details
- View complete task details including:
  - Description
  - Due date
  - Assigned user
  - Creator information

### ✏️ Task Editing
- Edit task title, description, due date, and priority
- Permission-based editing:
  - Admin → can edit all tasks
  - User → can edit only tasks they created

### 🗑 Task Deletion
- Tasks can be deleted with a confirmation dialog
- Deletion permissions:
  - Admin → can delete any task
  - User → can delete only tasks they created

### 🔄 Task Status Update
- Tasks can be marked as:
  - Pending
  - Completed
- Assigned users can update task status

## 🎯 Priority Management (Priority Board)

- Dedicated **Priority Board** view
- Tasks grouped into:
  - 🔴 High (Urgent)
  - 🟡 Medium
  - 🟢 Low
- Tasks can be moved between priority levels
- Priority changes are reflected instantly in the database
- Each priority level is **color-coded** for quick visual identification

---

## 🎨 Visual Representation
- Clean and responsive UI
- Color-coded priority badges
- Status indicators for quick task tracking
- Modal-based forms for better UX

## 🛠️ Tech Stack

### Frontend
- React.js
- Context API (Authentication State)
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (Authentication)
- bcrypt (Password Hashing)

## ⚙️ Installation & Setup

### 📦 Clone Repository

git clone <repository-url>
cd Task-Management-System
```bash
🔧 Backend Setup
cd backend
npm install
npm start
```

Create a .env file in backend directory:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```bash
💻 Frontend Setup
cd frontend
npm install
npm start

```


Frontend will run on:

http://localhost:3000


Backend API runs on:

http://localhost:5000


📁 Project Folder Structure

```bash

Task-Management-System/
│
├── backend/
│   ├── controllers/
│   │   ├── authController.js        # Authentication logic (login/register)
│   │   ├── taskController.js        # Task CRUD, status & priority handling
│   │   └── userController.js        # User management (admin only)
│   │
│   ├── middleware/
│   │   └── auth.js                  # JWT authentication middleware
│   │
│   ├── models/
│   │   ├── User.js                  # User schema (role-based)
│   │   └── Task.js                  # Task schema
│   │
│   ├── routes/
│   │   ├── authRoutes.js            # Auth-related routes
│   │   ├── taskRoutes.js            # Task-related routes
│   │   └── userRoutes.js            # User management routes
│   │
│   ├── .env                         # Environment variables (ignored in git)
│   ├── package.json
│   └── server.js                    # Express server entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── TaskCard.js
│   │   │   ├── CreateTaskModal.js
│   │   │   ├── EditTaskModal.js
│   │   │   ├── DeleteTaskModal.js
│   │   │   ├── TaskDetailsModal.js
│   │   │   ├── AdminRoute.js        # Admin-only route protection
│   │   │   └── PrivateRoute.js      # Auth-protected routes
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── PriorityBoard.js
│   │   │   ├── Users.js
│   │   │   └── UserManagement.js
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.js       # Global auth & role state
│   │   │
│   │   ├── config/
│   │   │   └── api.js               # Axios & API configuration
│   │   │
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   │
│   └── package.json
│
├── .gitignore
├── README.md
└── package-lock.json

```



