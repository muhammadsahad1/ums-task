# User Management System - Backend

This is the backend implementation of the User Management System built using **Express.js** and **MongoDB**. It follows the **MVC architecture** for scalability and maintainability.

---

## Features

- **Authentication**:
  - Admin login with email and password.
  - Token-based authentication using **JWT**.
- **Authorization**:
  - Role-based access control for admin features.
- **User Management**:
  - Create, read, update, and delete (CRUD) user data.
- **Pagination**:
  - Efficient pagination for user listings.

---

## Technologies Used

- **Express.js**: Backend framework for building APIs.
- **MongoDB**: Database for storing user information.
- **Mongoose**: For object modeling and schema validation.
- **JWT**: For secure authentication and session management.
- **dotenv**: For environment variable management.

---

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/muhammadsahad1/ums-task.git

2. Navigate to the project directory:
    ```bash
    cd ums-task

3. Install dependencies:
    ``bash
    npm install

4. Create a .env file in the root directory and add the following:
    ```bash
    PORT=5000
    MONGO_URI=<Your MongoDB Connection String>
    JWT_SECRET=<Your Secret Key>

5. start the server
    ```bash
    npm run dev

Admin Credentials
Email: admin@gmail.com
Password: Sahad321@

Project Structure
ums-task/
├── controllers/       # Request handlers
├── models/            # Mongoose schemas
├── routes/            # API route definitions
├── middleware/        # Authentication and authorization
├── utils/             # Utility functions
└── config/            # Configuration files


Authentication
POST /api/auth/admin/login - Login admin and generate a token.

User Management
GET /api/admin/users - Get all users with pagination.
POST /api/admin/user - Create a new user.
PUT /api/admin/users/:id - Update an existing user.
DELETE /api/admin/users/:id - Delete a user.

How to Use
1. Start the backend server:
    ```bash
    npm run dev
2. Use the provided admin credentials to authenticate.
3. Access user management endpoints via the frontend.

Scripts
npm run dev - Run the server in development mode.
npm run start - Start the server in production mode.
