# 🚀 Placify Admin Panel

A comprehensive admin panel for managing Placify placement experiences with manual approval workflow, verification badges, and real-time notifications.

## ✨ Features

### 🔐 Admin Authentication
- JWT-based secure authentication
- Password encryption with bcrypt
- Account lockout protection
- Session management

### 📋 Experience Management
- **Manual Review Workflow**: Approve/reject user submissions
- **Verification Badges**: Add quality verification to approved posts
- **State Machine**: Controlled status transitions (pending → approved/rejected)
- **Batch Operations**: Bulk approve/reject multiple experiences
- **Advanced Search**: Filter by status, company, role, etc.
- **Detailed View**: Full experience review with moderation notes

### 🔔 Real-Time Notifications
- Socket.IO powered live updates
- Instant notifications for new submissions
- Real-time status change alerts
- Admin activity monitoring

### 📊 Analytics Dashboard
- Experience statistics and trends
- Company performance metrics
- Admin moderation analytics
- Data export capabilities

### 🎨 Modern UI/UX
- Chakra UI components with custom theme
- Responsive design matching user frontend
- Dark/light theme support
- Apple-style design language

## 🏗️ Architecture

### Backend Patterns
- **MVC Pattern**: Models, Views, Controllers separation
- **Service Layer**: Business logic isolation
- **Repository Pattern**: Database operations abstraction
- **State Pattern**: Experience status management
- **Decorator Pattern**: Metadata enhancement
- **Observer Pattern**: Real-time event handling
- **Command Pattern**: Audit trail and logging

### Frontend Architecture
- **React 18** with modern hooks
- **Context API** for state management
- **React Router** for navigation
- **Chakra UI** for components
- **Socket.IO Client** for real-time updates

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- MongoDB 4.4+
- Git

### 1. Backend Setup

```bash
# Navigate to admin backend
cd Placify-Admin/Backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configurations
MONGODB_URI=mongodb://localhost:27017/placify
JWT_SECRET=your-super-secret-jwt-key
ADMIN_PORT=5001
```

### 2. Database Migration

```bash
# Run migration to add admin fields to existing experiences
npm run migrate

# Rollback migration if needed
npm run migrate rollback
```

### 3. Frontend Setup

```bash
# Navigate to admin frontend
cd Placify-Admin/Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Start Services

```bash
# Terminal 1: Start admin backend
cd Placify-Admin/Backend
npm run dev

# Terminal 2: Start admin frontend
cd Placify-Admin/Frontend
npm run dev

# Terminal 3: Start user backend (for user submissions)
cd Placify-Users/Backend
npm run dev
```

### 5. Initial Admin Setup

1. Open `http://localhost:3001`
2. You'll be redirected to setup page
3. Create your first admin account
4. Login and start managing experiences!

## 🔧 Configuration

### Backend Environment (.env)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/placify

# Server
ADMIN_PORT=5001
NODE_ENV=development

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# CORS
ADMIN_FRONTEND_URL=http://localhost:3001

# Security
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_TIME_HOURS=2
```

### Frontend Environment (.env.local)
```env
VITE_API_URL=http://localhost:5001/api
```

## 📡 API Endpoints

### Authentication
```
POST /api/admin/auth/login              # Admin login
POST /api/admin/auth/logout             # Admin logout
GET  /api/admin/auth/verify             # Verify token
GET  /api/admin/auth/profile            # Get profile
PUT  /api/admin/auth/profile            # Update profile
PUT  /api/admin/auth/password           # Change password
```

### Experience Management
```
GET  /api/admin/experiences/pending     # Get pending experiences
GET  /api/admin/experiences/:id         # Get experience details
POST /api/admin/experiences/:id/approve # Approve experience
POST /api/admin/experiences/:id/reject  # Reject experience
POST /api/admin/experiences/batch/approve # Batch approve
GET  /api/admin/experiences/search      # Search experiences
```

### Analytics
```
GET  /api/admin/analytics/dashboard     # Dashboard stats
GET  /api/admin/analytics/trends        # Experience trends
GET  /api/admin/analytics/companies     # Company analytics
GET  /api/admin/analytics/export        # Export data
```

## 🔄 Experience Workflow

### User Side Flow
1. User submits experience via frontend
2. Experience saved with `status: 'pending'`
3. Real-time notification sent to admin
4. Public API only shows `approved` experiences

### Admin Side Flow
1. Admin receives notification
2. Reviews experience in admin panel
3. Approves/rejects with optional notes
4. Can add verification badge for quality posts
5. Experience becomes visible to public (if approved)

### State Transitions
```
pending → approved ✅
pending → rejected ✅
approved → rejected ✅ (re-moderation)
rejected → approved ✅ (appeal)
```

## 🔒 Security Features

### Authentication Security
- JWT tokens with expiration
- Password hashing with bcrypt (12 rounds)
- Account lockout after failed attempts
- Secure session management

### API Security
- CORS protection
- Rate limiting
- Request validation
- Error handling without data leaks
- Audit logging

### Data Security
- Input sanitization
- MongoDB injection prevention
- XSS protection
- Secure headers with Helmet

## 📊 Database Schema

### Experience Model Updates
```javascript
// New admin fields added to existing Experience model
{
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  verificationBadge: { type: Boolean, default: false },
  moderatedBy: String,
  moderationNotes: String,
  approvedAt: Date,
  rejectedAt: Date
}
```

### Admin Model
```javascript
{
  email: String (unique),
  password: String (hashed),
  name: String,
  role: { type: String, enum: ['admin'], default: 'admin' },
  isActive: Boolean,
  lastLogin: Date,
  loginAttempts: Number,
  lockUntil: Date
}
```

### Audit Log Model
```javascript
{
  adminId: ObjectId,
  action: String,
  resourceType: String,
  resourceId: ObjectId,
  details: Object,
  previousData: Object,
  newData: Object,
  ipAddress: String,
  userAgent: String,
  createdAt: Date
}
```

## 🎯 Production Deployment

### Backend Deployment
```bash
# Build and deploy
npm run start

# Environment variables
NODE_ENV=production
MONGODB_URI=mongodb://production-host:27017/placify
JWT_SECRET=super-secure-production-key
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy to CDN/Static hosting
# Built files in ./dist directory
```

### Nginx Configuration
```nginx
# Admin panel reverse proxy
location /api/admin {
    proxy_pass http://localhost:5001/api/admin;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
}
```

## 🧪 Development

### Backend Development
```bash
cd Placify-Admin/Backend

# Install dependencies
npm install

# Run in development mode
npm run dev

# Run migration
npm run migrate
```

### Frontend Development
```bash
cd Placify-Admin/Frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
- Check MongoDB connection
- Verify environment variables
- Check port availability (5001)

**Frontend can't connect:**
- Verify backend is running
- Check CORS settings
- Check proxy configuration in vite.config.js

**Authentication issues:**
- Clear localStorage
- Check JWT_SECRET configuration
- Verify token expiration settings

**Database migration fails:**
- Check MongoDB connection
- Verify collection permissions
- Run migration with --verbose flag

### Debug Mode
```bash
# Enable debug logging
DEBUG=placify:* npm run dev

# Check logs
tail -f logs/admin.log
```

## 📈 Monitoring

### Health Checks
```bash
# Backend health
GET /api/admin/health

# Database status
GET /api/admin/analytics/dashboard
```

### Logs
- Authentication events
- Experience moderation actions
- System errors
- Performance metrics

## 🔮 Future Enhancements

### Planned Features
- [ ] Email notifications for approvals/rejections
- [ ] Advanced analytics with charts
- [ ] Bulk import/export tools
- [ ] Admin role management
- [ ] Experience categories and tags
- [ ] Comment system on experiences
- [ ] API rate limiting per user
- [ ] Advanced search filters

### Scalability
- [ ] Redis session storage
- [ ] Database clustering
- [ ] CDN integration
- [ ] Caching layers
- [ ] Microservices architecture

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Follow coding standards
4. Add tests for new features
5. Submit pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for Placify Admin Panel**