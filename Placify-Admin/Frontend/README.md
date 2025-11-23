# Placify Admin Frontend

## 🎯 Overview

The Placify Admin Frontend is a modern, responsive React-based dashboard for managing interview experiences, contact submissions, and platform analytics. Built with performance and user experience in mind, it features a sleek dark theme with comprehensive admin tools.

## ✨ Features

### 🔐 Authentication & Security
- **JWT-based Authentication**: Secure login system with token management
- **Protected Routes**: Role-based access control for admin areas
- **Session Management**: Automatic token refresh and logout handling
- **Initial Setup Wizard**: First-time admin account creation

### 📊 Dashboard & Analytics
- **Real-time Statistics**: Live metrics for experiences, contacts, and user engagement
- **Interactive Charts**: Visual analytics powered by Recharts
- **NEW Experience Indicators**: 24-hour time-based badges for recent submissions
- **Responsive Grid Layouts**: 1/2/4 column layouts across devices

### 🎯 Experience Management
- **Advanced Filtering**: Search by company, role, experience type, and status
- **Bulk Operations**: Mass approve/reject experiences
- **Detailed View**: Comprehensive experience details with moderation tools
- **Status Management**: Pending, approved, rejected workflow
- **Mobile-Responsive Tables**: Hidden columns on mobile with touch-friendly interfaces

### 📞 Contact Management
- **Contact Form Submissions**: Manage all user inquiries
- **Status Tracking**: New, in-progress, resolved, closed statuses
- **Advanced Search**: Filter by name, email, subject, or message content
- **Responsive Design**: Optimized for all device sizes

### 👤 Profile & Settings
- **Admin Profile Management**: Update personal information
- **Password Change**: Secure password updates
- **Responsive Interface**: Mobile-friendly profile editing

## 🏗️ Architecture & Design Patterns

### 🎨 UI/UX Framework
- **Chakra UI**: Modern React component library with consistent design system
- **Dark Theme**: Professional dark mode interface with rgba transparency
- **Responsive Design**: Mobile-first approach with breakpoints (base/sm/md/lg/xl)
- **Touch-Friendly**: 44px minimum touch targets for mobile devices

### 📱 Responsive Design Patterns
```jsx
// Mobile-first responsive breakpoints
const responsive = {
  base: "320px+",    // Mobile
  sm: "480px+",      // Small mobile
  md: "768px+",      // Tablet
  lg: "1024px+",     // Desktop
  xl: "1200px+"      // Large desktop
}

// Grid layout example
<Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}>
```

### 🏛️ Component Architecture
```
src/
├── components/           # Reusable UI components
│   ├── layout/          # Layout components (Header, Sidebar, Layout)
│   ├── common/          # Shared components (LoadingSpinner)
│   └── auth/            # Authentication components
├── pages/               # Route-based page components
├── context/             # React Context for state management
├── services/            # API service layer
├── utils/               # Utility functions
└── theme/               # Chakra UI theme customization
```

### 🔄 State Management Patterns
- **React Context**: Global authentication state
- **Local State**: Component-level state with useState/useEffect
- **Custom Hooks**: Reusable stateful logic
- **Service Layer**: API abstraction with axios

### 🎯 Design Patterns Used

#### 1. **Container/Presentational Pattern**
```jsx
// Container component handles logic
const ExperiencesContainer = () => {
  const [experiences, setExperiences] = useState([]);
  // Business logic here
  return <ExperiencesList experiences={experiences} />;
};

// Presentational component handles UI
const ExperiencesList = ({ experiences }) => {
  return <div>{/* UI rendering */}</div>;
};
```

#### 2. **Higher-Order Component (HOC) Pattern**
```jsx
// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};
```

#### 3. **Compound Component Pattern**
```jsx
// Layout system with multiple related components
<Layout>
  <Layout.Header />
  <Layout.Sidebar />
  <Layout.Content>{children}</Layout.Content>
</Layout>
```

#### 4. **Service Layer Pattern**
```jsx
// API service abstraction
class ExperienceService {
  static async getAll(filters) {
    const response = await api.get('/experiences', { params: filters });
    return response.data;
  }
}
```

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v16+ 
- **npm**: v7+
- **Backend API**: Placify Admin Backend running on port 3001

### 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd Placify/Placify-Admin/Frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure environment variables
echo "VITE_API_URL=http://localhost:3001/api" > .env
```

### 🔧 Environment Configuration

```env
# .env file
VITE_API_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001
```

### 🏃‍♂️ Running the Application

```bash
# Development server (with hot reload)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### 🌐 Access URLs
- **Development**: http://localhost:5173
- **Initial Setup**: http://localhost:5173/setup (first-time admin creation)
- **Login**: http://localhost:5173/login

## 📚 Usage Guide

### 🔐 First-Time Setup
1. Navigate to `/setup` when no admin exists
2. Create your administrator account
3. Login with your credentials

### 📊 Dashboard Navigation
- **Dashboard**: Overview statistics and recent activity
- **Experiences**: Manage interview experience submissions
- **Contacts**: Handle user contact form submissions
- **Analytics**: Detailed platform analytics and insights
- **Profile**: Manage admin account settings

### 📱 Mobile Usage
- **Hamburger Menu**: Access navigation on mobile devices
- **Touch-Friendly**: All buttons and inputs are touch-optimized
- **Responsive Tables**: Scroll horizontally or view essential columns only
- **Mobile Filters**: Stacked filter controls for better mobile experience

## 🛠️ Development

### 📁 Project Structure
```
src/
├── App.jsx                 # Main application component
├── main.jsx               # Application entry point
├── index.css              # Global styles and responsive utilities
├── components/
│   ├── layout/
│   │   ├── Layout.jsx     # Main layout wrapper with responsive sidebar
│   │   ├── Header.jsx     # Top navigation with user menu
│   │   └── Sidebar.jsx    # Navigation sidebar with mobile drawer
│   ├── common/
│   │   └── LoadingSpinner.jsx
│   └── auth/
│       └── ProtectedRoute.jsx
├── pages/
│   ├── Dashboard.jsx      # Main dashboard with statistics
│   ├── Experiences.jsx    # Experience management
│   ├── Contacts.jsx       # Contact form management
│   ├── Analytics.jsx      # Detailed analytics
│   ├── Profile.jsx        # Admin profile management
│   ├── Login.jsx          # Authentication
│   └── InitialSetup.jsx   # First-time setup
├── context/
│   └── AuthContext.jsx    # Authentication state management
├── services/
│   ├── api.js             # Axios configuration
│   ├── authService.js     # Authentication API calls
│   ├── experienceService.js # Experience management API
│   └── contactService.js  # Contact management API
├── utils/
│   ├── errorHandler.js    # Error handling utilities
│   └── validation.js     # Form validation helpers
└── theme/
    └── index.js           # Chakra UI theme customization
```

### 🎨 Styling Guidelines
- **Dark Theme**: Primary background `rgba(28, 28, 30, 0.8)`
- **Responsive Spacing**: Use Chakra UI spacing scale
- **Consistent Typography**: System font stack with proper hierarchy
- **Touch Targets**: Minimum 44px for mobile interactions

### 🧪 Adding New Features
1. Create component in appropriate directory
2. Add responsive design with mobile-first approach
3. Implement proper error handling
4. Add to routing if needed
5. Update documentation

### 🔄 API Integration
```jsx
// Service layer example
import { api } from '../utils/api';

export const ExperienceService = {
  async getAll(filters = {}) {
    try {
      const response = await api.get('/experiences', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch experiences');
    }
  }
};
```

## 🚨 Troubleshooting

### Common Issues

#### 1. **API Connection Error**
```bash
# Ensure backend is running
cd ../Backend
npm run dev

# Check API URL in .env
echo $VITE_API_URL
```

#### 2. **Build Failures**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 3. **Responsive Issues**
```jsx
// Use Chakra UI responsive props
<Box display={{ base: "block", md: "flex" }}>
```

### 🐛 Debug Mode
```bash
# Run with debug logging
DEBUG=* npm run dev
```

## 📈 Performance

- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Components loaded on demand
- **Optimized Builds**: Production builds with minification
- **Responsive Images**: Chakra UI responsive image components

## 🔒 Security

- **XSS Protection**: React's built-in XSS prevention
- **CSRF Protection**: API layer handles CSRF tokens
- **Input Validation**: Client-side validation with react-hook-form
- **Authentication**: JWT tokens with automatic refresh

## 🤝 Contributing

1. Follow responsive design principles
2. Maintain dark theme consistency
3. Add proper TypeScript types (if converting)
4. Write comprehensive tests
5. Update documentation

## 📄 License

Private - Placify Platform Admin Interface

---

**Built with ❤️ using React, Chakra UI, and modern web technologies**