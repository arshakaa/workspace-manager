# 🚀 Workspace Manager

A modern full-stack web application for managing workspaces with authentication, built with React, Node.js, Express, and MySQL.

![React](https://img.shields.io/badge/React-18.0.0-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-16.0.0-green.svg)
![Express](https://img.shields.io/badge/Express-4.18.0-lightgrey.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)
![Chakra UI](https://img.shields.io/badge/Chakra%20UI-2.8.0-purple.svg)

## ✨ Features

-   🔐 **JWT Authentication** - Secure signup/login with bcrypt password hashing
-   📁 **Workspace Management** - Full CRUD operations with unique slug generation
-   ⚡ **Real-time Slug Checking** - Debounced availability checking with smart suggestions
-   🛡️ **Protected Routes** - React Router with authentication middleware
-   🎨 **Modern UI** - Beautiful Chakra UI components with responsive design
-   📝 **Form Management** - React Hook Form for robust validation
-   🔔 **Toast Notifications** - User-friendly feedback for all actions
-   🎣 **Custom Hooks** - Reusable authentication and workspace management logic

## 🛠️ Tech Stack

### Frontend

-   **React 18** - UI framework with hooks
-   **React Router DOM** - Client-side routing with auth middleware
-   **Chakra UI** - Component library and styling
-   **React Hook Form** - Form management and validation
-   **Custom Hooks** - Authentication and workspace management

### Backend

-   **Node.js** - Runtime environment
-   **Express.js** - Web framework
-   **MySQL** - Database with connection pooling
-   **JWT** - Stateless authentication (2h expiry)
-   **bcryptjs** - Password hashing
-   **express-validator** - Input validation
-   **helmet** - Security headers

## 🚀 Quick Start

### Prerequisites

-   Node.js (v16 or higher)
-   MySQL server
-   npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/workspace-manager.git
cd workspace-manager
```

### 2. Install dependencies

```bash
npm run install-all
```

### 3. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 4. Set up the database

```bash
npm run setup-db
```

### 5. Start the development servers

```bash
npm run dev
```

### 6. Access the application

-   **Frontend**: http://localhost:3000
-   **Backend API**: http://localhost:4000

## 📁 Project Structure

```
workspace-manager/
├── .env.example          # Environment variables template
├── .gitignore           # Git ignore rules
├── package.json         # Root package.json with scripts
├── README.md           # This file
├── database-schema.sql # Database schema
├── backend/            # Backend application
│   ├── package.json
│   ├── server.js       # Express server
│   ├── config/
│   │   └── database.js # Database configuration
│   ├── middleware/
│   │   ├── auth.js     # JWT authentication
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── auth.js     # Authentication routes
│   │   └── workspaces.js # Workspace routes
│   ├── utils/
│   │   └── slugUtils.js # Slug utilities
│   └── scripts/
│       └── setup-database.js
└── frontend/           # Frontend application
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js
        ├── App.js
        ├── api.js       # API client
        ├── components/  # React components
        │   ├── AuthForm.js
        │   ├── WorkspaceForm.js
        │   ├── WorkspaceList.js
        │   ├── Header.js
        │   ├── Layout.js
        │   ├── ProtectedRoute.js
        │   └── PublicRoute.js
        ├── pages/       # Page components
        │   ├── LoginPage.js
        │   ├── SignupPage.js
        │   └── DashboardPage.js
        ├── hooks/       # Custom hooks
        │   ├── useAuth.js
        │   └── useWorkspaces.js
        ├── routes/      # Routing
        │   └── AppRouter.js
        └── utils/
            └── slugUtils.js
```

## 🔐 Authentication

The application uses JWT-based authentication with the following features:

-   **Secure password hashing** with bcrypt
-   **JWT tokens** with 2-hour expiration
-   **Protected routes** with automatic redirects
-   **Token storage** in localStorage
-   **Automatic token injection** in API requests

### Routes

-   `/login` - Public route for user login
-   `/signup` - Public route for user registration
-   `/dashboard` - Protected route for workspace management

## 📊 API Endpoints

### Authentication

-   `POST /api/auth/signup` - User registration
-   `POST /api/auth/login` - User login
-   `GET /api/auth/me` - Get current user

### Workspaces

-   `GET /api/workspaces` - List user's workspaces
-   `POST /api/workspaces` - Create new workspace
-   `PUT /api/workspaces/:id` - Update workspace
-   `DELETE /api/workspaces/:id` - Delete workspace
-   `GET /api/workspaces/check-slug?slug=...` - Check slug availability

## 🎨 Frontend Features

### Authentication

-   **Login/Signup Forms** - React Hook Form with validation
-   **Password Visibility Toggle** - Show/hide password input
-   **Form Validation** - Real-time validation with error messages
-   **Redirect Logic** - Preserves intended destination after authentication

### Workspace Management

-   **Real-time Slug Checking** - 300ms debounced API calls
-   **Slug Suggestions** - Automatic suggestions for taken slugs
-   **CRUD Operations** - Create, read, update, delete workspaces
-   **Responsive Layout** - Flexbox layout with compact cards
-   **Delete Confirmation** - Chakra UI AlertDialog for safe deletion

### UI/UX Features

-   **Toast Notifications** - Success/error feedback for all actions
-   **Loading States** - Spinners and loading indicators
-   **Responsive Design** - Works on desktop and mobile
-   **Flex Layout** - Dynamic workspace card layout
-   **Form Validation** - Real-time validation with helpful messages

## 🗄️ Database Schema

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  fullName VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE workspaces (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=workspace_manager
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=2h

# Server Configuration
PORT=4000
NODE_ENV=development

# Frontend Configuration
REACT_APP_API_URL=http://localhost:4000/api
```

## 📜 Available Scripts

### Root level

```bash
npm run dev              # Start both frontend and backend
npm run install-all      # Install all dependencies
npm run setup-db         # Set up database
```

### Backend only

```bash
cd backend
npm run dev              # Start backend with nodemon
npm run setup-db         # Set up database tables
```

### Frontend only

```bash
cd frontend
npm start                # Start React development server
```

## 🔧 Development

### Adding new features

1. Create feature branch: `git checkout -b feature/new-feature`
2. Make your changes
3. Test thoroughly
4. Submit pull request

### Code style

-   Use consistent indentation
-   Follow existing naming conventions
-   Add comments for complex logic
-   Keep components small and focused

## 🐛 Troubleshooting

### Common Issues

**Database Connection**

-   Ensure MySQL is running
-   Check database credentials in `.env`
-   Verify database exists

**Port Conflicts**

-   Backend: Port 4000
-   Frontend: Port 3000
-   Change ports in `.env` if needed

**JWT Issues**

-   Ensure `JWT_SECRET` is set in `.env`
-   Check token expiration (default: 2 hours)
-   Clear localStorage if authentication issues persist

**Frontend Issues**

-   Clear browser cache if UI doesn't update
-   Check console for React errors
-   Ensure both servers are running

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

-   [React](https://reactjs.org/) - UI framework
-   [Chakra UI](https://chakra-ui.com/) - Component library
-   [Express.js](https://expressjs.com/) - Web framework
-   [MySQL](https://www.mysql.com/) - Database

---

⭐ **Star this repository if you found it helpful!**
