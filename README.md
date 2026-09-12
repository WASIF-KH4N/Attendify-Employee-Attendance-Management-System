# Attendify — Employee Attendance Management System

Attendify is a full-stack **Employee Attendance Management System** built using the **MERN stack**. It provides a centralized platform for managing employee records, tracking daily attendance, viewing attendance history, monitoring statistics, and generating monthly attendance reports.

The system includes secure authentication, employee management, attendance tracking, dashboard analytics, department-based filtering, and CSV report export.

---

## Features

### 🔐 Authentication

* User registration and login
* JWT-based authentication
* HTTP-only cookies for authentication tokens
* Protected frontend and backend routes
* Secure password hashing using bcryptjs
* Logout and profile management

### 👥 Employee Management

* Add, edit, view, and delete employees
* Employee information management
* Search employees by name, phone, CNIC, or father's name
* Filter employees by department
* Active/inactive employee status
* Pagination for employee records
* Employee attendance history

### 🕐 Attendance Management

* Mark daily employee attendance
* Update existing attendance records
* Attendance statuses:

  * Present
  * Absent
  * Late
  * Leave
  * Half-day
  * Holiday
* Record time in, time out, and notes
* Prevent duplicate attendance for the same employee and date
* View marked and unmarked employees

### 📊 Dashboard

* Total employees
* Present, absent, and late employees
* Employees on leave
* Half-day statistics
* Unmarked employees
* Monthly attendance percentage
* Recent attendance records
* Quick actions for common tasks

### 📅 Attendance Reports

* Generate monthly attendance reports
* Filter reports by month, year, and department
* View employee-level attendance statistics
* Export reports as CSV files

---

## Technology Stack

### Frontend

* React
* Vite
* React Router
* Axios
* Tailwind CSS

### Backend

* Node.js
* Express.js
* Mongoose
* JWT
* bcryptjs

### Database

* MongoDB

---

## Project Structure

```text
Attendify/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── services/
│   │   └── ...
│   └── ...
│
└── README.md
