import { 
  Box, Container, Heading, Text, VStack, HStack, Icon, Button, Input, Textarea, 
  Flex, useDisclosure, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, 
  DrawerCloseButton, SimpleGrid, useToast, FormControl, FormErrorMessage, FormLabel
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { 
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaBars, FaComments,
  FaUser, FaLinkedin
} from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { submitContact } from '../utils/api'

const MotionBox = motion(Box)
const MotionFlex = motion(Flex)
const MotionHeading = motion(Heading)
const MotionText = motion(Text)

const Contact = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
    website: '' // Honeypot field - hidden from users
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Spam detection function
  const detectSpam = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Spam keywords detection
    const spamKeywords = [
      'viagra', 'casino', 'lottery', 'free money', 'click here', 'buy now',
      'make money', 'work from home', 'investment', 'cryptocurrency', 'bitcoin',
      'loan', 'credit', 'insurance', 'weight loss', 'diet pills', 'seo services',
      'marketing', 'promote', 'advertisement', 'spam', 'scam', 'phishing',
      'get rich', 'earn money', 'online casino', 'gambling', 'poker', 'slots'
    ];
    
    if (spamKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'Message contains suspicious content';
    }
    
    // Check for excessive repetition (like "aaaaaa" or "111111")
    const repeatedChars = /(.)\1{5,}/;
    if (repeatedChars.test(message)) {
      return 'Message contains suspicious patterns';
    }
    
    // Check for random character sequences
    const randomChars = /[a-z]{15,}/i;
    if (randomChars.test(message) && !/\s/.test(message)) {
      return 'Message appears to contain random characters';
    }
    
    // Check for excessive numbers
    const numberCount = (message.match(/\d/g) || []).length;
    if (numberCount > message.length * 0.5) {
      return 'Message contains too many numbers';
    }
    
    // Check for minimum meaningful content
    const words = message.trim().split(/\s+/);
    if (words.length < 5) {
      return 'Message must contain at least 5 words';
    }
    
    return null;
  };

  // Validation functions
  const validateField = (name, value) => {
    let error = ''
    
    switch (name) {
      case 'firstName':
        if (!value.trim()) {
          error = 'First name is required'
        } else if (value.trim().length < 2) {
          error = 'First name must be at least 2 characters'
        } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          error = 'First name can only contain letters and spaces'
        }
        break
      case 'lastName':
        if (!value.trim()) {
          error = 'Last name is required'
        } else if (value.trim().length < 2) {
          error = 'Last name must be at least 2 characters'
        } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          error = 'Last name can only contain letters and spaces'
        }
        break
      case 'email':
        if (!value.trim()) {
          error = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          error = 'Please enter a valid email address'
        }
        break
      case 'subject':
        if (!value.trim()) {
          error = 'Subject is required'
        } else if (value.trim().length < 5) {
          error = 'Subject must be at least 5 characters'
        }
        break
      case 'message':
        if (!value.trim()) {
          error = 'Message is required'
        } else if (value.trim().length < 10) {
          error = 'Message must be at least 10 characters'
        } else if (value.trim().length > 1000) {
          error = 'Message must be less than 1000 characters'
        } else {
          // Check for spam content
          const spamError = detectSpam(value.trim());
          if (spamError) {
            error = spamError;
          }
        }
        break
      default:
        break
    }
    
    return error
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    let isValid = true

    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key])
      if (error) {
        newErrors[key] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Check honeypot field first
    if (formData.website) {
      toast({
        title: "Submission blocked",
        description: "Bot detected.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    if (!validateForm()) {
      toast({
        title: "Please fix the errors below",
        description: "All fields are required and must meet the validation criteria.",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      // Prepare data for backend (combine first and last name)
      const contactData = {
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email: formData.email.trim(),
        message: `Subject: ${formData.subject.trim()}\n\n${formData.message.trim()}`
      }
      
      await submitContact(contactData)
      
    toast({
        title: "Message sent successfully!",
      description: "We'll get back to you soon.",
      status: "success",
      duration: 3000,
      isClosable: true,
    })
      
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      subject: '',
        message: '',
        website: ''
      })
      setErrors({})
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: error.response?.data?.message || "Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
    }
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
              color="white"
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
                color="white"
                fontWeight="500"
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
      <Box pt={20}>
        
        {/* Hero Section  */}
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
              Get in touch.
              </Heading>
            
            <Text
              fontSize={{ base: 'xl', md: '2xl' }} 
              color="whiteAlpha.700" 
              maxW="800px" 
              mx="auto" 
              fontWeight="400"
              lineHeight="1.5"
            >
              Have questions or need help? We're here to assist you 
              with your placement journey.
            </Text>
          </MotionBox>
        </Box>

        <Container maxW="1400px" px={6} pb={32}>
          
          {/* Team Section */}
          <MotionBox
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            mb={16}
          >
            <VStack spacing={8} mb={16}>
              <VStack spacing={4} textAlign="center">
                <Heading
                  fontSize={{ base: '3xl', md: '4xl' }}
                  fontWeight="600"
                  color="white"
                  letterSpacing="-0.02em"
                >
                  Meet Our Team
                </Heading>
                <Text fontSize="xl" color="whiteAlpha.600" fontWeight="400" maxW="600px">
                  Get in touch with our team members for any questions or support.
                </Text>
              </VStack>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full" maxW="800px">
                {/* Anish L S */}
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                p={8}
                bg="whiteAlpha.50"
                borderRadius="2xl"
                border="1px solid"
                borderColor="whiteAlpha.100"
                textAlign="center"
                _hover={{ 
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 30px rgba(255, 255, 255, 0.1)",
                  transition: "all 0.3s"
                }}
              >
                <VStack spacing={6}>
                  <Box
                    w={16}
                    h={16}
                    bg="blue.500"
                    borderRadius="xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    boxShadow="0 4px 20px rgba(59, 130, 246, 0.3)"
                  >
                      <Icon as={FaUser} color="white" fontSize="2xl" />
                  </Box>
                  
                  <VStack spacing={3}>
                    <Text fontSize="xl" fontWeight="600" color="white">
                        Anish L S
                    </Text>
                    <Text color="whiteAlpha.700" fontSize="md" lineHeight="1.6">
                        Team Member
                    </Text>
                      <Text color="blue.400" fontSize="md" fontWeight="500">
                        anish2210828@ssn.edu.in
                      </Text>
                      <Button
                        as="a"
                        href="https://www.linkedin.com/in/anishls/"
                        target="_blank"
                        rel="noopener noreferrer"
                        leftIcon={<Icon as={FaLinkedin} />}
                        bg="blue.600"
                        color="white"
                        _hover={{ 
                          bg: "blue.700",
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)"
                        }}
                        size="sm"
                        borderRadius="xl"
                      >
                        LinkedIn Profile
                      </Button>
                    </VStack>
                </VStack>
              </MotionBox>

                {/* Danush S */}
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                p={8}
                bg="whiteAlpha.50"
                borderRadius="2xl"
                border="1px solid"
                borderColor="whiteAlpha.100"
                textAlign="center"
                _hover={{ 
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 30px rgba(255, 255, 255, 0.1)",
                  transition: "all 0.3s"
                }}
              >
                <VStack spacing={6}>
                  <Box
                    w={16}
                    h={16}
                    bg="green.500"
                    borderRadius="xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    boxShadow="0 4px 20px rgba(34, 197, 94, 0.3)"
                  >
                      <Icon as={FaUser} color="white" fontSize="2xl" />
                  </Box>
                  
                  <VStack spacing={3}>
                    <Text fontSize="xl" fontWeight="600" color="white">
                        Danush S
                    </Text>
                    <Text color="whiteAlpha.700" fontSize="md" lineHeight="1.6">
                        Team Member
                    </Text>
                      <Text color="green.400" fontSize="md" fontWeight="500">
                        danush2210689@ssn.edu.in
                      </Text>
                      <Button
                        as="a"
                        href="https://www.linkedin.com/in/DanushSenthilkumar/"
                        target="_blank"
                        rel="noopener noreferrer"
                        leftIcon={<Icon as={FaLinkedin} />}
                        bg="green.600"
                        color="white"
                _hover={{ 
                          bg: "green.700",
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 15px rgba(34, 197, 94, 0.4)"
                        }}
                        size="sm"
                    borderRadius="xl"
                      >
                        LinkedIn Profile
                      </Button>
                    </VStack>
                </VStack>
              </MotionBox>
            </SimpleGrid>
            </VStack>
          </MotionBox>

          {/* Contact Form Section */}
          <MotionBox
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <VStack spacing={12} w="full">
              <VStack spacing={6} textAlign="center">
                <Heading
                  fontSize={{ base: '3xl', md: '5xl' }}
                  fontWeight="600"
                  color="white"
                  letterSpacing="-0.02em"
                >
                  Send us a message.
                </Heading>
                <Text fontSize="xl" color="whiteAlpha.600" fontWeight="400" maxW="600px">
                  Fill out the form below and we'll get back to you as soon as possible.
                </Text>
              </VStack>

              <Box
                w="full"
                maxW="800px"
                p={12}
                bg="whiteAlpha.50"
                borderRadius="2xl"
                border="1px solid"
                borderColor="whiteAlpha.100"
                boxShadow="0 8px 30px rgba(255, 255, 255, 0.1)"
              >
                <form onSubmit={handleSubmit}>
                  <VStack spacing={8}>
                    {/* Name Fields */}
                    <HStack spacing={6} w="full" flexDirection={{ base: 'column', sm: 'row' }}>
                      <FormControl isInvalid={errors.firstName} w="full">
                        <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
                          First Name *
                        </FormLabel>
                    <Input
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="Enter your first name"
                          bg="whiteAlpha.100"
                      border="1px solid"
                          borderColor={errors.firstName ? "red.400" : "whiteAlpha.200"}
                          color="white"
                          _placeholder={{ color: "whiteAlpha.500" }}
                      _focus={{
                            borderColor: errors.firstName ? "red.400" : "blue.400",
                            boxShadow: errors.firstName 
                              ? "0 0 0 1px rgba(248, 113, 113, 0.3)" 
                              : "0 0 0 1px rgba(59, 130, 246, 0.3)"
                      }}
                          h={12}
                    />
                        <FormErrorMessage color="red.300" fontSize="sm">
                          {errors.firstName}
                        </FormErrorMessage>
                      </FormControl>
                      
                      <FormControl isInvalid={errors.lastName} w="full">
                        <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
                          Last Name *
                        </FormLabel>
                    <Input
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Enter your last name"
                          bg="whiteAlpha.100"
                      border="1px solid"
                          borderColor={errors.lastName ? "red.400" : "whiteAlpha.200"}
                          color="white"
                          _placeholder={{ color: "whiteAlpha.500" }}
                      _focus={{
                            borderColor: errors.lastName ? "red.400" : "blue.400",
                            boxShadow: errors.lastName 
                              ? "0 0 0 1px rgba(248, 113, 113, 0.3)" 
                              : "0 0 0 1px rgba(59, 130, 246, 0.3)"
                      }}
                          h={12}
                    />
                        <FormErrorMessage color="red.300" fontSize="sm">
                          {errors.lastName}
                        </FormErrorMessage>
                      </FormControl>
                  </HStack>

                    {/* Email Field */}
                    <FormControl isInvalid={errors.email} w="full">
                      <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
                        Email Address *
                      </FormLabel>
                  <Input
                        name="email"
                    type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        bg="whiteAlpha.100"
                    border="1px solid"
                        borderColor={errors.email ? "red.400" : "whiteAlpha.200"}
                        color="white"
                        _placeholder={{ color: "whiteAlpha.500" }}
                    _focus={{
                          borderColor: errors.email ? "red.400" : "blue.400",
                          boxShadow: errors.email 
                            ? "0 0 0 1px rgba(248, 113, 113, 0.3)" 
                            : "0 0 0 1px rgba(59, 130, 246, 0.3)"
                    }}
                        h={12}
                  />
                      <FormErrorMessage color="red.300" fontSize="sm">
                        {errors.email}
                      </FormErrorMessage>
                    </FormControl>

                    {/* Subject Field */}
                    <FormControl isInvalid={errors.subject} w="full">
                      <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
                        Subject *
                      </FormLabel>
                  <Input
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="What's this about?"
                        bg="whiteAlpha.100"
                    border="1px solid"
                        borderColor={errors.subject ? "red.400" : "whiteAlpha.200"}
                        color="white"
                        _placeholder={{ color: "whiteAlpha.500" }}
                    _focus={{
                          borderColor: errors.subject ? "red.400" : "blue.400",
                          boxShadow: errors.subject 
                            ? "0 0 0 1px rgba(248, 113, 113, 0.3)" 
                            : "0 0 0 1px rgba(59, 130, 246, 0.3)"
                    }}
                        h={12}
                  />
                      <FormErrorMessage color="red.300" fontSize="sm">
                        {errors.subject}
                      </FormErrorMessage>
                    </FormControl>

                    {/* Message Field */}
                    <FormControl isInvalid={errors.message} w="full">
                      <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
                        Message *
                      </FormLabel>
                  <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us how we can help you..."
                        bg="whiteAlpha.100"
                    border="1px solid"
                        borderColor={errors.message ? "red.400" : "whiteAlpha.200"}
                        color="white"
                        _placeholder={{ color: "whiteAlpha.500" }}
                    _focus={{
                          borderColor: errors.message ? "red.400" : "blue.400",
                          boxShadow: errors.message 
                            ? "0 0 0 1px rgba(248, 113, 113, 0.3)" 
                            : "0 0 0 1px rgba(59, 130, 246, 0.3)"
                    }}
                        rows={6}
                        resize="vertical"
                  />
                      <FormErrorMessage color="red.300" fontSize="sm">
                        {errors.message}
                      </FormErrorMessage>
                      <Text color="whiteAlpha.500" fontSize="xs" mt={1}>
                        {formData.message.length}/1000 characters
                      </Text>
                    </FormControl>

                    {/* Honeypot Field - Hidden from users */}
                    <Input
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      style={{ 
                        display: 'none',
                        position: 'absolute',
                        left: '-9999px',
                        opacity: 0,
                        pointerEvents: 'none'
                      }}
                      tabIndex="-1"
                      autoComplete="off"
                    />

                    {/* Submit Button */}
                  <Button
                      type="submit"
                      bg="blue.500"
                    color="white"
                      isLoading={isSubmitting}
                      loadingText="Sending..."
                      _hover={{ 
                        bg: "blue.600",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)"
                      }}
                      _active={{ bg: "blue.700" }}
                    size="lg"
                      h={14}
                      px={12}
                      fontSize="md"
                      fontWeight="600"
                      borderRadius="xl"
                    leftIcon={<Icon as={FaPaperPlane} />}
                      transition="all 0.3s"
                      disabled={isSubmitting}
                  >
                    Send Message
                  </Button>
                </VStack>
                </form>
          </Box>
          </VStack>
          </MotionBox>

        </Container>

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

export default Contact