# Placify Admin Dashboard

## 🎯 Overview

The **Placify Admin Dashboard** is a comprehensive administrative interface for managing the Placify interview experience platform. It provides powerful tools for moderating user-submitted experiences, managing contact inquiries, and analyzing platform metrics through an intuitive, responsive web interface.

## ✨ Key Features

### 🏗️ **Complete Admin Suite**
- **🎯 Experience Moderation**: Approve, reject, and manage interview experiences
- **📞 Contact Management**: Handle user inquiries and support requests  
- **📊 Analytics Dashboard**: Real-time insights and platform metrics
- **👤 Admin Management**: Secure authentication and profile management
- **📱 Responsive Design**: Optimized for mobile, tablet, and desktop

### 🔒 **Security & Authentication**
- JWT-based secure authentication system
- Role-based access control
- Rate limiting and API protection
- Secure password hashing with bcrypt

### 📈 **Real-time Analytics**
- Live experience submission tracking
- Contact form analytics
- NEW experience indicators (24-hour badges)
- Interactive charts and visualizations

### 🎨 **Modern UI/UX**
- Dark theme professional interface
- Mobile-first responsive design
- Intuitive navigation and workflows
- Touch-friendly interactions

## 🏗️ Architecture

### 📊 **System Overview**
```
┌─────────────────────────────────────────────────────────┐
│                 Placify Admin Dashboard                 │
├─────────────────────────────────────────────────────────┤
│  Frontend (React + Chakra UI)  │  Backend (Node.js)     │
│  ├─ Authentication            │  ├─ JWT Auth          │
│  ├─ Experience Management     │  ├─ Experience API    │
│  ├─ Contact Management        │  ├─ Contact API       │
│  ├─ Analytics Dashboard       │  ├─ Analytics API     │
│  └─ Responsive UI             │  └─ MongoDB           │
└─────────────────────────────────────────────────────────┘
```

### 🔧 **Technology Stack**

#### Frontend
- **React 18**: Modern component-based UI framework
- **Chakra UI**: Professional component library with dark theme
- **React Router**: Client-side routing and navigation
- **Axios**: HTTP client for API communication
- **React Hook Form**: Form validation and management
- **Recharts**: Interactive analytics visualizations
- **Vite**: Fast development build tool

#### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: JSON Web Tokens for authentication
- **bcrypt**: Password hashing and security
- **Helmet**: Security middleware
- **Express Validator**: Input validation and sanitization

## 🚀 Quick Start

### Prerequisites
```bash
# Required software
Node.js v16+ 
npm v7+
MongoDB v4.4+ (local or Atlas)
```

### 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd Placify/Placify-Admin

# Install Backend dependencies
cd Backend
npm install

# Install Frontend dependencies  
cd ../Frontend
npm install
```

### ⚙️ Configuration

#### Backend Environment (`.env`)
```env
# Server
PORT=3001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/placify-admin

# JWT Security
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=1h

# CORS
ALLOWED_ORIGINS=http://localhost:5173
```

#### Frontend Environment (`.env`)
```env
# API Configuration
VITE_API_URL=http://localhost:3001/api
```

### 🏃‍♂️ Running the Application

#### Start Backend Server
```bash
cd Backend
npm run dev  # Development with auto-restart
# or
npm start   # Production mode
```

#### Start Frontend Development Server
```bash
cd Frontend
npm run dev  # Development server with hot reload
```

### 🌐 Access Points
- **Frontend Dashboard**: http://localhost:5173
- **Backend API**: http://localhost:3001/api
- **Initial Setup**: http://localhost:5173/setup

## 📁 Project Structure

```
Placify-Admin/
├─ README.md                    # This overview document
├─ Backend/                     # Node.js API Server
│   ├─ README.md               # Backend documentation
│   ├─ package.json
│   ├─ src/
│   │   ├─ server.js           # Application entry point
│   │   ├─ controllers/        # Request handlers
│   │   ├─ models/             # Database schemas
│   │   ├─ routes/             # API endpoints
│   │   ├─ middleware/         # Custom middleware
│   │   ├─ services/           # Business logic
│   │   └─ utils/              # Utilities
│   └─ .env.example
└─ Frontend/                    # React Dashboard
    ├─ README.md               # Frontend documentation
    ├─ package.json
    ├─ index.html
    ├─ vite.config.js
    ├─ src/
    │   ├─ App.jsx             # Main application
    │   ├─ main.jsx            # Entry point
    │   ├─ components/         # Reusable components
    │   │   ├─ layout/         # Layout components
    │   │   ├─ common/         # Shared components
    │   │   └─ auth/           # Authentication
    │   ├─ pages/              # Route components
    │   │   ├─ Dashboard.jsx   # Main dashboard
    │   │   ├─ Experiences.jsx # Experience management
    │   │   ├─ Contacts.jsx    # Contact management
    │   │   ├─ Analytics.jsx   # Analytics page
    │   │   └─ Profile.jsx     # Admin profile
    │   ├─ services/           # API layer
    │   ├─ context/            # React context
    │   ├─ utils/              # Utilities
    │   └─ theme/              # UI theming
    └─ .env.example
```

## 🎛️ Features Guide

### 🔐 **Authentication Flow**
1. **Initial Setup**: Create first admin account at `/setup`
2. **Login**: Secure authentication at `/login`
3. **Dashboard**: Access admin interface post-authentication
4. **Session Management**: Automatic token refresh

### 🎯 **Experience Management**
- **📋 List View**: Paginated experience submissions
- **🔍 Advanced Search**: Filter by company, role, status, type
- **✅ Bulk Actions**: Mass approve/reject operations
- **📝 Detailed View**: Full experience review interface
- **🏷️ NEW Badges**: 24-hour indicators for recent submissions

### 📞 **Contact Management**
- **📨 Inbox View**: All contact form submissions
- **🔄 Status Workflow**: New → In Progress → Resolved → Closed
- **🔍 Search**: Filter by name, email, subject, content
- **📊 Statistics**: Contact volume and resolution metrics

### 📊 **Analytics Dashboard**
- **📈 Key Metrics**: Experience and contact statistics
- **📉 Trend Charts**: Visual data representation
- **🔄 Real-time Updates**: Live metric refreshing
- **📱 Responsive Charts**: Mobile-optimized visualizations

### 📱 **Responsive Design**
- **📱 Mobile**: Touch-friendly interface (320px+)
- **💻 Tablet**: Optimized layouts (768px+)
- **🖥️ Desktop**: Full-featured interface (1024px+)
- **📐 Flexible**: Adapts to any screen size

## 📄 License

Private - Placify Platform Administrative Interface

---

**🚀 A powerful, secure, and user-friendly admin dashboard for managing the Placify interview experience platform**

*Built with modern web technologies and best practices for scalability, security, and maintainability.*