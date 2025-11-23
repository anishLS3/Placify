# Placify 🎯

> A modern placement experience sharing platform that connects students and helps them prepare for interviews through real experiences.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/)

## 🌟 Features

- **📝 Experience Sharing**: Students can share their placement and internship experiences
- **🔍 Browse Experiences**: Search and filter experiences by company, role, and year
- **📚 Preparation Resources**: Access interview tips and preparation materials
- **📞 Contact System**: Get in touch with the platform administrators
- **🔒 Security**: Rate limiting, CORS protection, and input validation
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **⚡ Modern Stack**: Built with React, Node.js, and MongoDB

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB instance
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/placify.git
   cd placify
   ```

2. **Set up the Backend**
   ```bash
   cd Placify-Users/Backend
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI and other configurations
   ```

3. **Set up the Frontend**
   ```bash
   cd ../Frontend
   npm install
   ```

4. **Start the Development Servers**
   
   **Backend (Terminal 1):**
   ```bash
   cd Placify-Users/Backend
   npm run dev
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   cd Placify-Users/Frontend
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
Placify/
├── Placify-Users/
│   ├── Backend/                 # Node.js/Express API
│   │   ├── src/
│   │   │   ├── config/         # Database configuration
│   │   │   ├── controllers/    # API route handlers
│   │   │   ├── models/         # MongoDB schemas
│   │   │   ├── routes/         # API routes
│   │   │   └── server.js       # Main server file
│   │   └── package.json
│   └── Frontend/               # React application
│       ├── src/
│       │   ├── pages/          # React components
│       │   ├── theme/          # UI theme configuration
│       │   ├── utils/          # Utility functions
│       │   └── App.jsx         # Main app component
│       └── package.json
├── README.md                   # This file
└── LICENSE
```

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Express Rate Limit** - Rate limiting

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Chakra UI** - Component library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **AOS** - Scroll animations

## 🔧 Environment Variables

Create a `.env` file in the `Backend` directory:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/placify

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000

# reCAPTCHA (optional - for contact form verification)
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here
```

## 📚 API Documentation

### Endpoints

- `GET /api/experiences` - Get all experiences
- `POST /api/experiences` - Create new experience
- `POST /api/contact` - Submit contact form

### Rate Limits

- Contact form: 3 submissions per 15 minutes
- Experience submission: 5 submissions per 15 minutes
- General API: 100 requests per 15 minutes

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/DigitalOcean)

1. Set environment variables in your hosting platform
2. Ensure MongoDB Atlas is accessible from your hosting provider
3. Deploy using your preferred method

### Frontend Deployment (Vercel/Netlify)

1. Connect your repository to the deployment platform
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Anish L S** - *Initial work* - [GitHub](https://github.com/anishLS3)
- **Danush S**  - *Initial work* - [GitHub](https://github.com/Danushsenthilkumar)

## 🙏 Acknowledgments

- Thanks to all contributors who help improve this platform
- Special thanks to the student community for sharing their experiences

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact us through the platform's contact form

---

⭐ Star this repository if you found it helpful!