import { useState, useEffect } from 'react'
import { useAnimation } from 'framer-motion'
import { useDisclosure } from '@chakra-ui/react'
import { useInView } from 'react-intersection-observer'
import { 
  FaBook, FaBriefcase, FaUsers, FaUserTie, FaCertificate, FaGraduationCap
} from 'react-icons/fa'

export const useHomeState = () => {
  const controls = useAnimation()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [activeSection, setActiveSection] = useState("hero")
  const [activeCard, setActiveCard] = useState(1)
  const [activeTab, setActiveTab] = useState('summary')
  const [activeCategory, setActiveCategory] = useState('general')
  const [expandedQuestion, setExpandedQuestion] = useState(0)
  const [isCardsHovered, setIsCardsHovered] = useState(false)
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const sections = [
    { id: "hero", name: "Home" },
    { id: "features", name: "Features" },
    { id: "platforms", name: "Platforms" },
    { id: "interview-guide", name: "Interview Guide" },
    { id: "experience", name: "Experience" },
    { id: "faq", name: "FAQ" }
  ]

  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.scrollY + window.innerHeight / 2
      sections.forEach(({ id }) => {
        const element = document.getElementById(id)
        if (element) {
          const { top, bottom } = element.getBoundingClientRect()
          if (top <= window.innerHeight / 2 && bottom >= window.innerHeight / 2) {
            setActiveSection(id)
          }
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [controls, inView])

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  const features = [
    {
      icon: FaBook,
      title: 'Overview',
      text: ''
    },
    {
      icon: FaBriefcase,
      title: 'Key points',
      text: ''
    },
    {
      icon: FaUsers,
      title: 'Meeting transcript',
      text: ''
    },
    {
      icon: FaUserTie,
      title: 'Speakers',
      text: ''
    },
    {
      icon: FaCertificate,
      title: 'Export',
      text: ''
    },
    {
      icon: FaGraduationCap,
      title: 'One-click sharing',
      text: ''
    }
  ]

  return {
    // State
    activeSection,
    setActiveSection,
    activeCard,
    setActiveCard,
    activeTab,
    setActiveTab,
    activeCategory,
    setActiveCategory,
    expandedQuestion,
    setExpandedQuestion,
    isCardsHovered,
    setIsCardsHovered,
    isOpen,
    onOpen,
    onClose,
    
    // Refs and animations
    ref,
    inView,
    controls,
    
    // Data
    sections,
    features,
    
    // Variants
    containerVariants,
    itemVariants,
    
    // Functions
    scrollToSection
  }
}
