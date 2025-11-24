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

### 🎯 **Design Patterns Implementation**

#### 1. **State Pattern** ✅
```javascript
// Experience status management with state transitions
class PendingState {
  constructor(experience) {
    this.experience = experience;
  }
  
  approve(reason) {
    this.experience.setState(new ApprovedState(this.experience));
    return this.experience.save();
  }
  
  reject(reason) {
    this.experience.setState(new RejectedState(this.experience));
    return this.experience.save();
  }
}
```
**Files**: `src/patterns/ExperienceState.js`
**Classes**: `PendingState`, `ApprovedState`, `RejectedState`

#### 2. **Command Pattern** ✅
```javascript
// Administrative actions with audit trail
class ApproveExperienceCommand extends AdminCommand {
  async execute() {
    await this.auditLog.create({
      action: 'APPROVE_EXPERIENCE',
      adminId: this.adminId,
      resourceId: this.experienceId
    });
    return await this.experienceService.approve(this.experienceId, this.reason);
  }
  
  async undo() {
    // Revert to previous state
  }
}
```
**Files**: `src/patterns/AdminCommand.js`
**Commands**: `ApproveExperienceCommand`, `RejectExperienceCommand`, `BulkApproveCommand`

#### 3. **Factory Pattern** ✅
```javascript
// Centralized service creation and dependency injection
class ServiceFactory {
  static instance = null;
  
  static getInstance() {
    if (!this.instance) {
      this.instance = new ServiceFactory();
    }
    return this.instance;
  }
  
  createExperienceService() {
    return new ExperienceService(
      this.createExperienceRepository(),
      this.createAuditService()
    );
  }
}
```
**Files**: `src/patterns/ServiceFactory.js`
**Features**: Service creation, dependency injection, controller factory

#### 4. **Strategy Pattern** ✅
```javascript
// Multiple authentication strategies
class AuthContext {
  setStrategy(strategy) {
    this.strategy = strategy;
  }
  
  authenticate(credentials) {
    return this.strategy.authenticate(credentials);
  }
}

class JWTAuthStrategy {
  authenticate(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
}

class APIKeyAuthStrategy {
  authenticate(apiKey) {
    return this.validateAPIKey(apiKey);
  }
}
```
**Files**: `src/patterns/AuthStrategy.js`
**Strategies**: `JWTAuthStrategy`, `APIKeyAuthStrategy`, `SessionAuthStrategy`

#### 5. **Decorator Pattern** ✅
```javascript
// Experience enhancement without modifying core objects
class VerificationBadgeDecorator extends ExperienceDecorator {
  enhance() {
    const enhanced = super.enhance();
    enhanced.badges = enhanced.badges || [];
    enhanced.badges.push({
      type: 'verified',
      label: 'Verified Experience',
      color: 'green'
    });
    return enhanced;
  }
}

class ModerationNotesDecorator extends ExperienceDecorator {
  enhance() {
    const enhanced = super.enhance();
    enhanced.moderationInfo = {
      notes: this.notes,
      moderatedBy: this.moderatorId,
      moderatedAt: new Date()
    };
    return enhanced;
  }
}
```
**Files**: `src/patterns/ExperienceDecorator.js`
**Decorators**: `VerificationBadgeDecorator`, `ModerationNotesDecorator`, `PriorityDecorator`, `FeaturedDecorator`

#### 6. **Repository Pattern** ✅
```javascript
// Clean data access layer abstraction
class AuditLogRepository {
  async create(logData) {
    const auditLog = new AuditLog(logData);
    return await auditLog.save();
  }
  
  async findByAdmin(adminId, options = {}) {
    return await AuditLog.find({ adminId })
      .sort({ createdAt: -1 })
      .limit(options.limit || 50)
      .populate('adminId', 'name email');
  }
  
  async getAnalytics(timeRange = '30d') {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(timeRange));
    
    return await AuditLog.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$action', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
  }
}
```
**Files**: `src/repositories/auditLogRepository.js`
**Features**: CRUD operations, aggregation queries, bulk operations

#### 7. **Service Layer Pattern** ✅
```javascript
// Business logic encapsulation
class AuditService {
  constructor(auditLogRepository) {
    this.auditLogRepository = auditLogRepository;
  }
  
  async logAdminAction(adminId, action, resourceId, details = {}) {
    const logData = {
      adminId,
      action,
      resourceId,
      details,
      timestamp: new Date(),
      ipAddress: details.ipAddress,
      userAgent: details.userAgent
    };
    
    return await this.auditLogRepository.create(logData);
  }
  
  async generateReport(adminId, startDate, endDate) {
    const logs = await this.auditLogRepository.findByDateRange(startDate, endDate);
    const analytics = await this.auditLogRepository.getAnalytics('custom', { startDate, endDate });
    
    return {
      totalActions: logs.length,
      actionsByType: analytics,
      timeline: this.generateTimeline(logs),
      summary: this.generateSummary(logs)
    };
  }
}
```
**Files**: `src/services/auditService.js`
**Features**: Audit trail management, reporting, cleanup operations

#### 8. **MVC (Model-View-Controller) Pattern** ✅
#### 8. **MVC (Model-View-Controller) Pattern** ✅
```
src/
├── models/          # Data models and schema definitions
├── controllers/     # Business logic and request handling  
├── routes/          # API route definitions (View layer)
└── services/        # Business logic layer
```

### 🏗️ **Pattern Integration Map**
```
Request Flow:
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Routes    │───▶│ Controllers  │───▶│  Services   │
│ (API Layer) │    │   (Logic)    │    │ (Business)  │
└─────────────┘    └──────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│ Middleware  │    │   Commands   │    │ Repositories│
│ (Strategy)  │    │  (Patterns)  │    │ (Data Access)│ 
└─────────────┘    └──────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Factory   │    │    State     │    │   Models    │
│ (Creation)  │    │ (Transitions)│    │ (Database)  │
└─────────────┘    └──────────────┘    └─────────────┘
```

### 🎯 **Business Value Through Patterns**

#### **Code Quality**
- **Maintainability**: Clear separation of concerns across 7 patterns
- **Reusability**: Factory and Service patterns enable component reuse
- **Testability**: Repository pattern isolates data layer for easier testing
- **Scalability**: Modular architecture supports feature growth

#### **Development Efficiency**
- **Consistency**: Standardized patterns across entire codebase
- **Developer Experience**: Familiar OOP patterns with clear interfaces
- **Onboarding**: Well-documented pattern implementations
- **Debugging**: Clear data flow and command audit trails

#### **System Reliability**
- **Error Handling**: Comprehensive error boundaries in all patterns
- **State Management**: Predictable state transitions via State pattern
- **Audit Trail**: Complete action logging via Command pattern
- **Security**: Strategy-based authentication with proper validation

### 📊 **Pattern Implementation Statistics**
- **7 Backend Patterns**: All implemented with working code
- **100% Pattern Coverage**: Every major component uses design patterns
- **Audit Trail**: Complete action logging for compliance
- **Performance**: Optimized repository and service patterns

### 🔄 **Pattern Usage Examples**
```javascript
// Combined pattern usage in a controller
class ExperienceController {
  constructor() {
    // Factory Pattern
    this.serviceFactory = ServiceFactory.getInstance();
    this.experienceService = this.serviceFactory.createExperienceService();
    
    // Command Pattern
    this.commandFactory = this.serviceFactory.createCommandFactory();
  }
  
  async updateStatus(req, res) {
    try {
      // Strategy Pattern (Authentication)
      const authStrategy = new JWTAuthStrategy();
      const admin = await authStrategy.authenticate(req.headers.authorization);
      
      // Command Pattern (Audit Trail)
      const command = this.commandFactory.createApproveCommand({
        experienceId: req.params.id,
        adminId: admin.id,
        reason: req.body.reason
      });
      
      // State Pattern (Status Management)
      const experience = await this.experienceService.findById(req.params.id);
      const result = await command.execute();
      
      // Decorator Pattern (Response Enhancement)
      const decorator = new VerificationBadgeDecorator(result);
      const enhancedResult = decorator.enhance();
      
      res.json({ success: true, data: enhancedResult });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
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
# For MongoDB Atlas, use this format:
# MONGODB_URI=mongodb+srv://[USERNAME]:[PASSWORD]@[CLUSTER].mongodb.net/placify-admin

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