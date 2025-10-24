# Placify Frontend 🎨

> Modern React application for the Placify placement experience sharing platform.

## 📋 Overview

This frontend provides a beautiful, responsive user interface for students to share and browse placement experiences. Built with React 18, Vite, and Chakra UI.

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Chakra UI** - Component library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **AOS** - Scroll animations
- **React Icons** - Icon library

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Navigate to the frontend directory**
   ```bash
   cd Placify-Users/Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will start on `http://localhost:3000`

## 📁 Project Structure

```
Frontend/
├── src/
│   ├── components/             # Modular component system
│   │   ├── common/            # Shared components (Layout, UI)
│   │   └── features/         # Feature-specific components
│   │       ├── contact/       # Contact page components
│   │       ├── experience/   # Experience page components
│   │       ├── preparation/  # Preparation page components
│   │       └── home/         # Home page components
│   ├── pages/                 # Main page components
│   │   ├── Home.jsx          # Landing page
│   │   ├── Experience.jsx    # Browse experiences
│   │   ├── PostExperience.jsx # Share experience
│   │   ├── Preparation.jsx   # Preparation resources
│   │   └── Contact.jsx       # Contact form
│   ├── theme/
│   │   └── index.js          # Chakra UI theme
│   ├── utils/
│   │   └── api.js            # API utilities
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── dist/                     # Build output
├── package.json
├── vite.config.js
├── README.md                  # This file
└── COMPONENT_STRUCTURE.md     # Detailed component documentation
```

> 📖 **For detailed component architecture and organization, see [COMPONENT_STRUCTURE.md](./COMPONENT_STRUCTURE.md)**

## 🎨 Features

### Pages

- **Home** - Landing page with hero section and features
- **Experience** - Browse and search placement experiences
- **Post Experience** - Share your placement experience
- **Preparation** - Interview tips and resources
- **Contact** - Contact form for support

### Component Architecture

The application follows a **feature-first component architecture** with:

- **Common Components** - Shared UI elements (Navigation, Footer, etc.)
- **Feature Components** - Domain-specific components organized by feature
- **Page Components** - Main page implementations
- **State Management** - Centralized state with custom hooks
- **Path Aliases** - Clean import system with `@/` aliases

### UI Components

- Responsive design for all screen sizes
- Modern animations with Framer Motion
- Scroll animations with AOS
- Toast notifications
- Loading states
- Error handling

## 🚀 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🎨 Styling

The application uses Chakra UI for styling with:
- Custom theme configuration
- Responsive design
- Dark/light mode support
- Consistent color palette
- Typography system

## 🔧 Configuration

### Vite Configuration

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  }
})
```

### API Configuration

The frontend connects to the backend API through the `utils/api.js` file. Make sure the backend is running on the correct port.

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet**: Responsive layout for tablets
- **Desktop**: Full-featured desktop experience
- **Breakpoints**: Custom breakpoints for different screen sizes

## 🎭 Animations

- **Framer Motion**: Page transitions and component animations
- **AOS**: Scroll-triggered animations
- **Chakra UI**: Built-in animation components

## 🚀 Deployment

### Vercel

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy

### Netlify

1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests with coverage
npm run test:coverage
```

## 📊 Performance

- **Vite**: Fast build times and HMR
- **Code Splitting**: Automatic code splitting
- **Tree Shaking**: Remove unused code
- **Optimized Assets**: Compressed images and assets

## 🎨 Customization

### Theme

Edit `src/theme/index.js` to customize:
- Colors
- Typography
- Spacing
- Components

### Styling

- Global styles in `src/index.css`
- Component-specific styles
- Chakra UI theme customization

## 🔧 Development

### Adding New Pages

1. Create a new component in `src/pages/`
2. Add the route in `src/App.jsx`
3. Update navigation if needed

### API Integration

Use the `utils/api.js` file for API calls:

```javascript
import { api } from '../utils/api'

// Get experiences
const experiences = await api.get('/experiences')

// Post experience
const response = await api.post('/experiences', data)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
