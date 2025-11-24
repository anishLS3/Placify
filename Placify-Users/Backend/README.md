# Placify Backend API 🚀

> Node.js/Express backend for the Placify placement experience sharing platform.

## 📋 Overview

This backend provides a RESTful API for managing placement experiences and contact submissions. It includes security middleware, rate limiting, and MongoDB integration.

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Express Rate Limit** - Rate limiting
- **Express Validator** - Input validation

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn

### Installation

1. **Navigate to the backend directory**
   ```bash
   cd Placify-Users/Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file with your configuration:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/placify-admin
   # For MongoDB Atlas, use this format:
   # MONGODB_URI=mongodb+srv://[USERNAME]:[PASSWORD]@[CLUSTER].mongodb.net/placify-admin
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Frontend URL for CORS
   FRONTEND_URL=http://localhost:3000
   
   # reCAPTCHA (optional - for contact form verification)
   RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:5000`

## 📁 Project Structure

```
Backend/
├── src/
│   ├── config/
│   │   └── db.js              # Database connection
│   ├── controllers/
│   │   ├── contactController.js
│   │   └── experienceController.js
│   ├── models/
│   │   ├── Contact.js
│   │   ├── Experience.js
│   │   └── seed.js
│   ├── routes/
│   │   ├── contactRoutes.js
│   │   └── experienceRoutes.js
│   └── server.js              # Main server file
├── package.json
└── README.md
```

## 🔧 API Endpoints

### Experiences

- `GET /api/experiences` - Get all experiences
- `POST /api/experiences` - Create new experience

### Contact

- `POST /api/contact` - Submit contact form

## 📊 Data Models

### Experience Model

```javascript
{
  company: String,
  role: String,
  year: Number,
  experience: String,
  tips: String,
  difficulty: String,
  createdAt: Date
}
```

### Contact Model

```javascript
{
  name: String,
  email: String,
  subject: String,
  message: String,
  createdAt: Date
}
```

## 🔒 Security Features

- **Rate Limiting**: Prevents abuse with configurable limits
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet**: Security headers for protection
- **Input Validation**: Express-validator for data validation
- **Request Size Limits**: JSON payload size restrictions

## 🚀 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (if implemented)

## 🌍 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | Required |
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment mode | development |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |
| `RECAPTCHA_SECRET_KEY` | reCAPTCHA secret key (optional) | Test key provided |

## 📝 Rate Limits

- **Contact Form**: 3 submissions per 15 minutes
- **Experience Submission**: 5 submissions per 15 minutes
- **General API**: 100 requests per 15 minutes

## 🚀 Deployment

### Heroku

1. Create a Heroku app
2. Set environment variables
3. Deploy using Git

```bash
heroku create your-app-name
heroku config:set MONGODB_URI=your_mongodb_uri
git push heroku main
```

### Railway

1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### DigitalOcean App Platform

1. Create a new app
2. Connect your repository
3. Configure environment variables
4. Deploy

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests with coverage
npm run test:coverage
```

## 📊 Monitoring

The API includes logging for:
- Database connections
- Environment variables
- Server startup
- Error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
