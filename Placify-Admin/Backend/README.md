# Placify Admin Backend

## 🎯 Overview

The Placify Admin Backend is a robust Node.js/Express API server designed for managing interview experiences, contact submissions, and providing comprehensive analytics for the Placify platform. It features secure authentication, real-time capabilities, and comprehensive admin tools.

## ✨ Features

### 🔐 Authentication & Security
- **JWT Authentication**: Secure token-based authentication system
- **Password Hashing**: bcrypt for secure password storage
- **Rate Limiting**: API endpoint protection against abuse
- **Helmet Security**: Security headers and XSS protection
- **Input Validation**: express-validator for data sanitization
- **Admin Setup**: Initial administrator account creation

### 📊 Experience Management
- **CRUD Operations**: Complete experience lifecycle management
- **Status Management**: Pending, approved, rejected workflow
- **Advanced Filtering**: Search by company, role, type, status, date range
- **Bulk Operations**: Mass approve/reject experiences
- **NEW Experience Tracking**: 24-hour time-based indicators
- **Analytics Integration**: Experience metrics and insights

### 📞 Contact Management
- **Form Submissions**: Handle contact form data
- **Status Workflow**: New → In Progress → Resolved → Closed
- **Search & Filter**: Advanced filtering capabilities
- **Analytics**: Contact submission metrics

### 📈 Analytics & Reporting
- **Real-time Statistics**: Live platform metrics
- **Trend Analysis**: Time-based data insights
- **User Engagement**: Platform usage analytics
- **Export Capabilities**: Data export functionality

### 🗄️ Database Management
- **MongoDB Integration**: Mongoose ODM for data modeling
- **Schema Validation**: Robust data validation
- **Indexing**: Optimized database queries
- **Migration Scripts**: Database setup and maintenance

## 🏗️ Architecture & Design Patterns

### 🎯 Design Patterns

#### 1. **MVC (Model-View-Controller) Pattern**
```
src/
├── models/          # Data models and schema definitions
├── controllers/     # Business logic and request handling
├── routes/          # API route definitions
└── views/           # Response formatting (implied)
```

#### 2. **Repository Pattern**
```javascript
// Data access layer abstraction
class ExperienceRepository {
  async findAll(filters = {}) {
    return await Experience.find(filters).populate('company');
  }
  
  async findById(id) {
    return await Experience.findById(id);
  }
}
```

#### 3. **Service Layer Pattern**
```javascript
// Business logic separation
class ExperienceService {
  static async createExperience(data) {
    // Validation, business rules, and data processing
    const experience = new Experience(data);
    return await experienceRepository.save(experience);
  }
}
```

#### 4. **Middleware Pattern**
```javascript
// Cross-cutting concerns
const authMiddleware = (req, res, next) => {
  // Authentication logic
  next();
};

const validationMiddleware = (schema) => {
  return (req, res, next) => {
    // Validation logic
    next();
  };
};
```

#### 5. **Factory Pattern**
```javascript
// Response creation
class ResponseFactory {
  static success(data, message = 'Success') {
    return { success: true, data, message };
  }
  
  static error(message, statusCode = 500) {
    return { success: false, message, statusCode };
  }
}
```

### 🏛️ Architecture Layers

```
┌─────────────────────────────────────┐
│           API Layer (Routes)        │  ← HTTP endpoints
├─────────────────────────────────────┤
│       Controller Layer              │  ← Request handling
├─────────────────────────────────────┤
│        Service Layer                │  ← Business logic
├─────────────────────────────────────┤
│       Repository Layer              │  ← Data access
├─────────────────────────────────────┤
│         Model Layer                 │  ← Data models
├─────────────────────────────────────┤
│        Database Layer               │  ← MongoDB
└─────────────────────────────────────┘
```

### 📁 Project Structure
```
src/
├── server.js                    # Application entry point
├── controllers/                 # Request handlers
│   ├── authController.js       # Authentication logic
│   ├── experienceController.js # Experience management
│   ├── contactController.js    # Contact form handling
│   └── analyticsController.js  # Analytics and reporting
├── models/                     # Mongoose schemas
│   ├── Admin.js               # Admin user model
│   ├── Experience.js          # Experience data model
│   └── Contact.js             # Contact form model
├── routes/                     # API route definitions
│   ├── auth.js                # Authentication routes
│   ├── experiences.js         # Experience endpoints
│   ├── contacts.js            # Contact endpoints
│   └── analytics.js           # Analytics endpoints
├── middleware/                 # Custom middleware
│   ├── auth.js                # Authentication middleware
│   ├── validation.js          # Input validation
│   ├── rateLimiting.js        # Rate limiting
│   └── errorHandler.js        # Error handling
├── services/                   # Business logic layer
│   ├── authService.js         # Authentication services
│   ├── experienceService.js   # Experience business logic
│   └── analyticsService.js    # Analytics calculations
├── repositories/               # Data access layer
│   ├── experienceRepository.js
│   └── contactRepository.js
├── utils/                      # Utility functions
│   ├── database.js            # Database connection
│   ├── logger.js              # Logging utility
│   └── helpers.js             # General helpers
└── events/                     # Event handlers (if using events)
    └── experienceEvents.js
```

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v16+ 
- **npm**: v7+
- **MongoDB**: v4.4+ (local or Atlas)

### 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd Placify/Placify-Admin/Backend

# Install dependencies
npm install


```

### 🔧 Environment Configuration

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/placify-admin
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/placify-admin

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d

# Security
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email Configuration (if using email features)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 🏃‍♂️ Running the Application

```bash
# Development server (with auto-restart)
npm run dev

# Production server
npm start

# Database migration (if needed)
npm run migrate

# Test database connection
npm run test-db
```

### 🌐 API Base URL
- **Development**: http://localhost:3001
- **API Endpoints**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/api/health

## 📡 API Documentation

### 🔐 Authentication Endpoints

#### POST /api/auth/setup
**Initial admin setup** (only works when no admin exists)
```json
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "SecurePassword123!"
}
```

#### POST /api/auth/login
**Admin login**
```json
{
  "email": "admin@example.com",
  "password": "SecurePassword123!"
}
```

#### POST /api/auth/refresh
**Refresh JWT token**
```json
{
  "refreshToken": "your-refresh-token"
}
```

### 🎯 Experience Endpoints

#### GET /api/experiences
**Get all experiences with filtering**
```bash
# Query parameters
?search=google&company=Google&role=SDE&status=pending&type=internship
&sortBy=createdAt&sortOrder=desc&page=1&limit=10
```

#### GET /api/experiences/:id
**Get specific experience**

#### PUT /api/experiences/:id/status
**Update experience status**
```json
{
  "status": "approved",
  "adminNotes": "Good detailed experience"
}
```

#### PUT /api/experiences/bulk-status
**Bulk status update**
```json
{
  "experienceIds": ["id1", "id2", "id3"],
  "status": "approved"
}
```

#### DELETE /api/experiences/:id
**Delete experience**

### 📞 Contact Endpoints

#### GET /api/contacts
**Get all contacts with filtering**
```bash
?search=john&status=new&sortBy=createdAt&sortOrder=desc&page=1&limit=10
```

#### PUT /api/contacts/:id/status
**Update contact status**
```json
{
  "status": "resolved",
  "adminNotes": "Issue resolved"
}
```

### 📊 Analytics Endpoints

#### GET /api/analytics/overview
**Dashboard statistics**
```json
{
  "experiences": {
    "total": 150,
    "approved": 120,
    "pending": 25,
    "rejected": 5,
    "new": 8
  },
  "contacts": {
    "total": 45,
    "new": 12,
    "inProgress": 8,
    "resolved": 25
  }
}
```

#### GET /api/analytics/trends
**Trend data for charts**

#### GET /api/analytics/export
**Export analytics data**

## 🗄️ Database Schema

### 👤 Admin Model
```javascript
{
  name: String,
  email: String, // unique
  password: String, // hashed
  role: String, // default: 'admin'
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 🎯 Experience Model
```javascript
{
  // Personal Details
  name: String,
  email: String,
  phone: String,
  
  // Company & Role
  company: String,
  role: String,
  department: String,
  experienceType: String, // internship, full-time, etc.
  
  // Process Details
  applicationDate: Date,
  processSteps: [String],
  difficulty: String,
  duration: String,
  
  // Experience Content
  questions: [String],
  tips: [String],
  overallExperience: String,
  
  // Admin Fields
  status: String, // pending, approved, rejected
  adminNotes: String,
  isNew: Boolean, // true if created within 24 hours
  moderatedBy: ObjectId,
  
  // Metadata
  createdAt: Date,
  updatedAt: Date,
  approvedAt: Date
}
```

### 📞 Contact Model
```javascript
{
  name: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  status: String, // new, in-progress, resolved, closed
  adminNotes: String,
  handledBy: ObjectId,
  createdAt: Date,
  updatedAt: Date,
  resolvedAt: Date
}
```

## 🛡️ Security Features

### 🔒 Authentication Security
- **JWT Tokens**: Stateless authentication
- **Password Hashing**: bcrypt with salt rounds
- **Token Refresh**: Automatic token renewal
- **Rate Limiting**: Prevent brute force attacks

### 🛡️ API Security
- **Helmet**: Security headers
- **CORS**: Cross-origin request protection
- **Input Validation**: express-validator sanitization
- **XSS Protection**: HTML encoding
- **SQL Injection**: MongoDB parameterized queries

### 🔐 Data Protection
- **Environment Variables**: Sensitive data protection
- **Encrypted Connections**: HTTPS in production
- **Database Security**: MongoDB connection security

## 🧪 Testing

```bash
# Run tests (if test suite exists)
npm test

# Test database connection
npm run test-db

# API testing with curl
curl -X GET http://localhost:3001/api/health
```

## 🚨 Troubleshooting

### Common Issues

#### 1. **Database Connection Error**
```bash
# Check MongoDB status
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# Check connection string
echo $MONGODB_URI
```

#### 2. **JWT Token Issues**
```bash
# Verify JWT secret is set
echo $JWT_SECRET

# Clear existing tokens and re-login
```

#### 3. **Port Already in Use**
```bash
# Find and kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Or use different port
PORT=3002 npm run dev
```

#### 4. **CORS Issues**
```javascript
// Add frontend URL to ALLOWED_ORIGINS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 🐛 Debug Mode
```bash
# Run with debug logging
DEBUG=* npm run dev

# MongoDB debug
DEBUG=mongoose npm run dev
```

## 📈 Performance Optimization

### 🗄️ Database Optimization
- **Indexing**: Key fields indexed for fast queries
- **Aggregation**: Efficient data grouping
- **Connection Pooling**: MongoDB connection management
- **Query Optimization**: Lean queries for better performance

### 🚀 API Performance
- **Caching**: Response caching for static data
- **Pagination**: Large dataset handling
- **Rate Limiting**: API abuse prevention
- **Compression**: Response compression

## 📊 Monitoring & Logging

### 📝 Logging
```javascript
// Log levels: error, warn, info, debug
console.log('[INFO]', 'Server started on port', PORT);
console.error('[ERROR]', 'Database connection failed');
```

### 📊 Health Checks
```bash
# API health check
GET /api/health

# Database health
GET /api/health/db
```

## 🔄 Deployment

### 🐳 Docker Deployment
```dockerfile
# Dockerfile example
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### 🌐 Production Environment
```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://...
JWT_SECRET=production-secret
ALLOWED_ORIGINS=https://admin.placify.com
```

## 🤝 Contributing

1. Follow RESTful API conventions
2. Add proper error handling
3. Include input validation
4. Write comprehensive tests
5. Document new endpoints
6. Follow security best practices

## 📄 License

Private - Placify Platform Admin Backend

---

**Built with 🛡️ security and ⚡ performance in mind using Node.js, Express, and MongoDB**