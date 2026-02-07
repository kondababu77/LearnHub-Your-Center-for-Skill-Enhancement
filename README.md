# LearnHub

> Full Stack Online Learning Platform built with the MERN stack.

## 1. Project Overview

**Project Title:** LearnHub – Your Center for Skill Enhancement
**Project Type:** Full Stack Web Application
**Technology Stack:** MERN (MongoDB, Express.js, React.js, Node.js) with Vite

LearnHub is an Online Learning Platform (OLP) designed to provide a centralized environment where students can learn new skills, teachers can create and manage courses, and administrators can monitor the entire platform. The system focuses on accessibility, structured learning, interactive communication, and certification upon course completion.

The platform follows a client-server architecture to ensure efficient data exchange, scalability, and seamless user experience.

---

## 2. Objectives

* Build a scalable full-stack web application for online education.
* Enable teachers to create and manage courses.
* Allow students to enroll in courses and track progress.
* Provide administrators with complete control over users and courses.
* Implement secure authentication and authorization.
* Deliver a responsive and user-friendly interface.

---

## 3. Key Features

### User-Friendly Interface

The application provides an intuitive UI that allows users of any technical level to easily navigate through courses and features.

### Course Management

Teachers can upload course materials, organize sections, update course details, and manage enrollments.

### Interactivity

Students can engage with course content, track learning progress, and participate in structured modules.

### Certification

Students receive a digital certificate after successfully completing a course.

### Accessibility

The platform supports multiple devices including desktops, tablets, and smartphones.

### Self-Paced Learning

Students can learn at their own pace, and the system remembers their progress.

### Payment Support

Paid courses are available for purchase before enrollment.

---

## 4. Scenario-Based Case Study

Sarah, a student interested in web development, registers on LearnHub using her email and password. After logging in, she browses the course catalog and filters courses by category and popularity. She enrolls in a “Web Development Fundamentals” course and begins learning through video lectures and assignments.

The system tracks her progress, allowing her to resume from where she stopped. After completing the modules and passing the final exam, Sarah downloads her certificate and adds it to her portfolio.

Meanwhile, John, an experienced developer, acts as a teacher. He creates advanced courses, updates content, and monitors student enrollments. The admin oversees platform operations, manages users, and ensures smooth functionality.

---

## 5. Technical Architecture

The LearnHub application follows a **client-server architecture**.

### Frontend

* Built using **React.js** with **Vite** for fast development and optimized production builds.
* Uses **Bootstrap** and **Material UI** to deliver responsive and modern user interfaces.
* Integrates **Axios** to communicate with backend services via RESTful APIs.

### Backend

* Developed with **Node.js** and **Express.js** to handle server-side logic.
* Implements routing, middleware, and API endpoints.
* Uses authentication middleware to protect secured routes.

### Database

* **MongoDB** is used for flexible and scalable data storage.
* Stores user details, course information, enrollments, and payments.

Together, these components enable real-time communication, efficient data handling, and a smooth learning experience.

---

## 6. ER Diagram Description

The database consists of two primary collections:

### Users Collection

Fields:

* `_id` – Automatically generated unique identifier.
* `name` – Name of the user.
* `email` – Unique email address.
* `password` – Encrypted user password.
* `type` – Defines the role (Admin / Teacher / Student).

### Courses Collection

Fields:

* `_id` – Unique course identifier.
* `userID` – References the teacher who created the course.
* `C_educator` – Name of the course instructor.
* `C_categories` – Course category.
* `C_title` – Course title.
* `C_description` – Detailed description.
* `sections` – Course modules.
* `C_price` – Course fee.
* `enrolled` – Number or list of enrolled students.

Additional schemas include payment tracking and enrolled course records.

---

## 7. Application Flow

### Teacher

* Add new courses.
* Delete courses (if no students are enrolled).
* Add sections to courses.

### Student

* Enroll in single or multiple courses.
* Resume learning from the last completed module.
* Purchase paid courses before access.
* Search and filter courses by name or category.
* Download course completion certificates.

### Admin

* Manage all courses.
* Monitor users across the platform.
* Track student enrollments.
* Maintain platform integrity.

---

## 8. Project Structure

### Frontend Structure

```
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── admin/
│   │   ├── common/
│   │   └── user/
│   │       ├── student/
│   │       └── teacher/
│   ├── App.jsx
│   └── main.jsx
```

**Important Components:**

* **AdminHome.jsx** – Admin dashboard.
* **AllCourses.jsx** – Displays available courses.
* **Login/Register.jsx** – Authentication screens.
* **NavBar.jsx** – Navigation across the app.
* **StudentHome.jsx / TeacherHome.jsx** – Role-based dashboards.
* **AddCourse.jsx** – Enables teachers to create courses.
* **CourseContent.jsx** – Displays course material.

Root files include `index.html`, `vite.config.js`, and package configurations.

---

### Backend Structure

```
backend/
├── config/
├── controllers/
├── middlewares/
├── routers/
├── schemas/
├── uploads/
├── index.js
└── package.json
```

**Key Modules:**

* **Controllers:** Handle business logic.
* **Routes:** Define API endpoints.
* **Schemas:** MongoDB data models.
* **Auth Middleware:** Protects private routes.

---

## 9. Prerequisites

To develop and run the application, the following tools are required:

* Node.js (v18+) and npm
* Express.js
* MongoDB (v7+)
* React.js
* Vite
* HTML, CSS, JavaScript
* Mongoose for database connectivity
* Docker (optional, for containerized deployment)

---

## 10. Installation and Setup

### Clone Repository

```bash
git clone <repository-url>
cd LearnHub
```

### Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Configuration

1. Copy the example environment file:
```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your configuration
```

2. Update the `.env` file with your settings:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/learnhub
JWT_SECRET=your_super_secret_jwt_key
```

### Start Development Server

```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory)
npm run dev
```

The application will run at:
- Frontend: `http://localhost:5172`
- Backend API: `http://localhost:5000`

---

## 11. Production Deployment

### Option 1: Docker Deployment (Recommended)

1. Copy and configure environment:
```bash
cp .env.docker .env
# Edit .env with production values
```

2. Build and run with Docker Compose:
```bash
docker-compose up -d --build
```

3. Access the application at `http://localhost`

4. Default admin credentials:
   - Email: admin@learnhub.com
   - Password: Admin@123

### Option 2: Manual Deployment

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Set production environment variables in backend:
```bash
export NODE_ENV=production
export MONGODB_URI=your_mongodb_connection_string
export JWT_SECRET=your_production_secret
export FRONTEND_URL=https://yourdomain.com
```

3. Start the backend server:
```bash
cd backend
npm start
```

---

## 12. Security Features

- **Helmet.js** - Secure HTTP headers
- **Rate Limiting** - API request throttling
- **MongoDB Sanitization** - NoSQL injection prevention
- **HPP** - HTTP Parameter Pollution prevention
- **CORS** - Cross-Origin Resource Security
- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt encryption
- **Input Validation** - express-validator

---

## 13. API Health Check

The backend provides a health check endpoint:
```
GET /health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "environment": "production"
}
```

---

## 14. Workflow for Development

1. Set up frontend and backend environments.
2. Configure MongoDB connection.
3. Implement authentication.
4. Develop course management APIs.
5. Build responsive UI components.
6. Integrate frontend with backend using Axios.
7. Test application features.
8. Deploy for production.

---

## 15. Expected Outcomes

* Fully functional online learning platform.
* Secure role-based access control.
* Efficient course creation and enrollment system.
* Responsive and modern UI.
* Scalable backend architecture.

---

## 16. Future Enhancements

* Live classes integration.
* AI-based course recommendations.
* Advanced analytics dashboard.
* Mobile application support.
* Multi-language support.

---

## 17. Conclusion

LearnHub demonstrates the practical implementation of full-stack technologies to solve real-world educational challenges. By combining a modern frontend with a scalable backend and flexible database, the platform delivers an efficient and engaging learning experience for students, teachers, and administrators.
