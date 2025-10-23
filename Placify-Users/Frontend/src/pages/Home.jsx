import { Box, Heading, Text, Container, Button, Stack, Flex, Icon, SimpleGrid, VStack, Input, Grid, HStack, useDisclosure, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FaGraduationCap, FaBriefcase, FaUsers, FaBook, FaChevronDown, FaLaptopCode, FaUserTie, FaChalkboardTeacher, FaCertificate, FaCode, FaTrophy, FaRocket, FaBrain, FaCog, FaLightbulb, FaChartLine, FaGamepad, FaGraduationCap as FaGrad, FaCrown, FaStar, FaMedal, FaHome, FaCalendar, FaComments, FaList, FaHeart, FaClock, FaShare, FaDownload, FaEllipsisH, FaVolumeUp, FaBackward, FaPlay, FaForward, FaClosedCaptioning, FaExpand, FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash, FaPause, FaDesktop, FaCommentDots, FaEllipsisV, FaUpload, FaBars, FaWifi, FaPlus } from 'react-icons/fa'
import { motion, useAnimation, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useEffect, useRef, useState } from 'react'

const MotionBox = motion(Box)
const MotionFlex = motion(Flex)
const MotionText = motion(Text)
const MotionHeading = motion(Heading)
const MotionStack = motion(Stack)
const MotionButton = motion(Button)
const MotionSimpleGrid = motion(SimpleGrid)

const Section = ({ children, bg, id }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  })
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3])
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], ["-3deg", "0deg", "3deg"])
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.2, 0])

  return (
    <Box
      as="section"
      ref={sectionRef}
      h="100vh"
      w="100%"
      display="flex"
      alignItems="flex-start"
      justifyContent="flex-start"
      position="relative"
      bg={bg}
      overflow="hidden"
      p={0}
      m={0}
      id={id}
      sx={{
        perspective: "1000px",
        transformStyle: "preserve-3d"
      }}
    >
      <MotionBox
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        style={{
          backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 70%)",
          opacity: backgroundOpacity,
          transform: useTransform(scrollYProgress, [0, 1], ["scale(0.8)", "scale(1.2)"])
        }}
      />
      <MotionBox
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        style={{
          background: "linear-gradient(45deg, rgba(66, 153, 225, 0.1) 0%, rgba(236, 201, 75, 0.1) 100%)",
          opacity: backgroundOpacity
        }}
        animate={{
          background: [
            "linear-gradient(45deg, rgba(66, 153, 225, 0.1) 0%, rgba(236, 201, 75, 0.1) 100%)",
            "linear-gradient(45deg, rgba(236, 201, 75, 0.1) 0%, rgba(66, 153, 225, 0.1) 100%)"
          ]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <MotionBox
        ref={ref}
        style={{ 
          y, 
          scale,
          opacity,
          rotateX,
        }}
        initial={{ opacity: 0, y: 100, scale: 0.9 }}
        animate={inView ? { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: {
            duration: 0.8,
            type: "spring",
            bounce: 0.3
          }
        } : {}}
        whileInView={{
          rotateX: "0deg",
          transition: {
            duration: 1,
            type: "spring",
            stiffness: 100
          }
        }}
        width="100%"
      >
        {children}
      </MotionBox>
    </Box>
  )
}

const Feature = ({ icon, title, text, index }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: index * 0.2
      }
    }
  }

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        delay: index * 0.2 + 0.3
      }
    }
  }

  return (
    <MotionBox
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover={{ y: -12, scale: 1.02 }}
    >
      <MotionStack
        bg="white"
        borderRadius="xl"
        p={8}
        textAlign="center"
        boxShadow="lg"
        position="relative"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: "xl",
          background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
          opacity: 0,
          transition: "opacity 0.3s"
        }}
        _hover={{
          _before: {
            opacity: 1
          }
        }}
        whileHover={{ 
          y: -12,
          rotateX: 10,
          rotateY: -10,
          boxShadow: "2xl"
        }}
        transition={{ 
          duration: 0.4,
          type: "spring",
          stiffness: 300
        }}
      >
        <MotionFlex
          w={16}
          h={16}
          align={'center'}
          justify={'center'}
          color={'white'}
          rounded={'full'}
          bg={'purple.500'}
          mb={4}
          mx="auto"
          variants={iconVariants}
          whileHover={{ 
            scale: 1.2,
            rotate: 360,
            boxShadow: "0 0 20px rgba(49, 130, 206, 0.4)"
          }}
          animate={{
            boxShadow: ["0 0 0px rgba(49, 130, 206, 0)", "0 0 20px rgba(49, 130, 206, 0.4)", "0 0 0px rgba(49, 130, 206, 0)"],
          }}
          transition={{ 
            duration: 0.5,
            type: "spring",
            stiffness: 200,
            boxShadow: {
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }
          }}
        >
          <Icon as={icon} w={8} h={8} />
        </MotionFlex>
        <MotionHeading
          size="md"
          mb={2}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
        >
          {title}
        </MotionHeading>
        <MotionText
          color={'gray.600'}
          fontSize={'sm'}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
        >
          {text}
        </MotionText>
      </MotionStack>
    </MotionBox>
  )
}

const NavigationDot = ({ active, onClick }) => (
  <MotionBox
    width="12px"
    height="12px"
    borderRadius="full"
    bg={active ? "purple.500" : "gray.300"}
    cursor="pointer"
    onClick={onClick}
    whileHover={{ scale: 1.2 }}
    whileTap={{ scale: 0.9 }}
    animate={{
      scale: active ? 1.2 : 1,
      backgroundColor: active ? "#805ad5" : "#a0aec0"
    }}
  />
)

const Home = () => {
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

  return (
    <Flex direction="column" minH="100vh" m={0} p={0}>
      <Box position="relative" sx={{ margin: 0, padding: 0 }}>
      {/* Navigation dots removed - no longer needed */}

      {/* Hero Section with Integrated Navbar */}
      <Box
        h="100vh"
        bg="#000000"
        id="hero"
        overflow="hidden"
        position="relative"
      >
        {/* Integrated Navbar */}
        <Box 
          position="absolute" 
          top={0} 
          left={0} 
          right={0} 
          zIndex={20}
          bg="rgba(0, 0, 0, 0.8)"
          backdropFilter="blur(20px)"
          borderBottom="1px solid rgba(255,255,255,0.1)"
          px={4}
          py={2}
        >
          <Flex h={16} alignItems={'center'} justifyContent={'space-between'} maxW="container.xl" mx="auto">
            {/* Logo */}
          <MotionBox
              as={RouterLink}
              to="/"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              display="flex"
              alignItems="center"
              gap={2}
            >
              <Text
                fontSize="lg"
                color="white"
                fontWeight="600"
                letterSpacing="tight"
              >
                Placify
              </Text>
            </MotionBox>

            {/* Navigation Menu */}
            <HStack
              as={'nav'}
              spacing={8}
              display={{ base: 'none', md: 'flex' }}
            >
              <Button
                as={RouterLink}
                to="/"
                variant="ghost"
                color="white"
                _hover={{ color: 'white', bg: 'transparent' }}
                fontWeight="400"
                fontSize="sm"
                h="auto"
                py={1}
              >
                Home
              </Button>

              <Button
                as={RouterLink}
                to="/preparation"
                variant="ghost"
                color="whiteAlpha.800"
                _hover={{ color: 'white', bg: 'transparent' }}
                fontWeight="400"
                fontSize="sm"
                h="auto"
                py={1}
              >
                Preparation
              </Button>

              <Button
                as={RouterLink}
                to="/experience"
                variant="ghost"
                color="whiteAlpha.800"
                _hover={{ color: 'white', bg: 'transparent' }}
                fontWeight="400"
                fontSize="sm"
                h="auto"
                py={1}
              >
                Experience
              </Button>

              <Button
                as={RouterLink}
                to="/post-experience"
                variant="ghost"
                color="whiteAlpha.800"
                _hover={{ color: 'white', bg: 'transparent' }}
                fontWeight="400"
                fontSize="sm"
                h="auto"
                py={1}
              >
                Post Experience
              </Button>

              <Button
                as={RouterLink}
                to="/contact"
                variant="ghost"
                color="whiteAlpha.800"
                _hover={{ color: 'white', bg: 'transparent' }}
                fontWeight="400"
                fontSize="sm"
                h="auto"
                py={1}
              >
                Contact
              </Button>

              <Button
                as="button"
                onClick={(e) => {
                  e.preventDefault()
                  const faqSection = document.getElementById('faq')
                  if (faqSection) {
                    faqSection.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                variant="ghost"
                color="whiteAlpha.800"
                _hover={{ color: 'white', bg: 'transparent' }}
                fontWeight="400"
                fontSize="sm"
                h="auto"
                py={1}
                type="button"
              >
                FAQ
              </Button>

            </HStack>

            {/* Mobile Menu Button */}
            <Button
              as="button"
              display={{ base: 'flex', md: 'none' }}
              variant="ghost"
              color="white"
              _hover={{ bg: 'whiteAlpha.100' }}
              onClick={onOpen}
              p={2}
            >
              <Icon as={FaBars} />
            </Button>
          </Flex>
        </Box>

        {/* Mobile Navigation Drawer */}
        <Drawer isOpen={isOpen} onClose={onClose} placement="right">
          <DrawerOverlay />
          <DrawerContent bg="#1d1d1f">
            <DrawerCloseButton color="white" />
            <DrawerHeader color="white">Menu</DrawerHeader>
            <DrawerBody>
              <VStack spacing={4} align="stretch">
                <Button
                  as={RouterLink}
                  to="/"
                  variant="ghost"
                  color="white"
                  _hover={{ color: 'white' }}
                  fontWeight="500"
                  justifyContent="flex-start"
                  onClick={onClose}
                >
                  Home
                </Button>
                <Button
                  as={RouterLink}
                  to="/preparation"
                  variant="ghost"
                  color="whiteAlpha.800"
                  _hover={{ color: 'white' }}
                  fontWeight="400"
                  justifyContent="flex-start"
                  onClick={onClose}
                >
                  Preparation
                </Button>
                <Button
                  as={RouterLink}
                  to="/experience"
                  variant="ghost"
                  color="whiteAlpha.800"
                  _hover={{ color: 'white' }}
                  fontWeight="400"
                  justifyContent="flex-start"
                  onClick={onClose}
                >
                  Experience
                </Button>
                <Button
                  as={RouterLink}
                  to="/post-experience"
                  variant="ghost"
                  color="whiteAlpha.800"
                  _hover={{ color: 'white' }}
                  fontWeight="400"
                  justifyContent="flex-start"
                  onClick={onClose}
                >
                  Post Experience
                </Button>
                <Button
                  as={RouterLink}
                  to="/contact"
                  variant="ghost"
                  color="whiteAlpha.800"
                  _hover={{ color: 'white' }}
                  fontWeight="400"
                  justifyContent="flex-start"
                  onClick={onClose}
                >
                  Contact
                </Button>
                <Button
                  as="button"
                  onClick={(e) => {
                    e.preventDefault()
                    onClose()
                    const faqSection = document.getElementById('faq')
                    if (faqSection) {
                      faqSection.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                  variant="ghost"
                  color="whiteAlpha.800"
                  _hover={{ color: 'white' }}
                  fontWeight="400"
                  justifyContent="flex-start"
                >
                  FAQ
                </Button>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
        {/* Professional Background Pattern */}
        <Box 
            position="absolute"
          top={0} 
          left={0} 
          right={0} 
          bottom={0}
          opacity={0.05}
          sx={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(255,255,255,0.08) 0%, transparent 50%),
              radial-gradient(circle at 40% 60%, rgba(255,255,255,0.06) 0%, transparent 50%)
            `
          }}
        />
        
        {/* Floating Geometric Shapes */}
            <MotionBox
              position="absolute"
          top="20%"
          left="15%"
          w="60px"
          h="60px"
          border="2px solid"
              borderColor="whiteAlpha.200"
          borderRadius="full"
          opacity={0.3}
              animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360]
              }}
              transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
              }}
            />

            <MotionBox
              position="absolute"
          top="30%"
          right="20%"
          w="40px"
          h="40px"
          border="2px solid"
              borderColor="whiteAlpha.300"
          borderRadius="md"
          opacity={0.4}
              animate={{
            y: [0, -15, 0],
            rotate: [0, -90, 0]
              }}
              transition={{
            duration: 6,
                repeat: Infinity,
            ease: "easeInOut",
            delay: 1
              }}
            />

            <MotionBox
              position="absolute"
          top="60%"
          left="25%"
          w="50px"
          h="50px"
          border="2px solid"
          borderColor="whiteAlpha.250"
          borderRadius="lg"
          opacity={0.35}
              animate={{
            y: [0, -25, 0],
            rotate: [0, 90, 0]
              }}
              transition={{
            duration: 7,
                repeat: Infinity,
            ease: "easeInOut",
            delay: 2
              }}
            />

            <MotionBox
              position="absolute"
          top="70%"
          right="15%"
          w="35px"
          h="35px"
          border="2px solid"
          borderColor="whiteAlpha.200"
          borderRadius="full"
          opacity={0.3}
              animate={{
            y: [0, -18, 0],
            rotate: [0, -180, 0]
              }}
              transition={{
            duration: 9,
                repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
              }}
            />

        {/* Subtle Gradient Orbs */}
            <MotionBox
              position="absolute"
          top="15%"
          right="30%"
          w="80px"
          h="80px"
          bg="linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))"
              borderRadius="full"
          opacity={0.2}
              animate={{
                scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2]
              }}
              transition={{
            duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut"
              }}
            />

            <MotionBox
              position="absolute"
          top="80%"
          left="10%"
          w="60px"
          h="60px"
          bg="linear-gradient(45deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))"
          borderRadius="full"
          opacity={0.15}
              animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.3, 0.15]
              }}
              transition={{
            duration: 12,
                repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />

        <Container maxW="container.xl" position="relative" h="100vh" display="flex" alignItems="center" pt={20}>
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={12} w="100%" alignItems="center">
            {/* Left Section - Text Content */}
            <MotionBox
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
              {/* Main Headline - Apple Style */}
              <Heading
              fontSize={{ base: '4xl', md: '6xl', lg: '7xl' }}
                fontWeight="600"
              color="white"
              mb={6}
                lineHeight="1.05"
                letterSpacing="-0.02em"
              >
                Get placed at
                <br />
                top companies.
              </Heading>

            {/* Subtitle */}
              <Text
              fontSize={{ base: 'lg', md: 'xl' }}
                color="whiteAlpha.700"
              mb={12}
              maxW="600px"
              lineHeight="1.6"
                fontWeight="400"
              >
                Learn from real interview experiences, prepare with expert resources, and land your dream job at top tech companies.
              </Text>
            </MotionBox>

            {/* Right Section - 3D Company Cards Fan Layout */}
            <MotionBox
              display={{ base: 'none', lg: 'block' }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              position="relative"
              h="550px"
              onHoverStart={() => setIsCardsHovered(true)}
              onHoverEnd={() => setIsCardsHovered(false)}
              cursor="pointer"
            >
              {/* Google Card - Position 1 (Top-Right) */}
              <MotionBox
                position="absolute"
                top={isCardsHovered ? "0%" : "8%"}
                right={isCardsHovered ? "-5%" : "2%"}
                w="320px"
                h="200px"
                borderRadius="20px"
                bg="white"
                boxShadow="0 30px 60px rgba(66, 133, 244, 0.4)"
                transform={isCardsHovered ? "perspective(1500px) rotateY(-15deg) rotateX(8deg) rotateZ(-5deg)" : "perspective(1500px) rotateY(-15deg) rotateX(8deg) rotateZ(-8deg)"}
                p={6}
                zIndex={isCardsHovered ? 5 : 4}
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                animate={isCardsHovered ? {
                  scale: 1.1
                } : {
                  y: [0, -15, 0]
                }}
                transition={{
                  duration: isCardsHovered ? 0.5 : 6,
                  repeat: isCardsHovered ? 0 : Infinity,
                  ease: "easeInOut"
                }}
              >
                <VStack align="flex-start" spacing={4}>
                  <Heading fontSize="4xl" fontWeight="bold" color="#4285f4">
                    Google
                  </Heading>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    Software Engineer
                  </Text>
                </VStack>
                <HStack justify="space-between" align="center">
                  <VStack align="flex-start" spacing={0}>
                    <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                      ₹18L
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      avg package
                    </Text>
                  </VStack>
                  <Icon as={FaBriefcase} fontSize="3xl" color="#4285f4" opacity={0.3} />
                </HStack>
          </MotionBox>

              {/* Microsoft Card - Position 2 (Middle-Right) */}
              <MotionBox
                position="absolute"
                top={isCardsHovered ? "18%" : "22%"}
                right={isCardsHovered ? "-10%" : "8%"}
                w="320px"
                h="200px"
                borderRadius="20px"
                bg="linear-gradient(135deg, #00a4ef 0%, #0078d4 100%)"
                boxShadow="0 30px 60px rgba(0, 120, 212, 0.4)"
                transform={isCardsHovered ? "perspective(1500px) rotateY(-12deg) rotateX(6deg) rotateZ(-2deg)" : "perspective(1500px) rotateY(-12deg) rotateX(6deg) rotateZ(-4deg)"}
                p={6}
                zIndex={isCardsHovered ? 5 : 3}
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                animate={isCardsHovered ? {
                  scale: 1.1
                } : {
                  y: [0, -18, 0]
                }}
                transition={{
                  duration: isCardsHovered ? 0.5 : 7,
                  repeat: isCardsHovered ? 0 : Infinity,
                  ease: "easeInOut",
                  delay: isCardsHovered ? 0 : 0.5
                }}
              >
                <VStack align="flex-start" spacing={4}>
                  <Heading fontSize="4xl" fontWeight="bold" color="white">
                    Microsoft
                  </Heading>
                  <Text fontSize="sm" color="whiteAlpha.900" fontWeight="medium">
                    SDE Intern
                  </Text>
                </VStack>
                <HStack justify="space-between" align="center">
                  <VStack align="flex-start" spacing={0}>
                    <Text fontSize="2xl" fontWeight="bold" color="white">
                      ₹15L
                    </Text>
                    <Text fontSize="xs" color="whiteAlpha.800">
                      avg package
                    </Text>
                  </VStack>
                  <Icon as={FaCode} fontSize="3xl" color="white" opacity={0.3} />
                </HStack>
              </MotionBox>

              {/* Amazon Card - Position 3 (Center) */}
              <MotionBox
                position="absolute"
                top={isCardsHovered ? "38%" : "36%"}
                right={isCardsHovered ? "-15%" : "14%"}
                w="320px"
                h="200px"
                borderRadius="20px"
                bg="linear-gradient(135deg, #ff9900 0%, #ff6600 100%)"
                boxShadow="0 30px 60px rgba(255, 153, 0, 0.4)"
                transform={isCardsHovered ? "perspective(1500px) rotateY(-10deg) rotateX(5deg) rotateZ(2deg)" : "perspective(1500px) rotateY(-10deg) rotateX(5deg) rotateZ(0deg)"}
                p={6}
                zIndex={isCardsHovered ? 5 : 2}
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                animate={isCardsHovered ? {
                  scale: 1.1
                } : {
                  y: [0, -16, 0]
                }}
                transition={{
                  duration: isCardsHovered ? 0.5 : 8,
                  repeat: isCardsHovered ? 0 : Infinity,
                  ease: "easeInOut",
                  delay: isCardsHovered ? 0 : 1
                }}
              >
                <VStack align="flex-start" spacing={4}>
                  <Heading fontSize="4xl" fontWeight="bold" color="white">
                    Amazon
                  </Heading>
                  <Text fontSize="sm" color="whiteAlpha.900" fontWeight="medium">
                    SDE - I
                  </Text>
                </VStack>
                <HStack justify="space-between" align="center">
                  <VStack align="flex-start" spacing={0}>
                    <Text fontSize="2xl" fontWeight="bold" color="white">
                      ₹20L
                    </Text>
                    <Text fontSize="xs" color="whiteAlpha.800">
                      avg package
                    </Text>
                  </VStack>
                  <Icon as={FaTrophy} fontSize="3xl" color="white" opacity={0.3} />
                </HStack>
              </MotionBox>

              {/* Meta Card - Position 4 (Bottom-Right) */}
              <MotionBox
                position="absolute"
                top={isCardsHovered ? "58%" : "50%"}
                right={isCardsHovered ? "-20%" : "20%"}
                w="320px"
                h="200px"
                borderRadius="20px"
                bg="linear-gradient(135deg, #0084ff 0%, #0066cc 100%)"
                boxShadow="0 30px 60px rgba(0, 132, 255, 0.4)"
                transform={isCardsHovered ? "perspective(1500px) rotateY(-8deg) rotateX(4deg) rotateZ(5deg)" : "perspective(1500px) rotateY(-8deg) rotateX(4deg) rotateZ(4deg)"}
                p={6}
                zIndex={isCardsHovered ? 5 : 1}
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                animate={isCardsHovered ? {
                  scale: 1.1
                } : {
                  y: [0, -14, 0]
                }}
                transition={{
                  duration: isCardsHovered ? 0.5 : 9,
                  repeat: isCardsHovered ? 0 : Infinity,
                  ease: "easeInOut",
                  delay: isCardsHovered ? 0 : 1.5
                }}
              >
                <VStack align="flex-start" spacing={4}>
                  <Heading fontSize="4xl" fontWeight="bold" color="white">
                    Meta
                  </Heading>
                  <Text fontSize="sm" color="whiteAlpha.900" fontWeight="medium">
                    Software Engineer
                  </Text>
                </VStack>
                <HStack justify="space-between" align="center">
                  <VStack align="flex-start" spacing={0}>
                    <Text fontSize="2xl" fontWeight="bold" color="white">
                      ₹22L
                    </Text>
                    <Text fontSize="xs" color="whiteAlpha.800">
                      avg package
                    </Text>
                  </VStack>
                  <Icon as={FaRocket} fontSize="3xl" color="white" opacity={0.3} />
                </HStack>
              </MotionBox>
            </MotionBox>
          </Grid>
        </Container>
                </Box>

      <Box 
        id="features" 
        py={20}
        bg="white"
        position="relative"
      >
        <Container maxW="container.xl">
            <MotionBox
            display="flex"
            flexDirection={{ base: 'column', lg: 'row' }}
            alignItems="center"
            gap={12}
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
            {/* Left Section - Text Content */}
            <MotionBox
              flex={1}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <MotionBox
                bg="purple.100"
                color="purple.800"
                px={4}
                py={2}
              borderRadius="full"
                  fontSize="sm"
                  fontWeight="medium"
                display="inline-block"
                mb={6}
                >
                Simplify placement process
            </MotionBox>
              
              <MotionHeading
                fontSize={{ base: '4xl', md: '6xl', lg: '7xl' }}
                fontWeight="bold"
                color="gray.900"
                lineHeight="1.1"
                mb={6}
              >
                All-in-One
                <br />
                platform for
                <br />
                placements
              </MotionHeading>
              
              <MotionText
                fontSize="xl"
                color="gray.600"
                lineHeight="1.6"
                maxW="2xl"
              >
                Streamline your placement journey with our comprehensive all-in-one platform. 
                Simplify preparation, sharing experiences, and connecting with successful candidates effortlessly.
              </MotionText>
            </MotionBox>

            {/* Right Section - Gradient with Interactive Cards */}
              <MotionBox
              flex={1}
              position="relative"
              overflow="hidden"
              borderRadius="2xl"
              bgGradient="linear(to-br, orange.400, purple.500, pink.400)"
              sx={{
                background: 'linear-gradient(135deg, #ff8a80 0%, #805ad5 50%, #f687b3 100%)'
              }}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Background Pattern */}
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                opacity={0.1}
                bgImage="radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 70%)"
              />
              
              <Box p={8} position="relative" zIndex={2}>
                <MotionHeading
                  fontSize={{ base: '2xl', md: '4xl' }}
                  color="white"
                  fontWeight="bold"
                  mb={4}
                  textShadow="0 2px 4px rgba(0,0,0,0.1)"
                >
                  {activeCard === 1 ? "Explore Experience" : activeCard === 2 ? "Preparation Tips" : "Post Experience"}
                </MotionHeading>
                
                <MotionText
                  color="whiteAlpha.900"
                  fontSize="lg"
                  mb={8}
                  textShadow="0 1px 2px rgba(0,0,0,0.1)"
                >
                  {activeCard === 1 
                    ? "Browse through real placement experiences shared by successful candidates from top companies."
                    : activeCard === 2 
                    ? "Get expert tips and strategies for technical interviews, behavioral questions, and company-specific preparation."
                    : "Share your placement journey and help other students by posting your interview experiences and success stories."
                  }
                </MotionText>
                
                {/* Dynamic Card Content */}
                  <MotionBox
                  bg="white"
                    borderRadius="xl"
                  p={6}
                  boxShadow="2xl"
                  position="relative"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  key={activeCard}
                  _hover={{
                    "& .overlay-button": {
                      opacity: 1,
                      transform: "translateY(0)"
                    }
                  }}
                >
                  {activeCard === 1 && (
                    <>
                      {/* Search Bar */}
                      <MotionBox
                    display="flex"
                    alignItems="center"
                        bg="gray.50"
                        borderRadius="lg"
                  p={3}
                        mb={4}
                      >
                        <Icon as={FaBook} w={5} h={5} color="gray.400" mr={3} />
                        <Text color="gray.500" fontSize="sm">Search placement experiences...</Text>
                  </MotionBox>
                      
                      {/* Filter Pills */}
                      <MotionBox
                        bg="white"
                        borderRadius="lg"
                        p={4}
                  boxShadow="lg"
                        position="absolute"
                        top="-10px"
                        right="-10px"
                        minW="180px"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.4 }}
                        zIndex={10}
                      >
                        <Text fontSize="sm" fontWeight="bold" color="gray.700" mb={3}>
                          Experience Filters 6
                        </Text>
                        <Flex flexWrap="wrap" gap={1.5}>
                          {['Success Stories 10', 'Interview Tips 7', 'Company Insights 8', 'Preparation 3', 'Challenges 2', 'Resources 23'].map((filter, index) => (
                            <MotionBox
                  key={index}
                              bg={index === 0 ? "purple.500" : "gray.200"}
                              color={index === 0 ? "white" : "gray.700"}
                              px={2.5}
                              py={1}
                              borderRadius="full"
                              fontSize="xs"
                    fontWeight="medium"
                              whileHover={{ scale: 1.05 }}
                              cursor="pointer"
                >
                              {filter}
            </MotionBox>
          ))}
                        </Flex>
                      </MotionBox>
                      
                      {/* Experience List */}
                      <VStack spacing={3} align="stretch">
                        {[
                          { name: "Sarah Johnson", company: "Google", text: "The technical interview process was challenging but the preparation resources helped me succeed..." },
                          { name: "Mike Chen", company: "Microsoft", text: "Behavioral questions were the key focus. Here's how I prepared for the STAR method..." },
                          { name: "Alex Kumar", company: "Amazon", text: "System design round was intense. These are the concepts that helped me the most..." }
                        ].map((experience, index) => (
              <MotionBox
                            key={index}
                            display="flex"
                            alignItems="center"
                            p={3}
                            bg="gray.50"
                            borderRadius="lg"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                          >
                            <Box
                              w={8}
                              h={8}
                              bg="purple.500"
                              borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                              mr={3}
                            >
                              <Text color="white" fontSize="xs" fontWeight="bold">
                                {experience.name.charAt(0)}
                  </Text>
      </Box>
                            <Box flex={1}>
                              <Text fontSize="sm" fontWeight="bold" color="gray.800">
                                {experience.name} - {experience.company}
                  </Text>
                              <Text fontSize="xs" color="gray.600">
                                {experience.text}
                              </Text>
                            </Box>
              </MotionBox>
            ))}
          </VStack>
                    </>
                  )}
            
                  {activeCard === 2 && (
                    <>
                      {/* Search Bar */}
            <MotionBox
                        display="flex"
                        alignItems="center"
                        bg="gray.50"
                        borderRadius="lg"
                        p={3}
                        mb={4}
                      >
                        <Icon as={FaBook} w={5} h={5} color="gray.400" mr={3} />
                        <Text color="gray.500" fontSize="sm">Search preparation resources...</Text>
                      </MotionBox>
                      
                      {/* Filter Pills */}
                      <MotionBox
                        bg="white"
                        borderRadius="lg"
                        p={4}
                        boxShadow="lg"
              position="absolute"
                        top="-10px"
                        right="-10px"
                        minW="180px"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.4 }}
                        zIndex={10}
                      >
                        <Text fontSize="sm" fontWeight="bold" color="gray.700" mb={3}>
                          Prep Categories 6
                        </Text>
                        <Flex flexWrap="wrap" gap={1.5}>
                          {['Technical Prep 8', 'Behavioral 5', 'Company Research 3', 'Mock Tests 2', 'Resources 12', 'Tips 7'].map((filter, index) => (
                            <MotionBox
                              key={index}
                              bg={index === 0 ? "purple.500" : "gray.200"}
                              color={index === 0 ? "white" : "gray.700"}
                              px={2.5}
                              py={1}
                              borderRadius="full"
                              fontSize="xs"
                              fontWeight="medium"
                              whileHover={{ scale: 1.05 }}
                              cursor="pointer"
                            >
                              {filter}
                            </MotionBox>
                          ))}
                        </Flex>
          </MotionBox>

                      {/* Preparation List */}
                      <VStack spacing={3} align="stretch">
                        {[
                          { name: "Technical Prep", topic: "45% Weightage", text: "Focus on coding problems, algorithms, and data structures. This forms the core of technical interviews..." },
                          { name: "Behavioral Prep", topic: "25% Weightage", text: "STAR method practice, leadership examples, and teamwork scenarios. Essential for cultural fit..." },
                          { name: "System Design", topic: "20% Weightage", text: "High-level system architecture, scalability concepts, and trade-offs. Critical for senior roles..." }
                        ].map((prep, index) => (
            <MotionBox
                            key={index}
                            display="flex"
                            alignItems="center"
                            p={3}
                            bg="gray.50"
                            borderRadius="lg"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
            >
              <Box
                              w={8}
                              h={8}
                              bg="purple.500"
                              borderRadius="full"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              mr={3}
                            >
                              <Text color="white" fontSize="xs" fontWeight="bold">
                                {prep.name.charAt(0)}
                  </Text>
                            </Box>
                            <Box flex={1}>
                              <Text fontSize="sm" fontWeight="bold" color="gray.800">
                                {prep.name} - {prep.topic}
                  </Text>
                              <Text fontSize="xs" color="gray.600">
                                {prep.text}
                              </Text>
              </Box>
            </MotionBox>
          ))}
                      </VStack>
                    </>
                  )}

                  {activeCard === 3 && (
                    <>
                      {/* Search Bar */}
            <MotionBox
                        display="flex"
                        alignItems="center"
                        bg="gray.50"
                        borderRadius="lg"
                        p={3}
                        mb={4}
                      >
                        <Icon as={FaUserTie} w={5} h={5} color="gray.400" mr={3} />
                        <Text color="gray.500" fontSize="sm">Search success stories...</Text>
                      </MotionBox>
                      
                      {/* Filter Pills */}
              <MotionBox
                        bg="white"
                        borderRadius="lg"
                        p={4}
                        boxShadow="lg"
                position="absolute"
                        top="-10px"
                        right="-10px"
                        minW="180px"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.4 }}
                        zIndex={10}
                      >
                        <Text fontSize="sm" fontWeight="bold" color="gray.700" mb={3}>
                          Story Types 6
                        </Text>
                        <Flex flexWrap="wrap" gap={1.5}>
                          {['Success Stories 10', 'Interview Tips 7', 'Company Insights 8', 'Preparation 3', 'Challenges 2', 'Resources 23'].map((filter, index) => (
                            <MotionBox
                              key={index}
                              bg={index === 0 ? "green.500" : "gray.200"}
                              color={index === 0 ? "white" : "gray.700"}
                              px={2.5}
                              py={1}
                borderRadius="full"
                              fontSize="xs"
                              fontWeight="medium"
                              whileHover={{ scale: 1.05 }}
                              cursor="pointer"
                            >
                              {filter}
            </MotionBox>
          ))}
                        </Flex>
                      </MotionBox>
                      
                      {/* Success Stories List */}
                      <VStack spacing={3} align="stretch">
                        {[
                          { name: "Lisa Park", company: "Meta", text: "After 6 months of preparation, I finally got my dream offer at Meta. Here's my complete journey and what worked..." },
                          { name: "Ryan Torres", company: "Netflix", text: "The system design interview was intense but manageable. These resources and practice sessions were crucial..." },
                          { name: "Priya Sharma", company: "Apple", text: "Behavioral questions were the key differentiator. Here's how I prepared using the STAR method effectively..." }
                        ].map((story, index) => (
            <MotionBox
                            key={index}
                            display="flex"
                            alignItems="center"
                            p={3}
                            bg="gray.50"
                            borderRadius="lg"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                          >
                            <Box
                              w={8}
                              h={8}
                              bg="green.500"
              borderRadius="full"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              mr={3}
                            >
                              <Text color="white" fontSize="xs" fontWeight="bold">
                                {story.name.charAt(0)}
                              </Text>
                            </Box>
                            <Box flex={1}>
                              <Text fontSize="sm" fontWeight="bold" color="gray.800">
                                {story.name} - {story.company}
                              </Text>
                              <Text fontSize="xs" color="gray.600">
                                {story.text}
                              </Text>
                            </Box>
                          </MotionBox>
                        ))}
                      </VStack>
                    </>
                  )}
                  
                  {/* Overlay Button */}
            <MotionBox
                    className="overlay-button"
              position="absolute"
                    bottom="20px"
                    left="50%"
                    transform="translateX(-50%)"
                    opacity={0}
                    transition="all 0.3s ease"
                    zIndex={20}
                  >
                    <Button
                      as={RouterLink}
                      to={activeCard === 1 ? "/experience" : activeCard === 2 ? "/preparation" : "/post-experience"}
                      bg={activeCard === 1 ? "purple.500" : activeCard === 2 ? "blue.500" : "green.500"}
                      color="white"
                      size="md"
                      px={6}
                      py={3}
                      borderRadius="xl"
                      fontWeight="bold"
                      fontSize="sm"
                      boxShadow="0 8px 25px rgba(0, 0, 0, 0.15)"
                      _hover={{
                        bg: activeCard === 1 ? "purple.600" : activeCard === 2 ? "blue.600" : "green.600",
                        transform: "translateY(-2px)",
                        boxShadow: "0 12px 30px rgba(0, 0, 0, 0.2)"
                      }}
                      _active={{
                        transform: "translateY(0)"
                      }}
                      leftIcon={<Icon as={activeCard === 1 ? FaUsers : activeCard === 2 ? FaBook : FaUserTie} />}
                    >
                      {activeCard === 1 ? "Explore Experiences" : activeCard === 2 ? "Start Preparation" : "Share Experience"}
                    </Button>
                  </MotionBox>
                </MotionBox>
              </Box>
            </MotionBox>

            {/* 1, 2, 3 Indicators - Outside Container */}
            <MotionBox
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
              ml={8}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              {[1, 2, 3].map((num, index) => (
              <MotionBox
                  key={num}
                  position="relative"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <MotionBox
                    w={12}
                    h={12}
                    bg={activeCard === num ? "purple.500" : "gray.200"}
              borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    cursor="pointer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveCard(num)}
                    border="2px solid"
                    borderColor={activeCard === num ? "purple.500" : "gray.300"}
                    boxShadow={activeCard === num ? "0 0 20px rgba(128, 90, 213, 0.3)" : "none"}
                    zIndex={2}
                  >
                    <Text 
                      color={activeCard === num ? "white" : "gray.600"} 
                      fontSize="lg" 
                      fontWeight="bold"
                    >
                      {num}
                    </Text>
                  </MotionBox>
                  
                  {/* Connecting Line */}
                  {index < 2 && (
                    <Box
                      w="2px"
                      h="16px"
                      bg="gray.300"
                      mt={2}
                    />
                  )}
                </MotionBox>
              ))}
            </MotionBox>
          </MotionBox>
        </Container>
      </Box>

      {/* Practice Platforms Section */}
      <Box
        id="platforms"
        py={40}
        bg="#000000"
        position="relative"
        borderTop="1px solid"
        borderColor="whiteAlpha.100"
          overflow="hidden"
      >
        {/* Apple-style color highlights and gradients */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          pointerEvents="none"
        >
          {/* Main radial gradient */}
          <Box
            position="absolute"
            top="20%"
            left="10%"
            w="600px"
            h="600px"
            background="radial-gradient(circle, rgba(0,122,255,0.08) 0%, rgba(255,45,85,0.05) 30%, transparent 70%)"
            borderRadius="full"
            filter="blur(80px)"
          />
          
          {/* Secondary gradient */}
          <Box
            position="absolute"
            top="60%"
            right="15%"
            w="400px"
            h="400px"
            background="radial-gradient(circle, rgba(52,199,89,0.06) 0%, rgba(255,149,0,0.04) 40%, transparent 70%)"
            borderRadius="full"
            filter="blur(60px)"
          />
          
          {/* Accent glow */}
          <Box
            position="absolute"
            bottom="10%"
            left="30%"
            w="300px"
            h="300px"
            background="radial-gradient(circle, rgba(175,82,222,0.05) 0%, transparent 60%)"
            borderRadius="full"
            filter="blur(40px)"
          />
          
          {/* Animated floating elements */}
            <MotionBox
              position="absolute"
            top="15%"
            right="20%"
            w="4px"
            h="4px"
            bg="rgba(0, 122, 255, 0.6)"
            borderRadius="full"
              animate={{
                y: [0, -20, 0],
              opacity: [0.3, 1, 0.3]
              }}
              transition={{
              duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          
          <MotionBox
            position="absolute"
            top="40%"
            left="5%"
            w="6px"
            h="6px"
            bg="rgba(52, 199, 89, 0.5)"
            borderRadius="full"
            animate={{
              y: [0, 15, 0],
              x: [0, 10, 0],
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          
          <MotionBox
            position="absolute"
            bottom="30%"
            right="10%"
            w="3px"
            h="3px"
            bg="rgba(255, 149, 0, 0.7)"
            borderRadius="full"
            animate={{
              y: [0, -10, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
        </Box>

        <Container maxW="1400px">
          {/* Heading */}
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            textAlign="center"
            mb={24}
          >
            <Text
              fontSize="sm"
              color="whiteAlpha.500"
              mb={4}
              letterSpacing="0.1em"
              textTransform="uppercase"
            >
              Practice Platforms
            </Text>
            
            <Heading
              fontSize={{ base: '4xl', md: '6xl', lg: '7xl' }}
              fontWeight="600"
              color="white"
              mb={6}
              lineHeight="1.05"
              letterSpacing="-0.03em"
            >
              Master coding.
              <br />
              Anywhere.
            </Heading>
            
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              color="whiteAlpha.600"
              maxW="800px"
              mx="auto"
              lineHeight="1.6"
            >
              Connect with the world's leading coding platforms. Practice, learn, and compete with millions of developers worldwide.
            </Text>
                </MotionBox>

          {/* Platform Grid - Enhanced */}
          <VStack align="stretch" spacing={0} maxW="1200px" mx="auto">
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={1}>
              {/* LeetCode */}
              <MotionBox
                as="a"
                href="https://leetcode.com"
                target="_blank"
                rel="noopener noreferrer"
                p={10}
                textDecoration="none"
                cursor="pointer"
                position="relative"
                whileHover={{ 
                  bg: 'whiteAlpha.50',
                  scale: 1.02,
                  y: -2
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                borderRadius="2xl"
                border="1px solid"
                borderColor="rgba(255, 161, 22, 0.2)"
                bg="rgba(255, 161, 22, 0.03)"
                backdropFilter="blur(10px)"
                _before={{
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(255, 161, 22, 0.1) 0%, transparent 50%)',
                  borderRadius: '2xl',
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                }}
                _hover={{
                  _before: { opacity: 1 }
                }}
              >
                <VStack align="start" spacing={4}>
                  <HStack justify="space-between" w="full">
                    <Text fontSize="2xl" fontWeight="700" color="white">
                      LeetCode
                  </Text>
                    <Text fontSize="xs" color="whiteAlpha.400" bg="whiteAlpha.100" px={2} py={1} borderRadius="full">
                      #1
                </Text>
                  </HStack>
                  
                  <Text fontSize="md" color="whiteAlpha.700" lineHeight="1.6">
                    Master data structures and algorithms with 2000+ curated problems
                  </Text>
                  
                  <HStack spacing={4} fontSize="sm" color="whiteAlpha.500">
                    <Text>2M+ Users</Text>
                    <Text>•</Text>
                    <Text>2000+ Problems</Text>
                  </HStack>
                  
                  <Box w="full" h="1px" bg="whiteAlpha.200" />
                  
                  <Text fontSize="sm" color="whiteAlpha.600">
                      Two Sum • Binary Search • Dynamic Programming
                    </Text>
                </VStack>
                </MotionBox>

              {/* HackerRank */}
              <MotionBox
                as="a"
                href="https://www.hackerrank.com"
                target="_blank"
                rel="noopener noreferrer"
                p={10}
                textDecoration="none"
                cursor="pointer"
                position="relative"
                whileHover={{ 
                  bg: 'whiteAlpha.50',
                  scale: 1.02,
                  y: -2
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                borderRadius="2xl"
                border="1px solid"
                borderColor="rgba(46, 200, 102, 0.2)"
                bg="rgba(46, 200, 102, 0.03)"
                backdropFilter="blur(10px)"
                _before={{
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(46, 200, 102, 0.1) 0%, transparent 50%)',
                  borderRadius: '2xl',
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                }}
                _hover={{
                  _before: { opacity: 1 }
                }}
              >
                <VStack align="start" spacing={4}>
                  <HStack justify="space-between" w="full">
                    <Text fontSize="2xl" fontWeight="700" color="white">
                      HackerRank
                </Text>
                    <Text fontSize="xs" color="whiteAlpha.400" bg="whiteAlpha.100" px={2} py={1} borderRadius="full">
                      Skills
                </Text>
                  </HStack>
                  
                  <Text fontSize="md" color="whiteAlpha.700" lineHeight="1.6">
                    Build coding skills with hands-on practice and earn certifications
                  </Text>
                  
                  <HStack spacing={4} fontSize="sm" color="whiteAlpha.500">
                    <Text>7M+ Users</Text>
                    <Text>•</Text>
                    <Text>Certifications</Text>
                  </HStack>
                  
                  <Box w="full" h="1px" bg="whiteAlpha.200" />
                  
                  <Text fontSize="sm" color="whiteAlpha.600">
                    Python • JavaScript • SQL • Problem Solving
                  </Text>
                </VStack>
            </MotionBox>

              {/* Codeforces */}
                <MotionBox
                as="a"
                href="https://codeforces.com"
                target="_blank"
                rel="noopener noreferrer"
                p={10}
                textDecoration="none"
                cursor="pointer"
                position="relative"
                whileHover={{ 
                  bg: 'whiteAlpha.50',
                  scale: 1.02,
                  y: -2
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                borderRadius="2xl"
                border="1px solid"
                borderColor="rgba(31, 142, 205, 0.2)"
                bg="rgba(31, 142, 205, 0.03)"
                backdropFilter="blur(10px)"
                _before={{
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(31, 142, 205, 0.1) 0%, transparent 50%)',
                  borderRadius: '2xl',
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                }}
                _hover={{
                  _before: { opacity: 1 }
                }}
              >
                <VStack align="start" spacing={4}>
                  <HStack justify="space-between" w="full">
                    <Text fontSize="2xl" fontWeight="700" color="white">
                      Codeforces
                </Text>
                    <Text fontSize="xs" color="whiteAlpha.400" bg="whiteAlpha.100" px={2} py={1} borderRadius="full">
                      Contest
                </Text>
                  </HStack>
                  
                  <Text fontSize="md" color="whiteAlpha.700" lineHeight="1.6">
                    Participate in contests and improve your problem-solving speed
                  </Text>
                  
                  <HStack spacing={4} fontSize="sm" color="whiteAlpha.500">
                    <Text>1M+ Users</Text>
                    <Text>•</Text>
                    <Text>Weekly Contests</Text>
                  </HStack>
                  
                  <Box w="full" h="1px" bg="whiteAlpha.200" />
                  
                  <Text fontSize="sm" color="whiteAlpha.600">
                    Div 2 • Div 3 • Educational Rounds • Global Rounds
                  </Text>
                </VStack>
              </MotionBox>

              {/* GeeksforGeeks */}
                <MotionBox
                as="a"
                href="https://www.geeksforgeeks.org"
                target="_blank"
                rel="noopener noreferrer"
                p={10}
                textDecoration="none"
                cursor="pointer"
                position="relative"
                whileHover={{ 
                  bg: 'whiteAlpha.50',
                  scale: 1.02,
                  y: -2
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                borderRadius="2xl"
                border="1px solid"
                borderColor="rgba(46, 204, 113, 0.2)"
                bg="rgba(46, 204, 113, 0.03)"
                backdropFilter="blur(10px)"
                _before={{
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(46, 204, 113, 0.1) 0%, transparent 50%)',
                  borderRadius: '2xl',
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                }}
                _hover={{
                  _before: { opacity: 1 }
                }}
              >
                <VStack align="start" spacing={4}>
                  <HStack justify="space-between" w="full">
                    <Text fontSize="2xl" fontWeight="700" color="white">
                      GeeksforGeeks
                </Text>
                    <Text fontSize="xs" color="whiteAlpha.400" bg="whiteAlpha.100" px={2} py={1} borderRadius="full">
                      Learn
                </Text>
                  </HStack>
                  
                  <Text fontSize="md" color="whiteAlpha.700" lineHeight="1.6">
                    Comprehensive tutorials and practice problems for all skill levels
                  </Text>
                  
                  <HStack spacing={4} fontSize="sm" color="whiteAlpha.500">
                    <Text>10M+ Users</Text>
                    <Text>•</Text>
                    <Text>Free Content</Text>
                  </HStack>
                  
                  <Box w="full" h="1px" bg="whiteAlpha.200" />
                  
                  <Text fontSize="sm" color="whiteAlpha.600">
                    DSA • System Design • Interview Prep • Company Prep
                  </Text>
                </VStack>
              </MotionBox>

              {/* InterviewBit */}
                <MotionBox
                as="a"
                href="https://www.interviewbit.com"
                target="_blank"
                rel="noopener noreferrer"
                p={10}
                textDecoration="none"
                cursor="pointer"
                position="relative"
                whileHover={{ 
                  bg: 'whiteAlpha.50',
                  scale: 1.02,
                  y: -2
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                borderRadius="2xl"
                border="1px solid"
                borderColor="rgba(231, 76, 60, 0.2)"
                bg="rgba(231, 76, 60, 0.03)"
                backdropFilter="blur(10px)"
                _before={{
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(231, 76, 60, 0.1) 0%, transparent 50%)',
                  borderRadius: '2xl',
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                }}
                _hover={{
                  _before: { opacity: 1 }
                }}
              >
                <VStack align="start" spacing={4}>
                  <HStack justify="space-between" w="full">
                    <Text fontSize="2xl" fontWeight="700" color="white">
                      InterviewBit
                </Text>
                    <Text fontSize="xs" color="whiteAlpha.400" bg="whiteAlpha.100" px={2} py={1} borderRadius="full">
                      Prep
                </Text>
                  </HStack>
                  
                  <Text fontSize="md" color="whiteAlpha.700" lineHeight="1.6">
                    Structured roadmap for technical interviews with company-specific problems
                  </Text>
                  
                  <HStack spacing={4} fontSize="sm" color="whiteAlpha.500">
                    <Text>500K+ Users</Text>
                    <Text>•</Text>
                    <Text>Company Specific</Text>
                  </HStack>
                  
                  <Box w="full" h="1px" bg="whiteAlpha.200" />
                  
                  <Text fontSize="sm" color="whiteAlpha.600">
                    FAANG • Microsoft • Amazon • Google • Meta
                  </Text>
                </VStack>
              </MotionBox>

              {/* CodeChef */}
              <MotionBox
                as="a"
                href="https://www.codechef.com"
                target="_blank"
                rel="noopener noreferrer"
                p={10}
                textDecoration="none"
                cursor="pointer"
                position="relative"
                whileHover={{ 
                  bg: 'whiteAlpha.50',
                  scale: 1.02,
                  y: -2
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                borderRadius="2xl"
                border="1px solid"
                borderColor="rgba(175, 82, 222, 0.2)"
                bg="rgba(175, 82, 222, 0.03)"
                backdropFilter="blur(10px)"
                _before={{
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(175, 82, 222, 0.1) 0%, transparent 50%)',
                  borderRadius: '2xl',
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                }}
                _hover={{
                  _before: { opacity: 1 }
                }}
              >
                <VStack align="start" spacing={4}>
                  <HStack justify="space-between" w="full">
                    <Text fontSize="2xl" fontWeight="700" color="white">
                      CodeChef
                </Text>
                    <Text fontSize="xs" color="whiteAlpha.400" bg="whiteAlpha.100" px={2} py={1} borderRadius="full">
                      Contest
                </Text>
                  </HStack>
                  
                  <Text fontSize="md" color="whiteAlpha.700" lineHeight="1.6">
                    Programming contests and challenges for competitive coding
                  </Text>
                  
                  <HStack spacing={4} fontSize="sm" color="whiteAlpha.500">
                    <Text>3M+ Users</Text>
                    <Text>•</Text>
                    <Text>Monthly Contests</Text>
                  </HStack>
                  
                  <Box w="full" h="1px" bg="whiteAlpha.200" />
                  
                  <Text fontSize="sm" color="whiteAlpha.600">
                    Long Challenge • Cook-Off • Lunchtime • SnackDown
                  </Text>
                </VStack>
              </MotionBox>
            </SimpleGrid>

            {/* Call to Action */}
                <MotionBox
              textAlign="center"
              mt={20}
              initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
              <Text
                fontSize="lg"
                color="whiteAlpha.600"
                mb={8}
                maxW="600px"
                mx="auto"
                lineHeight="1.6"
              >
                Ready to start your coding journey? Choose your platform and begin practicing today.
              </Text>
              
              <HStack justify="center" spacing={6} flexWrap="wrap">
                <Button
                  as="a"
                  href="https://leetcode.com"
                  target="_blank"
                  size="lg"
                  bg="white"
                  color="black"
                  _hover={{ bg: "whiteAlpha.900" }}
                  borderRadius="full"
                  px={8}
                  py={6}
                  fontSize="md"
                  fontWeight="600"
                >
                  Start with LeetCode
                </Button>
                
                <Button
                  as="a"
                  href="https://www.hackerrank.com"
                  target="_blank"
                  size="lg"
                  variant="outline"
                  borderColor="whiteAlpha.300"
                  color="white"
                  _hover={{ 
                    bg: "whiteAlpha.100",
                    borderColor: "whiteAlpha.500"
                  }}
                  borderRadius="full"
                  px={8}
                  py={6}
                  fontSize="md"
                  fontWeight="600"
                >
                  Try HackerRank
                </Button>
              </HStack>
          </MotionBox>
          </VStack>
        </Container>
      </Box>

      {/* Interview Guide Section */}
      <Box
        id="interview-guide"
        py={40}
        bg="#1a1a1a"
          position="relative"
        overflow="hidden"
      >
        <Container maxW="1400px">
          {/* Header */}
            <MotionBox
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            textAlign="center"
            mb={20}
          >
            <Text
              fontSize="sm"
              color="whiteAlpha.500"
              mb={4}
              letterSpacing="0.1em"
              textTransform="uppercase"
            >
              To keep in mind
            </Text>
            
            <Heading
              fontSize={{ base: '4xl', md: '6xl', lg: '7xl' }}
              fontWeight="600"
              color="white"
              mb={6}
              lineHeight="1.05"
              letterSpacing="-0.03em"
            >
              How to answer
              <br />
              coding questions.
            </Heading>
            
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              color="whiteAlpha.600"
              maxW="800px"
              mx="auto"
              lineHeight="1.6"
            >
              Master the art of technical interviews with our comprehensive step-by-step guide.
            </Text>
          </MotionBox>

          {/* Interview Steps Cards */}
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Box
              display="flex"
              gap={6}
              overflowX="auto"
              pb={4}
              sx={{
                '&::-webkit-scrollbar': {
                  height: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: '3px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: 'rgba(0,0,0,0.3)',
                },
              }}
            >
              {/* Step 1 */}
              <Box
                bg="black"
                borderRadius="2xl"
            p={8}
                minW="280px"
                maxW="280px"
                h="420px"
                flexShrink={0}
                boxShadow="0 4px 20px rgba(0, 0, 0, 0.3)"
                _hover={{ 
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)"
                }}
                transition="all 0.3s ease"
                display="flex"
                flexDirection="column"
            position="relative"
            overflow="hidden"
                border="1px solid"
                borderColor="whiteAlpha.100"
              >
                {/* Header Section */}
                <VStack align="start" spacing={6} mb={8}>
                  <HStack align="start" spacing={4}>
                    <Box
                      w={10}
                      h={10}
                      bg="white"
                      color="black"
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="700"
                      fontSize="lg"
                      flexShrink={0}
                      boxShadow="0 2px 8px rgba(255, 255, 255, 0.2)"
                    >
                      1
                </Box>
                    <Text fontSize="xl" fontWeight="700" color="white" lineHeight="1.2" letterSpacing="-0.02em">
                      Clarify the problem statement
                    </Text>
                  </HStack>
                </VStack>
                
                {/* Content Section */}
                <VStack align="start" spacing={6} flex={1} justify="space-between">
                  <Text 
                    fontSize="md" 
                    color="whiteAlpha.700" 
                    lineHeight="1.7" 
                    wordBreak="break-word"
                    textAlign="left"
                    fontWeight="400"
                    letterSpacing="0.01em"
                  >
                          Before attempting to solve a problem, it is important to understand the problem clearly. Hence it is important to ask right questions.
                        </Text>
                  
                  {/* Bottom accent line */}
                  <Box w="full" h="1px" bg="whiteAlpha.200" opacity={0.6} />
                        </VStack>
                      </Box>

              {/* Step 2 */}
              <Box
                bg="black"
                borderRadius="2xl"
                p={8}
                minW="280px"
                maxW="280px"
                h="420px"
                flexShrink={0}
                boxShadow="0 4px 20px rgba(0, 0, 0, 0.3)"
                _hover={{ 
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)"
                }}
                transition="all 0.3s ease"
                display="flex"
                flexDirection="column"
                    position="relative"
                    overflow="hidden"
                border="1px solid"
                borderColor="whiteAlpha.100"
              >
                {/* Header Section */}
                <VStack align="start" spacing={6} mb={8}>
                  <HStack align="start" spacing={4}>
                    <Box
                      w={10}
                      h={10}
                      bg="white"
                      color="black"
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="700"
                      fontSize="lg"
                      flexShrink={0}
                      boxShadow="0 2px 8px rgba(255, 255, 255, 0.2)"
                    >
                      2
                    </Box>
                    <Text fontSize="xl" fontWeight="700" color="white" lineHeight="1.2" letterSpacing="-0.02em">
                      Constraints
                    </Text>
                  </HStack>
                </VStack>
                
                {/* Content Section */}
                <VStack align="start" spacing={6} flex={1} justify="space-between">
                  <Text 
                    fontSize="md" 
                    color="whiteAlpha.700" 
                    lineHeight="1.7" 
                    wordBreak="break-word"
                    textAlign="left"
                    fontWeight="400"
                    letterSpacing="0.01em"
                  >
                    If there is a clear understanding of the problem statement, the next step is to determine whether there are any specific constraints that must be followed.
                  </Text>
                  
                  {/* Bottom accent line */}
                  <Box w="full" h="1px" bg="whiteAlpha.200" opacity={0.6} />
                </VStack>
                  </Box>

              {/* Step 3 */}
              <Box
                bg="black"
                borderRadius="2xl"
                p={8}
                minW="280px"
                maxW="280px"
                h="420px"
                flexShrink={0}
                boxShadow="0 4px 20px rgba(0, 0, 0, 0.3)"
                _hover={{ 
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)"
                }}
                transition="all 0.3s ease"
                display="flex"
                flexDirection="column"
                    position="relative"
                    overflow="hidden"
                border="1px solid"
                borderColor="whiteAlpha.100"
              >
                {/* Header Section */}
                <VStack align="start" spacing={6} mb={8}>
                  <HStack align="start" spacing={4}>
                    <Box
                      w={10}
                      h={10}
                      bg="white"
                      color="black"
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="700"
                      fontSize="lg"
                      flexShrink={0}
                      boxShadow="0 2px 8px rgba(255, 255, 255, 0.2)"
                    >
                      3
                    </Box>
                    <Text fontSize="xl" fontWeight="700" color="white" lineHeight="1.2" letterSpacing="-0.02em">
                      Observations
                    </Text>
                  </HStack>
                </VStack>
                
                {/* Content Section */}
                <VStack align="start" spacing={6} flex={1} justify="space-between">
                  <Text 
                    fontSize="md" 
                    color="whiteAlpha.700" 
                    lineHeight="1.7" 
                    wordBreak="break-word"
                    textAlign="left"
                    fontWeight="400"
                    letterSpacing="0.01em"
                  >
                    Every problem has a peculiar behaviour associated with it. So don't forget to tell the interviewer about all of the observations of that problem.
                  </Text>
                  
                  {/* Bottom accent line */}
                  <Box w="full" h="1px" bg="whiteAlpha.200" opacity={0.6} />
                </VStack>
                  </Box>

              {/* Step 4 */}
              <Box
                bg="black"
                borderRadius="2xl"
                p={8}
                minW="280px"
                maxW="280px"
                h="420px"
                flexShrink={0}
                boxShadow="0 4px 20px rgba(0, 0, 0, 0.3)"
                _hover={{ 
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)"
                }}
                transition="all 0.3s ease"
                display="flex"
                flexDirection="column"
                    position="relative"
                    overflow="hidden"
                border="1px solid"
                borderColor="whiteAlpha.100"
              >
                {/* Header Section */}
                <VStack align="start" spacing={6} mb={8}>
                  <HStack align="start" spacing={4}>
                    <Box
                      w={10}
                      h={10}
                      bg="white"
                      color="black"
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="700"
                      fontSize="lg"
                      flexShrink={0}
                      boxShadow="0 2px 8px rgba(255, 255, 255, 0.2)"
                    >
                      4
                    </Box>
                    <Text fontSize="xl" fontWeight="700" color="white" lineHeight="1.2" letterSpacing="-0.02em">
                      Approaches
                    </Text>
                  </HStack>
                </VStack>
                
                {/* Content Section */}
                <VStack align="start" spacing={6} flex={1} justify="space-between">
                  <Text 
                    fontSize="md" 
                    color="whiteAlpha.700" 
                    lineHeight="1.7" 
                    wordBreak="break-word"
                    textAlign="left"
                    fontWeight="400"
                    letterSpacing="0.01em"
                  >
                    This is the most crucial part in the entire interview process. If you intend to solve the problem with a data structure, explain why you want to do so. If you're stuck, use the brute force method.
                  </Text>
                  
                  {/* Bottom accent line */}
                  <Box w="full" h="1px" bg="whiteAlpha.200" opacity={0.6} />
                </VStack>
                  </Box>

              {/* Step 5 */}
              <Box
                bg="black"
                borderRadius="2xl"
                p={8}
                minW="280px"
                maxW="280px"
                h="420px"
                flexShrink={0}
                boxShadow="0 4px 20px rgba(0, 0, 0, 0.3)"
                _hover={{ 
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)"
                }}
                transition="all 0.3s ease"
                display="flex"
                flexDirection="column"
                    position="relative"
                    overflow="hidden"
                border="1px solid"
                borderColor="whiteAlpha.100"
              >
                {/* Header Section */}
                <VStack align="start" spacing={6} mb={8}>
                  <HStack align="start" spacing={4}>
                    <Box
                      w={10}
                      h={10}
                      bg="white"
                      color="black"
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="700"
                      fontSize="lg"
                      flexShrink={0}
                      boxShadow="0 2px 8px rgba(255, 255, 255, 0.2)"
                    >
                      5
                    </Box>
                    <Text fontSize="xl" fontWeight="700" color="white" lineHeight="1.2" letterSpacing="-0.02em">
                      Discuss your approach
                      </Text>
                  </HStack>
                      </VStack>

                {/* Content Section */}
                <VStack align="start" spacing={6} flex={1} justify="space-between">
                  <Text 
                    fontSize="md" 
                    color="whiteAlpha.700" 
                    lineHeight="1.7" 
                    wordBreak="break-word"
                    textAlign="left"
                    fontWeight="400"
                    letterSpacing="0.01em"
                  >
                    When you've narrowed down your plan and believe you have a solution, talk to the interviewer about it. Accept if the interviewer proposes something new and begin thinking along those lines. Don't be too rigid in your thinking.
                  </Text>
                  
                  {/* Bottom accent line */}
                  <Box w="full" h="1px" bg="whiteAlpha.200" opacity={0.6} />
                      </VStack>
              </Box>

              {/* Step 6 */}
              <Box
                bg="black"
                borderRadius="2xl"
                p={8}
                minW="280px"
                maxW="280px"
                h="420px"
                flexShrink={0}
                boxShadow="0 4px 20px rgba(0, 0, 0, 0.3)"
                _hover={{ 
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)"
                }}
                transition="all 0.3s ease"
                          display="flex"
                flexDirection="column"
                position="relative"
                overflow="hidden"
                border="1px solid"
                borderColor="whiteAlpha.100"
              >
                {/* Header Section */}
                <VStack align="start" spacing={6} mb={8}>
                  <HStack align="start" spacing={4}>
                    <Box
                      w={10}
                      h={10}
                      bg="white"
                      color="black"
                          borderRadius="full"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                      fontWeight="700"
                      fontSize="lg"
                      flexShrink={0}
                      boxShadow="0 2px 8px rgba(255, 255, 255, 0.2)"
                    >
                      6
                        </Box>
                    <Text fontSize="xl" fontWeight="700" color="white" lineHeight="1.2" letterSpacing="-0.02em">
                      Edge Cases and counter examples
                    </Text>
                    </HStack>
                </VStack>
                
                {/* Content Section */}
                <VStack align="start" spacing={6} flex={1} justify="space-between">
                  <Text 
                    fontSize="md" 
                    color="whiteAlpha.700" 
                    lineHeight="1.7" 
                    wordBreak="break-word"
                    textAlign="left"
                    fontWeight="400"
                    letterSpacing="0.01em"
                  >
                    If the solution for the problem is decided, make sure to test it for all possible edge-cases.
                  </Text>
                  
                  {/* Bottom accent line */}
                  <Box w="full" h="1px" bg="whiteAlpha.200" opacity={0.6} />
                </VStack>
              </Box>
              {/* Step 7 */}
              <Box
                bg="black"
                borderRadius="2xl"
                p={8}
                minW="280px"
                maxW="280px"
                h="420px"
                flexShrink={0}
                boxShadow="0 4px 20px rgba(0, 0, 0, 0.3)"
                _hover={{ 
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)"
                }}
                transition="all 0.3s ease"
                        display="flex"
                flexDirection="column"
                position="relative"
                overflow="hidden"
                border="1px solid"
                borderColor="whiteAlpha.100"
              >
                {/* Header Section */}
                <VStack align="start" spacing={6} mb={8}>
                  <HStack align="start" spacing={4}>
                    <Box
                      w={10}
                      h={10}
                      bg="white"
                      color="black"
                      borderRadius="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      fontWeight="700"
                      fontSize="lg"
                      flexShrink={0}
                      boxShadow="0 2px 8px rgba(255, 255, 255, 0.2)"
                      >
                      7
                      </Box>
                    <Text fontSize="xl" fontWeight="700" color="white" lineHeight="1.2" letterSpacing="-0.02em">
                      Writing the Code
                    </Text>
                    </HStack>
                  </VStack>
                
                {/* Content Section */}
                <VStack align="start" spacing={6} flex={1} justify="space-between">
                  <Text 
                    fontSize="md" 
                    color="whiteAlpha.700" 
                    lineHeight="1.7" 
                    wordBreak="break-word"
                    textAlign="left"
                    fontWeight="400"
                    letterSpacing="0.01em"
                  >
                    Make sure to check the following: The code should be readable and understandable. Add comments to your code. Before showing the code to the interviewer, dry run it with a few examples.
                  </Text>
                  
                  {/* Bottom accent line */}
                  <Box w="full" h="1px" bg="whiteAlpha.200" opacity={0.6} />
                </VStack>
                </Box>
              </Box>
              </MotionBox>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Box
        id="faq"
        py={32}
        pb={32}
        position="relative"
          overflow="hidden"
        bg="#000000"
        borderTop="1px solid"
        borderColor="whiteAlpha.100"
        >
        {/* Floating Gradient Circles */}
        <MotionBox
          position="absolute"
          top="10%"
          left="5%"
          w="300px"
          h="300px"
          borderRadius="full"
          bg="linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(236, 72, 153, 0.1) 100%)"
          filter="blur(60px)"
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <MotionBox
          position="absolute"
          top="50%"
          right="5%"
          w="400px"
          h="400px"
          borderRadius="full"
          bg="linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(147, 51, 234, 0.08) 100%)"
          filter="blur(70px)"
          animate={{
            y: [0, 40, 0],
            x: [0, -25, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        <MotionBox
          position="absolute"
          bottom="15%"
          left="15%"
          w="250px"
          h="250px"
          borderRadius="full"
          bg="linear-gradient(135deg, rgba(251, 191, 36, 0.12) 0%, rgba(245, 158, 11, 0.08) 100%)"
          filter="blur(50px)"
          animate={{
            y: [0, -20, 0],
            x: [0, 15, 0],
            scale: [1, 1.08, 1]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        {/* Small Decorative Dots */}
        <MotionBox
          position="absolute"
          top="20%"
          right="25%"
          w="80px"
          h="80px"
          borderRadius="full"
          bg="rgba(168, 85, 247, 0.2)"
          animate={{
            y: [0, -15, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <MotionBox
          position="absolute"
          bottom="30%"
          right="10%"
          w="60px"
          h="60px"
          borderRadius="full"
          bg="rgba(59, 130, 246, 0.25)"
          animate={{
            y: [0, 20, 0],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        />
        
        <MotionBox
          position="absolute"
          top="60%"
          left="8%"
          w="100px"
          h="100px"
          borderRadius="full"
          bg="rgba(236, 72, 153, 0.18)"
          animate={{
            y: [0, -25, 0],
            opacity: [0.35, 0.65, 0.35]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8
          }}
        />

        <Container maxW="container.xl" position="relative">
          {/* Header */}
            <MotionBox
            textAlign="center"
            mb={16}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <MotionHeading
              fontSize={{ base: '3xl', md: '5xl' }}
              fontWeight="600"
              color="white"
              mb={4}
              letterSpacing="-0.02em"
            >
              Frequently asked
              <br />
              questions.
            </MotionHeading>
            <MotionText
              fontSize="xl"
              color="whiteAlpha.600"
              maxW="700px"
              mx="auto"
              lineHeight="1.6"
            >
              Everything you need to know about Placify.
            </MotionText>
          </MotionBox>

          {/* FAQ Content */}
              <MotionBox
            maxW="6xl"
            mx="auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Box
                bg="whiteAlpha.50"
              borderRadius="2xl"
                p={8}
              border="1px solid"
              borderColor="whiteAlpha.100"
            >
              <Grid templateColumns={{ base: '1fr', lg: '1fr 2fr' }} gap={8}>
                {/* Left Column - Categories */}
                <VStack spacing={3} align="stretch">
                  {[
                    { id: 'general', name: 'General Questions' },
                    { id: 'support', name: 'Support team' },
                    { id: 'misc', name: 'Miscellaneous' },
                    { id: 'preparation', name: 'Preparation' },
                    { id: 'interview', name: 'Interview Tips' }
                  ].map((category, index) => (
                    <MotionBox
                      key={category.id}
                      p={4}
                      borderRadius="xl"
                      bg={activeCategory === category.id ? 'whiteAlpha.100' : 'transparent'}
                      cursor="pointer"
                      whileHover={{ bg: 'whiteAlpha.50' }}
                      transition={{ duration: 0.2 }}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      <Flex align="center" justify="space-between">
                        <Text
                          fontSize="md"
                          fontWeight={activeCategory === category.id ? '500' : '400'}
                          color={activeCategory === category.id ? 'white' : 'whiteAlpha.700'}
                        >
                          {category.name}
                        </Text>
                        <Icon as={FaChevronDown} color={activeCategory === category.id ? 'white' : 'whiteAlpha.500'} fontSize="sm" />
                      </Flex>
                    </MotionBox>
                  ))}
          </VStack>

                {/* Right Column - Questions & Answers */}
                <VStack spacing={4} align="stretch">
                  {(() => {
                    const faqData = {
                      general: [
                        {
                          question: "What is this platform about?",
                          answer: "It's a community-driven space where students share their real placement experiences, interview questions, and preparation tips to help others succeed."
                        },
                        {
                          question: "Who can use this platform?",
                          answer: "All college students preparing for placements, internships, or tech interviews can access and contribute to the platform."
                        },
                        {
                          question: "Is there any cost to use the platform?",
                          answer: "No, it's completely free for students. You just need to create an account to post or interact."
                        },
                        {
                          question: "Can I edit or delete my shared experience later?",
                          answer: "Yes. Once logged in, you can easily edit or remove your posts anytime through your dashboard."
                        },
                        {
                          question: "How are experiences verified?",
                          answer: "We rely on a moderation process and community feedback to maintain accuracy and authenticity."
                        }
                      ],
                      support: [
                        {
                          question: "How can I contact the support team?",
                          answer: "You can reach us via the Contact Us page by submitting a form or emailing our support team directly."
                        },
                        {
                          question: "What should I do if I face a technical issue on the website?",
                          answer: "Try refreshing or clearing your cache first. If the issue persists, report it through the Support page with screenshots."
                        },
                        {
                          question: "How long does it take to get a response from support?",
                          answer: "Our team usually replies within 24–48 hours on working days."
                        },
                        {
                          question: "Can I suggest a new feature for the platform?",
                          answer: "Absolutely! We welcome ideas and feedback — use the \"Feature Request\" form to share your suggestions."
                        },
                        {
                          question: "Is my data safe on this platform?",
                          answer: "Yes. We use encrypted connections and secure storage practices to protect your personal information."
                        }
                      ],
                      misc: [
                        {
                          question: "Can I share experiences from off-campus placements too?",
                          answer: "Yes! Both on-campus and off-campus placement stories are encouraged."
                        },
                        {
                          question: "Do I need coding skills to use this platform?",
                          answer: "Not at all. You can explore, read, and share experiences without writing a single line of code."
                        },
                        {
                          question: "Can I connect with students who posted experiences?",
                          answer: "Currently, you can comment or react to posts, and we're planning a direct messaging feature soon."
                        },
                        {
                          question: "Will my name be visible when I post?",
                          answer: "You can choose to post anonymously if you prefer privacy."
                        },
                        {
                          question: "Can I share preparation resources or links?",
                          answer: "Yes, you can include helpful links, PDFs, or GitHub repos in your experience posts."
                        }
                      ],
                      preparation: [
                        {
                          question: "Which programming language should I use for coding interviews?",
                          answer: "Pick the language you're most comfortable with — common choices include C++, Java, and Python."
                        },
                        {
                          question: "How should I plan my placement preparation timeline?",
                          answer: "Start early, at least 6 months before placements, and focus on coding, aptitude, and core subjects."
                        },
                        {
                          question: "What are the best platforms for placement preparation?",
                          answer: "Some top choices include LeetCode, GeeksforGeeks, InterviewBit, HackerRank, PrepBytes, CodeStudio, CodeChef, Striver's A2Z DSA Sheet, and Coding Ninjas."
                        },
                        {
                          question: "How do I balance academics and placement prep?",
                          answer: "Create a realistic timetable. Focus on consistency over long hours — even 1–2 hours daily is enough with discipline."
                        },
                        {
                          question: "Should I join a placement study group?",
                          answer: "Yes! Studying with peers improves motivation, helps you learn faster, and keeps you updated on company drives."
                        }
                      ],
                      interview: [
                        {
                          question: "How should I prepare for HR interview questions?",
                          answer: "Review common HR topics like strengths, weaknesses, and goals. Be honest and back your answers with examples."
                        },
                        {
                          question: "What should I include in my resume for campus placements?",
                          answer: "Keep it short, clean, and focused on skills, projects, and achievements relevant to the role."
                        },
                        {
                          question: "How do I manage time while preparing for placements and college exams?",
                          answer: "Balance both by creating a structured schedule and sticking to small daily goals."
                        },
                        {
                          question: "How do I handle rejection after a placement interview?",
                          answer: "View rejection as feedback, not failure. Reflect, improve, and keep applying — every interview builds confidence."
                        },
                        {
                          question: "How important are communication skills in placements?",
                          answer: "Very important. They help you present ideas clearly in both HR and technical rounds. Practice mock interviews to build fluency."
                        }
                      ]
                    }

                    const currentQuestions = faqData[activeCategory] || faqData.general

                    return currentQuestions.map((item, index) => (
                      <MotionBox
                        key={index}
                        p={6}
                        borderRadius="xl"
                        bg="transparent"
                        cursor="pointer"
                        whileHover={{ bg: 'whiteAlpha.50' }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setExpandedQuestion(expandedQuestion === index ? -1 : index)}
                      >
                        <Flex align="start" justify="space-between" mb={expandedQuestion === index ? 4 : 0}>
                          <Text
                            fontSize="lg"
                            fontWeight="600"
                            color="white"
                            flex={1}
                          >
                            {item.question}
                  </Text>
                          <Icon 
                            as={FaChevronDown} 
                            color="whiteAlpha.600" 
                            fontSize="sm"
                            transform={expandedQuestion === index ? 'rotate(180deg)' : 'rotate(0deg)'}
                            transition="transform 0.2s ease"
                          />
                        </Flex>
                        {expandedQuestion === index && (
                          <MotionBox
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            overflow="hidden"
                          >
                            <Text fontSize="md" color="whiteAlpha.700" lineHeight="1.7">
                              {item.answer}
                            </Text>
              </MotionBox>
                        )}
            </MotionBox>
                    ))
                  })()}
                </VStack>
              </Grid>
            </Box>
          </MotionBox>
        </Container>
      </Box>

      {/* Footer Section */}
      <Box
        as="footer"
        bg="#000000"
        py={20}
        position="relative"
        overflow="hidden"
      >
        <Container maxW="1400px">
          <VStack spacing={16} align="start">
            {/* Logo and Description */}
            <VStack align="start" spacing={8} w="full">
              <Heading
                size="2xl"
                color="white"
                fontWeight="700"
                letterSpacing="-0.02em"
              >
                Placify
              </Heading>
              <Text color="whiteAlpha.600" fontSize="lg" lineHeight="1.6" maxW="500px">
                Your ultimate placement companion. Learn, prepare, and succeed with real interview insights and guided preparation resources.
              </Text>
            </VStack>

            {/* Contact Information */}
            <VStack align="start" spacing={8} w="full">
              <Heading size="xl" color="white" fontWeight="600" letterSpacing="-0.01em">
                Contact Us
              </Heading>
              
              <VStack align="start" spacing={6} w="full">
                <VStack align="start" spacing={3}>
                  <Text color="whiteAlpha.500" fontSize="sm" fontWeight="500" letterSpacing="0.05em" textTransform="uppercase">
                    Email
                  </Text>
                  <Text color="white" fontSize="lg" fontWeight="400">
                    support@placify.com
                  </Text>
                </VStack>

                <VStack align="start" spacing={4}>
                  <Text color="whiteAlpha.500" fontSize="sm" fontWeight="500" letterSpacing="0.05em" textTransform="uppercase">
                    Phone
                  </Text>
                  <VStack align="start" spacing={3}>
                  <VStack align="start" spacing={1}>
                      <Text color="white" fontSize="lg" fontWeight="500">
                        Anish L S
                    </Text>
                      <Text color="whiteAlpha.600" fontSize="md">
                        9566541288
                    </Text>
                    </VStack>
                    <VStack align="start" spacing={1}>
                      <Text color="white" fontSize="lg" fontWeight="500">
                        Danush S
                    </Text>
                      <Text color="whiteAlpha.600" fontSize="md">
                        9003412202
                    </Text>
                    </VStack>
                  </VStack>
                </VStack>
              </VStack>
            </VStack>

            {/* Quick Links */}
            <VStack align="start" spacing={8} w="full">
              <Heading size="xl" color="white" fontWeight="600" letterSpacing="-0.01em">
                Quick Links
              </Heading>
              
              <HStack spacing={12} wrap="wrap">
                <Button
                as={RouterLink}
                  to="/"
                  variant="link"
                  color="whiteAlpha.600"
                  p={0}
                  h="auto"
                  fontWeight="400"
                  fontSize="lg"
                  _hover={{ color: "white" }}
                  textAlign="left"
                >
                  About Placify
                </Button>
                <Button
                as={RouterLink}
                to="/preparation"
                  variant="link"
                  color="whiteAlpha.600"
                  p={0}
                  h="auto"
                  fontWeight="400"
                  fontSize="lg"
                  _hover={{ color: "white" }}
                  textAlign="left"
                >
                  Preparation Tips
                </Button>
                <Button
                  as={RouterLink}
                  to="/experience"
                  variant="link"
                  color="whiteAlpha.600"
                  p={0}
                  h="auto"
                  fontWeight="400"
                  fontSize="lg"
                  _hover={{ color: "white" }}
                  textAlign="left"
                >
                  Interview Experience
                </Button>
                <Button
                  onClick={() => {
                    const faqSection = document.getElementById('faq')
                    if (faqSection) {
                      faqSection.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                  variant="link"
                  color="whiteAlpha.600"
                  p={0}
                  h="auto"
                  fontWeight="400"
                  fontSize="lg"
                  _hover={{ color: "white" }}
                  textAlign="left"
                >
                  FAQ
                </Button>
              </HStack>
          </VStack>
            </VStack>

          {/* Bottom Section */}
          <Box mt={16} pt={8} borderTop="1px solid" borderColor="whiteAlpha.100">
            <Flex
              direction={{ base: "column", md: "row" }}
              justify="space-between"
              align={{ base: "start", md: "center" }}
              gap={4}
            >
              <Text color="whiteAlpha.500" fontSize="md" fontWeight="400">
                © 2025 Placify. All Rights Reserved.
              </Text>
              
              <HStack spacing={8}>
                <Text color="whiteAlpha.600" fontSize="md" cursor="pointer" _hover={{ color: "white" }} fontWeight="400">
                  Terms of Service
                </Text>
                <Text color="whiteAlpha.600" fontSize="md" cursor="pointer" _hover={{ color: "white" }} fontWeight="400">
                  Privacy Policy
                </Text>
              </HStack>

            </Flex>
          </Box>
        </Container>
      </Box>
      </Box>
    </Flex>
  )
}

export default Home
