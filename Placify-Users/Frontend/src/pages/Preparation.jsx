import { 
  Box, Container, Heading, Text, SimpleGrid, Flex, Button, HStack, Icon, 
  useDisclosure, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, 
  DrawerCloseButton, VStack, Modal, ModalOverlay, ModalContent, ModalHeader, 
  ModalBody, ModalCloseButton, useDisclosure as useModalDisclosure
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { 
  FaComments, FaBars, FaFileAlt, FaCode, FaBrain, FaCalculator, FaBuilding, 
  FaUserTie, FaCheckCircle, FaLaptopCode, FaBook, FaArrowRight, FaDatabase, 
  FaServer, FaCube, FaNetworkWired, FaUsers, FaLightbulb, FaChevronRight,
  FaGithub, FaLinkedin, FaTrophy, FaBookOpen, FaChartLine, FaPlus, FaTimes
} from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useState } from 'react'

const MotionBox = motion(Box)
const MotionFlex = motion(Flex)
const MotionHeading = motion(Heading)
const MotionText = motion(Text)

const Preparation = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useModalDisclosure()
  const [selectedCard, setSelectedCard] = useState(null)

  // Detailed preparation cards data
  const preparationCards = [
    {
      icon: FaFileAlt,
      title: "Resume Building",
      color: "purple",
      stats: "1 Page Max",
      description: "Create a compelling resume that showcases your skills and achievements effectively.",
      modalContent: {
        title: "Resume Building",
        approach: {
          title: "Our approach.",
          description: "A resume is your first impression. Keep it concise, relevant, and honest. Focus on quantifying your achievements and showcasing real impact.",
          links: [
            "Learn more in our Resume Building Guide (PDF)",
            "Explore Striver's Resume Tips"
          ]
        },
        improvement: {
          title: "How you can improve.",
          description: "Use strong action verbs like Developed, Implemented, and Optimized. Always be ready to explain every line of your resume during interviews.",
          links: [
            "Learn more about ATS-Friendly Resume Formats"
          ]
        }
      }
    },
    {
      icon: FaCode,
      title: "Coding & DSA Preparation",
      color: "blue",
      stats: "2-3 Daily",
      description: "Master data structures and algorithms through consistent practice.",
      modalContent: {
        title: "Coding & DSA Preparation",
        approach: {
          title: "Our approach.",
          description: "Companies value logical thinking and problem-solving ability. Mastering data structures and algorithms is key to clearing technical rounds.",
          links: [
            "Learn more in Striver's A2Z DSA Sheet",
            "Practice problems on LeetCode",
            "InterviewBit",
            "and GeeksforGeeks"
          ]
        },
        improvement: {
          title: "How you can improve.",
          description: "Start small: arrays → recursion → linked lists → graphs → dynamic programming. Set daily goals, maintain a GitHub repository for your solutions, and track your progress.",
          links: [
            "Learn more about Building a DSA Roadmap"
          ]
        }
      }
    },
    {
      icon: FaBrain,
      title: "Core CS Subjects",
      color: "green",
      stats: "4 Key Areas",
      description: "Strengthen your theoretical foundation in computer science fundamentals.",
      modalContent: {
        title: "Core CS Subjects",
        approach: {
          title: "Our approach.",
          description: "Understanding computer science fundamentals helps you stand out in interviews. These subjects test your depth of knowledge, not just memory.",
          links: [
            "Learn more about:",
            "Operating Systems – GFG Notes",
            "DBMS – Tutorials & Practice",
            "OOPs – Core Concepts",
            "Computer Networks – Interview Questions"
          ]
        },
        improvement: {
          title: "How you can improve.",
          description: "Relate what you learn to your projects — for example, explain how DBMS concepts shaped your backend or how OOP principles improved your code structure.",
          links: [
            "Learn more from Neso Academy YouTube"
          ]
        }
      }
    },
    {
      icon: FaCalculator,
      title: "Aptitude & Logical Reasoning",
      color: "orange",
      stats: "10 Daily",
      description: "Sharpen your logical and quantitative reasoning skills.",
      modalContent: {
        title: "Aptitude & Logical Reasoning",
        approach: {
          title: "Our approach.",
          description: "Most placement tests begin with aptitude. Speed, accuracy, and clear logic will give you the edge.",
          links: [
            "Learn more in Quantitative Aptitude by R.S. Aggarwal",
            "Practice daily on IndiaBix",
            "or PrepInsta Aptitude"
          ]
        },
        improvement: {
          title: "How you can improve.",
          description: "Set a 20-minute timer while practicing. Track your accuracy and review mistakes weekly.",
          links: [
            "Learn more about Common Aptitude Topics"
          ]
        }
      }
    },
    {
      icon: FaBuilding,
      title: "Company-Specific Preparation",
      color: "red",
      stats: "Target Specific",
      description: "Study smart by focusing on company-specific preparation.",
      modalContent: {
        title: "Company-Specific Preparation",
        approach: {
          title: "Our approach.",
          description: "Each company follows its own interview style and difficulty level. Preparing smartly for each saves time and improves confidence.",
          links: [
            "Learn more in GeeksforGeeks Company-Wise Questions",
            "Explore Interview Experiences",
            "Find Company-Wise Sheets by Striver"
          ]
        },
        improvement: {
          title: "How you can improve.",
          description: "Research the company's tech stack and previous questions before the interview. Understand the role — whether it's SDE, Analyst, or Data Engineer — and tailor your preparation accordingly.",
          links: []
        }
      }
    },
    {
      icon: FaUserTie,
      title: "Interview Preparation",
      color: "teal",
      stats: "Be Ready",
      description: "Present your preparation confidently in technical and HR rounds.",
      modalContent: {
        title: "Interview Preparation",
        approach: {
          title: "Our approach.",
          description: "Your technical and HR interviews test your clarity, communication, and composure. Being confident and genuine often matters more than being perfect.",
          links: [
            "Learn more in Top Interview Questions – GFG",
            "Practice HR rounds with InterviewBit Resources"
          ]
        },
        improvement: {
          title: "How you can improve.",
          description: "Revise your projects and technical concepts. Practice coding on whiteboards or online compilers. For HR rounds, speak naturally — not rehearsed.",
          links: [
            "Learn more about Mock Interview Preparation"
          ]
        }
      }
    }
  ]

  const handleCardClick = (card) => {
    setSelectedCard(card)
    onModalOpen()
  }

  return (
    <Box minH="100vh" bg="#000000" position="relative" overflow="hidden">
      {/* Integrated Navbar - Apple Style */}
      <Box 
        position="fixed" 
        top={0} 
        left={0} 
        right={0} 
        zIndex={1000}
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
              color="whiteAlpha.800"
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
              color="white"
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
                color="whiteAlpha.800"
                _hover={{ color: 'white' }}
                fontWeight="400"
                justifyContent="flex-start"
                onClick={onClose}
              >
                Home
              </Button>
              <Button
                as={RouterLink}
                to="/preparation"
                variant="ghost"
                color="white"
                fontWeight="500"
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
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Content */}
      <Box pt={12}>
        
        {/* Hero Section - Apple Style */}
        <Box textAlign="center" py={{ base: 20, md: 32 }} px={6} minH="100vh" display="flex" alignItems="center" justifyContent="center">
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Heading
              fontSize={{ base: '4xl', md: '6xl', lg: '8xl' }}
              fontWeight="600"
              color="white"
              mb={6}
              lineHeight="1.05"
              letterSpacing="-0.02em"
            >
              Placement Preparation
              <br />
              Guide
            </Heading>
            
            <Text 
              fontSize={{ base: 'xl', md: '2xl' }} 
              color="whiteAlpha.700" 
              maxW="800px" 
              mx="auto" 
              fontWeight="400"
              lineHeight="1.5"
            >
              Your one-stop guide to prepare effectively for campus placements — 
              from resume building to cracking your final interview.
            </Text>
          </MotionBox>
        </Box>

        <Container maxW="1400px" px={6} pb={4}>
          
          {/* Preparation Cards Section */}
          <MotionBox
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            mb={8}
          >
            <VStack align="start" spacing={12} w="full">
              <VStack align="start" spacing={6} w="full">
                <Heading
                  fontSize={{ base: '3xl', md: '5xl' }}
                  fontWeight="600"
                  color="white"
                  letterSpacing="-0.02em"
                  textAlign="center"
                  w="full"
                >
                  Your preparation journey.
                </Heading>
                <Text fontSize="xl" color="whiteAlpha.600" fontWeight="400" textAlign="center" w="full">
                  Everything you need to prepare effectively for campus placements.
                </Text>
              </VStack>

              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
                {preparationCards.map((card, index) => (
                  <MotionBox
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    p={8}
                    bg="whiteAlpha.50"
                    borderRadius="2xl"
                    border="1px solid"
                    borderColor="whiteAlpha.100"
                    position="relative"
                    _hover={{ 
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 30px rgba(255, 255, 255, 0.1)",
                      transition: "all 0.3s"
                    }}
                    cursor="pointer"
                    onClick={() => handleCardClick(card)}
                  >
                    <VStack align="start" spacing={6}>
                      <HStack spacing={4} w="full" justify="space-between">
                        <Icon 
                          as={card.icon} 
                          color={`${card.color}.400`} 
                          fontSize="2xl" 
                        />
                        <Button
                          size="sm"
                          bg="black"
                          color="white"
                          borderRadius="full"
                          w={8}
                          h={8}
                          minW={8}
                          p={0}
                          _hover={{ bg: "gray.800" }}
                        >
                          <Icon as={FaPlus} fontSize="sm" />
                        </Button>
                      </HStack>
                      
                      <VStack align="start" spacing={3}>
                        <Text fontSize="2xl" fontWeight="600" color="white">
                          {card.title}
                        </Text>
                        <Text fontSize="lg" color={`${card.color}.400`} fontWeight="600">
                          {card.stats}
                        </Text>
                        <Text color="whiteAlpha.700" fontSize="md" lineHeight="1.6">
                          {card.description}
                        </Text>
                      </VStack>
                    </VStack>
                  </MotionBox>
                ))}
              </SimpleGrid>
            </VStack>
          </MotionBox>



        </Container>

        {/* Inspirational Quote Section */}
        <MotionBox
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          textAlign="center"
          py={10}
          px={6}
        >
          <Text
            fontSize={{ base: '2xl', md: '4xl' }}
            color="whiteAlpha.900"
            fontWeight="500"
            fontStyle="italic"
            maxW="800px"
            mx="auto"
            lineHeight="1.5"
            letterSpacing="-0.01em"
          >
            "Every interview is not a test,
            <br />
            it's a step toward the right opportunity."
          </Text>
        </MotionBox>

        {/* Detailed Preparation Modal */}
        <Modal isOpen={isModalOpen} onClose={onModalClose} size="4xl" isCentered>
          <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
          <ModalContent 
            bg="white" 
            borderRadius="2xl" 
            maxW="800px" 
            mx={4}
            boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
          >
            <ModalHeader 
              fontSize="3xl" 
              fontWeight="600" 
              color="black" 
              letterSpacing="-0.02em"
              pb={6}
            >
              {selectedCard?.modalContent?.title || "Preparation Guide"}
            </ModalHeader>
            <ModalCloseButton 
              color="black" 
              size="lg" 
              _hover={{ bg: "gray.100" }}
            />
            <ModalBody pb={8}>
              {selectedCard?.modalContent && (
                <VStack align="start" spacing={8}>
                  {/* Our approach section */}
                  <Box w="full">
                    <Text fontSize="xl" fontWeight="600" color="black" mb={4}>
                      {selectedCard.modalContent.approach.title}
                    </Text>
                    <Text color="gray.700" fontSize="md" lineHeight="1.6" mb={4}>
                      {selectedCard.modalContent.approach.description}
                    </Text>
                    <VStack align="start" spacing={2}>
                      {selectedCard.modalContent.approach.links.map((link, index) => (
                        <Text 
                          key={index} 
                          color="blue.500" 
                          fontSize="md" 
                          cursor="pointer"
                          _hover={{ textDecoration: "underline" }}
                        >
                          {link}
                        </Text>
                      ))}
                    </VStack>
                  </Box>

                  {/* How you can improve section */}
                  <Box w="full">
                    <Text fontSize="xl" fontWeight="600" color="black" mb={4}>
                      {selectedCard.modalContent.improvement.title}
                    </Text>
                    <Text color="gray.700" fontSize="md" lineHeight="1.6" mb={4}>
                      {selectedCard.modalContent.improvement.description}
                    </Text>
                    {selectedCard.modalContent.improvement.links.length > 0 && (
                      <VStack align="start" spacing={2}>
                        {selectedCard.modalContent.improvement.links.map((link, index) => (
                          <Text 
                            key={index} 
                            color="blue.500" 
                            fontSize="md" 
                            cursor="pointer"
                            _hover={{ textDecoration: "underline" }}
                          >
                            {link}
                          </Text>
                        ))}
                      </VStack>
                    )}
                  </Box>
                </VStack>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Footer */}
        <Box borderTop="1px solid" borderColor="whiteAlpha.100" py={12}>
          <Container maxW="1400px">
            <Text textAlign="center" color="whiteAlpha.500" fontSize="sm">
              © 2025 Placify. All rights reserved.
            </Text>
          </Container>
        </Box>

      </Box>
    </Box>
  )
}

export default Preparation