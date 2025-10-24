# Experience Feature Structure

## 📁 Organization

All experience-related components are now organized under a single `experience` folder for better maintainability and logical grouping.

## 🗂️ Folder Structure

```
features/experience/
├── ExperienceBrowse/           # Search and filtering components
│   ├── SearchAndFilters.jsx   # Search input and filter dropdowns
│   ├── ExperienceList.jsx     # Main experience list container
│   └── index.js               # Browse components exports
│
├── ExperienceCards/           # Experience card components
│   ├── FeaturedExperienceCard.jsx    # Large featured card
│   ├── SmallExperienceCard.jsx     # Small cards for scrollable list
│   ├── ExperienceScrollContainer.jsx # Horizontal scroll container
│   └── index.js               # Cards components exports
│
├── ExperienceDetails/         # Experience details components
│   ├── ExperienceDetailsModal.jsx  # Modal for full experience details
│   └── index.js               # Details components exports
│
├── ExperienceForm/            # Experience submission form
│   └── ExperienceFormSection.jsx   # Multi-step form container
│
├── ExperienceSteps/           # Individual form steps
│   ├── StepNavigation.jsx     # Step navigation component
│   ├── PersonalDetailsStep.jsx    # Step 1: Personal details
│   ├── CompanyDetailsStep.jsx     # Step 2: Company details
│   ├── ProcessDetailsStep.jsx     # Step 3: Process details
│   ├── RoundDetailsStep.jsx       # Step 4: Round details
│   ├── QuestionsStep.jsx          # Step 5: Questions
│   └── TipsStep.jsx               # Step 6: Tips
│
├── ExperienceValidation/       # Form validation utilities
│   ├── validation.js          # Validation functions
│   └── index.js               # Validation exports
│
└── index.js                   # Main experience feature exports
```

## 🎯 Component Categories

### **Browse Components**
- **SearchAndFilters**: Search input and filter dropdowns
- **ExperienceList**: Main container for experience display

### **Card Components**
- **FeaturedExperienceCard**: Large featured experience card
- **SmallExperienceCard**: Small cards for horizontal scroll
- **ExperienceScrollContainer**: Horizontal scrollable container

### **Details Components**
- **ExperienceDetailsModal**: Full experience details modal

### **Form Components**
- **ExperienceFormSection**: Multi-step form container
- **StepNavigation**: Step navigation component
- **Individual Steps**: 6 different form steps

### **Validation Components**
- **Validation utilities**: Form validation functions

## 📦 Import Examples

```javascript
// Import specific components
import { SearchAndFilters, ExperienceList } from '@/components/features/experience'

// Import all experience components
import * as ExperienceComponents from '@/components/features/experience'

// Import from specific sub-categories
import { FeaturedExperienceCard } from '@/components/features/experience'
import { ExperienceDetailsModal } from '@/components/features/experience'
```

## 🔄 Benefits

1. **Logical Grouping**: All experience-related components in one place
2. **Easy Navigation**: Clear folder structure for developers
3. **Maintainability**: Related components are co-located
4. **Scalability**: Easy to add new experience-related features
5. **Clean Imports**: Single import path for all experience components

## 🚀 Usage

All experience components can now be imported from a single path:
```javascript
import { 
  SearchAndFilters, 
  ExperienceList, 
  FeaturedExperienceCard,
  ExperienceDetailsModal 
} from '@/components/features/experience'
```

This structure follows industry best practices for feature-based organization and makes the codebase more maintainable and scalable.
