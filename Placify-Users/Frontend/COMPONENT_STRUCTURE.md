# Frontend Component Structure & Organization

This document describes the component architecture and organization in the Placify frontend application.

## 📁 Project Structure

```
Placify-Users/Frontend/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── common/          # Shared components across features
│   │   │   ├── Layout/      # Navigation, Footer, Section
│   │   │   └── UI/          # PageHero, Feature, NavigationDot
│   │   ├── features/        # Feature-specific components
│   │   │   ├── contact/     # Contact page components
│   │   │   ├── experience/  # Experience page components
│   │   │   ├── preparation/ # Preparation page components
│   │   │   └── home/        # Home page components
│   │   └── pages/           # Page components (legacy)
│   ├── pages/               # Main page components
│   │   ├── backup/          # Backup of original files
│   │   ├── Contact.jsx      # Contact page
│   │   ├── Experience.jsx   # Experience page
│   │   ├── Home.jsx         # Home page
│   │   ├── PostExperience.jsx # Post Experience page
│   │   └── Preparation.jsx # Preparation page
│   ├── services/            # API services
│   ├── utils/               # Utility functions
│   ├── assets/              # Static assets
│   ├── styles/              # Global styles
│   ├── theme/               # Chakra UI theme
│   └── routes/              # Routing configuration
├── public/                  # Public assets
├── dist/                    # Build output
├── node_modules/           # Dependencies
├── package.json            # Project dependencies
├── vite.config.js         # Vite configuration
└── README.md               # Frontend documentation
```

## 🏗️ Component Architecture

### 1. **Common Components** (`/components/common/`)

Shared components used across multiple features:

#### Layout Components
- **`AppNavigation`** - Main navigation bar with mobile drawer
- **`AppFooter`** - Site footer with contact info and links
- **`Section`** - Reusable section wrapper with animations

#### UI Components
- **`PageHero`** - Hero section for pages (title, subtitle)
- **`Feature`** - Feature showcase component
- **`NavigationDot`** - Navigation indicator dots

### 2. **Feature Components** (`/components/features/`)

Feature-specific components organized by domain:

#### Contact Feature (`/features/contact/`)
- **`ContactFormSection`** - Main contact form with validation
- **`ContactTeamMember`** - Team member card component
- **`ContactForm`** - Form with reCAPTCHA integration
- **`TeamMemberCard`** - Individual team member display

#### Experience Feature (`/features/experience/`)
- **Browse Components:**
  - `SearchAndFilters` - Search bar and filter dropdowns
  - `ExperienceList` - Main experience listing
- **Card Components:**
  - `FeaturedExperienceCard` - Large featured card
  - `SmallExperienceCard` - Scrollable small cards
  - `ExperienceScrollContainer` - Horizontal scroll container
- **Details Components:**
  - `ExperienceDetailsModal` - Experience details popup
- **Form Components:**
  - `ExperienceFormSection` - Multi-step form container
  - `StepNavigation` - Form step navigation
  - `PersonalDetailsStep` - Step 1: Personal info
  - `CompanyDetailsStep` - Step 2: Company info
  - `ProcessDetailsStep` - Step 3: Process details
  - `RoundDetailsStep` - Step 4: Round details
  - `QuestionsStep` - Step 5: Interview questions
  - `TipsStep` - Step 6: Tips and advice

#### Preparation Feature (`/features/preparation/`)
- **Card Components:**
  - `PreparationCard` - Individual preparation card
  - `PreparationCardsGrid` - Grid layout for cards
- **Modal Components:**
  - `PreparationDetailsModal` - Detailed preparation info
- **Data Components:**
  - `preparationData` - Centralized preparation data
- **Quote Components:**
  - `InspirationalQuote` - Motivational quote display

#### Home Feature (`/features/home/`)
- **State Management:**
  - `useHomeState` - Centralized home page state
- **Navigation:**
  - `HomeNavigation` - Home-specific navigation
- **Hero Section:**
  - `HeroContent` - Main hero content
  - `CompanyCards` - 3D company cards animation
- **Features Section:**
  - `Features` - Interactive features showcase
- **Platforms Section:**
  - `Platforms` - Practice platforms showcase
  - `PlatformsHeader` - Section header
  - `PlatformCards` - Platform cards grid
  - `PlatformCard` - Individual platform card
  - `PlatformDetails` - Call-to-action section
- **Interview Guide:**
  - `InterviewGuide` - Main interview guide section
  - `InterviewGuideHeader` - Section header
  - `InterviewSteps` - Steps container
  - `InterviewStepCard` - Individual step card
- **FAQ Section:**
  - `FAQ` - Main FAQ section
  - `FAQHeader` - Section header
  - `FAQContent` - FAQ content with categories
  - `FAQCategory` - Category selection
  - `FAQItem` - Individual Q&A item
  - `FAQBackground` - Animated background
- **Footer:**
  - `HomeFooter` - Home page footer
  - `FooterHeader` - Logo and description
  - `FooterContact` - Contact information
  - `FooterLinks` - Quick navigation links
  - `FooterBottom` - Copyright and legal links

## 🎯 Component Organization Principles

### 1. **Feature-First Architecture**
Components are organized by feature/domain rather than by type:
```
❌ Old Structure:
components/
├── buttons/
├── forms/
├── modals/

✅ New Structure:
components/features/
├── contact/
├── experience/
├── preparation/
└── home/
```

### 2. **Atomic Design Integration**
- **Atoms**: Basic UI elements (buttons, inputs)
- **Molecules**: Simple component combinations
- **Organisms**: Complex feature components
- **Templates**: Page layouts
- **Pages**: Complete page implementations

### 3. **Reusability Hierarchy**
```
Common Components (Global)
    ↓
Feature Components (Domain-specific)
    ↓
Page Components (Page-specific)
```

## 📦 Import System

### Path Aliases (configured in `vite.config.js`)
```javascript
'@' → './src'
'@/components' → './src/components'
'@/utils' → './src/utils'
'@/pages' → './src/pages'
'@/assets' → './src/assets'
```

### Import Examples
```javascript
// Clean imports using aliases
import { AppNavigation, AppFooter } from '@/components/common/Layout'
import { PageHero } from '@/components/common/UI'
import { ContactFormSection } from '@/components/features/contact'
import { useHomeState } from '@/components/features/home/HomeState'
```

## 🔧 State Management

### Home Page State (`useHomeState`)
Centralized state management for the home page:
```javascript
const {
  // Navigation state
  isOpen, onOpen, onClose,
  
  // Hero section state
  isCardsHovered, setIsCardsHovered,
  
  // Features section state
  activeCard, setActiveCard,
  
  // FAQ section state
  activeCategory, setActiveCategory,
  expandedQuestion, setExpandedQuestion
} = useHomeState()
```

## 🎨 Styling & Theming

### Chakra UI Integration
- **Theme**: Custom theme in `/src/theme/`
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Consistent dark theme across components
- **Animations**: Framer Motion integration

### Component Styling Patterns
```javascript
// Consistent styling patterns
const componentStyles = {
  // Apple-style design
  borderRadius: "2xl",
  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
  
  // Responsive design
  fontSize: { base: 'md', md: 'lg' },
  
  // Animation integration
  transition: "all 0.3s ease"
}
```

## 🚀 Performance Optimizations

### 1. **Code Splitting**
- Feature-based component splitting
- Lazy loading for heavy components
- Dynamic imports for modals

### 2. **Bundle Optimization**
- Tree shaking for unused code
- Component-level imports
- Optimized asset loading

### 3. **Rendering Optimizations**
- React.memo for expensive components
- useCallback for event handlers
- useMemo for computed values

## 📝 Development Guidelines

### 1. **Component Creation**
```javascript
// Component structure template
import { Box, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

const ComponentName = ({ prop1, prop2 }) => {
  return (
    <MotionBox>
      {/* Component content */}
    </MotionBox>
  )
}

export default ComponentName
```

### 2. **Index File Pattern**
```javascript
// components/features/featureName/index.js
export { default as ComponentName } from './ComponentName'
export { default as AnotherComponent } from './AnotherComponent'
```

### 3. **Naming Conventions**
- **Components**: PascalCase (`ContactFormSection`)
- **Files**: PascalCase for components (`ContactForm.jsx`)
- **Folders**: camelCase (`contactForm/`)
- **Hooks**: camelCase starting with 'use' (`useHomeState`)

## 🔗 Related Documentation

- **[Frontend README](../README.md)** - Main frontend documentation
- **[Vite Configuration](./vite.config.js)** - Build configuration
- **[Package.json](./package.json)** - Dependencies and scripts

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📊 Component Statistics

- **Total Components**: 50+
- **Common Components**: 6
- **Feature Components**: 40+
- **Page Components**: 5
- **Custom Hooks**: 3
- **Utility Functions**: 10+

## 🎯 Future Improvements

1. **Component Library**: Extract common components into a design system
2. **Storybook Integration**: Component documentation and testing
3. **TypeScript Migration**: Add type safety
4. **Testing**: Unit and integration tests
5. **Accessibility**: WCAG compliance improvements

---

*This documentation is maintained alongside the codebase. Please update it when adding new components or changing the structure.*
