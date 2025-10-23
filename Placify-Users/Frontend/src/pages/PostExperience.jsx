import { useState, useRef } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
  Flex,
  HStack,
  Icon,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Select,
  Checkbox,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FaComments, FaBars, FaPaperPlane, FaPlus } from 'react-icons/fa'
import { motion } from 'framer-motion'
import ReCAPTCHA from 'react-google-recaptcha'

const MotionBox = motion(Box)
import { addExperience } from '../utils/api'
import { useNavigate } from 'react-router-dom'

const PostExperience = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [formData, setFormData] = useState({
    // Personal & Academic Details
    fullName: '',
    email: '',
    collegeName: '',
    branch: '',
    batchYear: '',
    linkedinUrl: '',
    isAnonymous: false,
    
    // Company & Role Details
    companyName: '',
    jobRole: '',
    positionType: '',
    interviewType: '',
    jobLocation: '',
    ctc: '',
    
    // Selection Process Details
    numberOfRounds: '',
    roundTypes: [],
    difficultyLevel: '',
    overallExperience: '',
    
    // Detailed Round Descriptions (dynamic)
    rounds: [{ name: '', description: '' }],
    
    // Technical & HR Questions
    codingQuestions: '',
    technicalQuestions: '',
    hrQuestions: '',
    
    // Preparation Tips
    resourcesUsed: '',
    tipsForCandidates: '',
    mistakesToAvoid: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 6
  const toast = useToast()
  const navigate = useNavigate()
  const recaptchaRef = useRef(null)
  const [recaptchaToken, setRecaptchaToken] = useState('')
  const [recaptchaError, setRecaptchaError] = useState(false)

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateLinkedInUrl = (url) => {
    const linkedinRegex = /^https:\/\/www\.linkedin\.com\/.*$/
    return linkedinRegex.test(url)
  }

  const validateCTC = (ctc) => {
    const ctcRegex = /^\d+(\.\d+)?\s*LPA$/i
    return ctcRegex.test(ctc)
  }

  const sanitizeInput = (input) => {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/onclick\s*=/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/alert\s*\(/gi, '')
      .trim()
  }

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        return validateEmail(value) || value === ''
      case 'linkedinUrl':
        return validateLinkedInUrl(value) || value === '' || formData.isAnonymous
      case 'ctc':
        return validateCTC(value) || value === ''
      case 'overallExperience':
        return value.length >= 50 && value.length <= 2000
      case 'fullName':
        return value.length >= 2 && value.length <= 100
      case 'companyName':
        return value.length >= 2 && value.length <= 100
      case 'jobRole':
        return value.length >= 2 && value.length <= 100
      default:
        return true
    }
  }

  // reCAPTCHA callback functions
  const onRecaptchaChange = (token) => {
    setRecaptchaToken(token)
    setRecaptchaError(false)
  }

  const onRecaptchaExpired = () => {
    setRecaptchaToken('')
    setRecaptchaError(false)
    toast({
      title: 'reCAPTCHA Expired',
      description: 'Please complete the reCAPTCHA verification again.',
      status: 'warning',
      duration: 3000,
      isClosable: true,
    })
  }

  const onRecaptchaError = () => {
    console.log('reCAPTCHA error occurred')
    setRecaptchaToken('')
    setRecaptchaError(true)
    toast({
      title: 'reCAPTCHA Error',
      description: 'reCAPTCHA failed to load. Please refresh the page or try disabling browser extensions.',
      status: 'error',
      duration: 5000,
      isClosable: true,
    })
  }

  const resetRecaptcha = () => {
    if (recaptchaRef.current) {
      recaptchaRef.current.reset()
      setRecaptchaToken('')
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (type === 'checkbox') {
      if (name === 'isAnonymous') {
    setFormData({
      ...formData,
          [name]: checked,
          // Clear LinkedIn URL if becoming anonymous
          linkedinUrl: checked ? '' : formData.linkedinUrl
        })
      } else {
        // Handle round types checkboxes
        setFormData({
          ...formData,
          roundTypes: checked 
            ? [...formData.roundTypes, value]
            : formData.roundTypes.filter(item => item !== value)
        })
      }
    } else {
      // Sanitize input for text fields
      const sanitizedValue = type === 'email' || type === 'url' ? value : sanitizeInput(value)
      
      setFormData({
        ...formData,
        [name]: sanitizedValue
      })
    }
  }

  const addRound = () => {
    setFormData({
      ...formData,
      rounds: [...formData.rounds, { name: '', description: '' }]
    })
  }

  const removeRound = (index) => {
    setFormData({
      ...formData,
      rounds: formData.rounds.filter((_, i) => i !== index)
    })
  }

  const updateRound = (index, field, value) => {
    const updatedRounds = [...formData.rounds]
    updatedRounds[index][field] = value
    setFormData({
      ...formData,
      rounds: updatedRounds
    })
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (step) => {
    setCurrentStep(step)
  }

  const validateForm = () => {
    const requiredFields = ['companyName', 'jobRole', 'numberOfRounds', 'overallExperience']
    
    // Add LinkedIn URL to required fields only if not anonymous
    if (!formData.isAnonymous) {
      requiredFields.push('linkedinUrl')
    }
    
    // Check for missing required fields
    const missing = requiredFields.filter(field => !formData[field])
    
    if (missing.length > 0) {
      const missingFields = missing.join(', ')
      toast({
        title: 'Please fill required fields',
        description: `The following fields are required: ${missingFields}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return false
    }

    // Validate field formats
    const validationErrors = []
    
    if (formData.email && !validateEmail(formData.email)) {
      validationErrors.push('Please enter a valid email address')
    }
    
    if (formData.linkedinUrl && !formData.isAnonymous && !validateLinkedInUrl(formData.linkedinUrl)) {
      validationErrors.push('LinkedIn URL must start with https://www.linkedin.com/')
    }
    
    if (formData.ctc && !validateCTC(formData.ctc)) {
      validationErrors.push('CTC must be in format like "6 LPA" or "6.5 LPA"')
    }
    
    if (formData.overallExperience.length < 50) {
      validationErrors.push('Overall experience must be at least 50 characters long')
    }
    
    if (formData.overallExperience.length > 2000) {
      validationErrors.push('Overall experience must be less than 2000 characters')
    }
    
    if (formData.fullName && formData.fullName.length < 2) {
      validationErrors.push('Full name must be at least 2 characters long')
    }
    
    if (formData.companyName.length < 2) {
      validationErrors.push('Company name must be at least 2 characters long')
    }
    
    if (formData.jobRole.length < 2) {
      validationErrors.push('Job role must be at least 2 characters long')
    }

    // reCAPTCHA validation (skip in development mode)
    const isDevelopment = import.meta.env.DEV
    if (!recaptchaToken && !recaptchaError && !isDevelopment) {
      validationErrors.push('Please complete the reCAPTCHA verification')
    }

    if (validationErrors.length > 0) {
      toast({
        title: 'Validation Error',
        description: validationErrors[0],
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return false
    }
    
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)

    try {
      // Send structured data to API
      const experienceData = {
        // Personal & Academic Details
        fullName: formData.fullName,
        email: formData.email,
        collegeName: formData.collegeName,
        branch: formData.branch,
        batchYear: formData.batchYear,
        linkedinUrl: formData.linkedinUrl,
        isAnonymous: formData.isAnonymous,
        
        // Security
        recaptchaToken: recaptchaToken,
        
        // Company & Role Details
        companyName: formData.companyName,
        jobRole: formData.jobRole,
        positionType: formData.positionType,
        interviewType: formData.interviewType,
        jobLocation: formData.jobLocation,
        ctc: formData.ctc,
        
        // Selection Process Details
        numberOfRounds: formData.numberOfRounds,
        roundTypes: formData.roundTypes,
        difficultyLevel: formData.difficultyLevel,
        overallExperience: formData.overallExperience,
        
        // Detailed Round Descriptions
        rounds: formData.rounds,
        
        // Technical & HR Questions
        codingQuestions: formData.codingQuestions,
        technicalQuestions: formData.technicalQuestions,
        hrQuestions: formData.hrQuestions,
        
        // Preparation Tips
        resourcesUsed: formData.resourcesUsed,
        tipsForCandidates: formData.tipsForCandidates,
        mistakesToAvoid: formData.mistakesToAvoid
      }
      
      await addExperience(experienceData)
      toast({
        title: 'Experience shared successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      navigate('/experience')
    } catch (error) {
      toast({
        title: 'Error sharing experience',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      // Reset reCAPTCHA on error
      resetRecaptcha()
    } finally {
      setIsSubmitting(false)
    }
  }

  const bg = 'white'
  const textColor = 'gray.900'
  const borderColor = 'gray.200'

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
              color="white"
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
                color="white"
                fontWeight="500"
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
              Share Your Experience
            </Heading>
            
            <Text 
              fontSize={{ base: 'xl', md: '2xl' }} 
              color="whiteAlpha.700" 
              maxW="800px" 
              mx="auto" 
              fontWeight="400"
              lineHeight="1.5"
            >
              Help fellow students by sharing your placement journey and interview experience.
            </Text>
          </MotionBox>
        </Box>

        <Container maxW="1400px" px={6} pb={32}>
          <MotionBox
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Box
              w="full"
              maxW="800px"
              mx="auto"
              p={12}
              bg="whiteAlpha.50"
              borderRadius="2xl"
              border="1px solid"
              borderColor="whiteAlpha.100"
              boxShadow="0 8px 30px rgba(255, 255, 255, 0.1)"
            >
              <VStack spacing={8} align="center">
                <VStack spacing={4} align="center" w="full">
                  <Heading
                    fontSize={{ base: '2xl', md: '3xl' }}
                    fontWeight="600"
                    color="white"
                    letterSpacing="-0.02em"
                  >
                    Tell your story
                  </Heading>
                  <Text fontSize="lg" color="whiteAlpha.600" fontWeight="400">
                    Share details about your placement experience to help others succeed.
                  </Text>
                </VStack>
                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                  <VStack spacing={8} align="start" w="full">
                    
                    {/* Progress Steps */}
                    <VStack spacing={4} w="full">
                      <HStack spacing={2} w="full" justify="space-between">
                        {[1, 2, 3, 4, 5, 6].map((step) => (
                          <VStack key={step} spacing={2}>
                            <Box
                              w={8}
                              h={8}
                              borderRadius="full"
                              bg={step <= currentStep ? "blue.500" : "whiteAlpha.100"}
                              color={step <= currentStep ? "white" : "whiteAlpha.500"}
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              fontSize="sm"
                              fontWeight="600"
                              cursor="pointer"
                              onClick={() => goToStep(step)}
                              transition="all 0.3s"
                            >
                              {step}
                            </Box>
                            <Text fontSize="xs" color="whiteAlpha.600" textAlign="center">
                              {step === 1 && "Personal"}
                              {step === 2 && "Company"}
                              {step === 3 && "Process"}
                              {step === 4 && "Rounds"}
                              {step === 5 && "Questions"}
                              {step === 6 && "Tips"}
                            </Text>
                          </VStack>
                        ))}
                      </HStack>
                      
                      <Text fontSize="sm" color="whiteAlpha.500" textAlign="center">
                        Step {currentStep} of {totalSteps}
                      </Text>
                    </VStack>

                    {/* Step Content */}
                    {currentStep === 1 && (
                      <VStack spacing={6} align="start" w="full">
                        <Heading fontSize="2xl" color="white" fontWeight="600">
                          Personal & Academic Details
                        </Heading>
                      
                      <FormControl>
                        <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
                          Full Name
                        </FormLabel>
              <Input
                          name="fullName"
                          value={formData.fullName}
                onChange={handleChange}
                          placeholder="Your full name"
                          bg="whiteAlpha.100"
                border="1px solid"
                          borderColor="whiteAlpha.200"
                          color="white"
                          _placeholder={{ color: "whiteAlpha.500" }}
                          _focus={{
                            borderColor: "blue.400",
                            boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.3)"
                          }}
                          h={12}
              />
            </FormControl>

                      <FormControl>
                        <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
                          Email (Optional)
                        </FormLabel>
              <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your.email@example.com"
                          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                          title="Please enter a valid email address"
                          maxLength={100}
                          bg="whiteAlpha.100"
                          border="1px solid"
                          borderColor="whiteAlpha.200"
                          color="white"
                          _placeholder={{ color: "whiteAlpha.500" }}
                          _focus={{
                            borderColor: "blue.400",
                            boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.3)"
                          }}
                          h={12}
                        />
                      </FormControl>

                      <FormControl isRequired={!formData.isAnonymous}>
                        <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
                          LinkedIn URL
                        </FormLabel>
                        <Input
                          name="linkedinUrl"
                          type="url"
                          value={formData.linkedinUrl}
                          onChange={handleChange}
                          placeholder={formData.isAnonymous ? "Not required for anonymous posts" : "https://linkedin.com/in/yourprofile"}
                          pattern="https://www\.linkedin\.com/.*"
                          title="LinkedIn URL must start with https://www.linkedin.com/"
                          maxLength={200}
                          bg="whiteAlpha.100"
                          border="1px solid"
                          borderColor="whiteAlpha.200"
                          color="white"
                          _placeholder={{ color: "whiteAlpha.500" }}
                          _focus={{
                            borderColor: "blue.400",
                            boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.3)"
                          }}
                          h={12}
                          isDisabled={formData.isAnonymous}
                        />
                        {formData.isAnonymous && (
                          <Text fontSize="xs" color="whiteAlpha.500" mt={1}>
                            LinkedIn URL is not required for anonymous posts
                          </Text>
                        )}
                      </FormControl>

                      <HStack spacing={4} w="full">
                        <FormControl>
                          <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
                            College Name
                          </FormLabel>
              <Input
                            name="collegeName"
                            value={formData.collegeName}
                onChange={handleChange}
                            placeholder="Your college name"
                            bg="whiteAlpha.100"
                border="1px solid"
                            borderColor="whiteAlpha.200"
                            color="white"
                            _placeholder={{ color: "whiteAlpha.500" }}
                            _focus={{
                              borderColor: "blue.400",
                              boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.3)"
                            }}
                            h={12}
              />
            </FormControl>

                        <FormControl>
                          <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
                            Branch
                          </FormLabel>
                          <Select
                            name="branch"
                            value={formData.branch}
                            onChange={handleChange}
                            placeholder="Select branch"
                            bg="whiteAlpha.100"
                            border="1px solid"
                            borderColor="whiteAlpha.200"
                            color="white"
                            _focus={{
                              borderColor: "blue.400",
                              boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.3)"
                            }}
                            h={12}
                          >
                            <option value="CSE">CSE</option>
                            <option value="IT">IT</option>
                            <option value="ECE">ECE</option>
                            <option value="EEE">EEE</option>
                            <option value="MECH">MECH</option>
                            <option value="CIVIL">CIVIL</option>
                            <option value="Other">Other</option>
                          </Select>
                        </FormControl>

                        <FormControl>
                          <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
                            Batch Year
                          </FormLabel>
                          <Input
                            name="batchYear"
                            type="number"
                            value={formData.batchYear}
                            onChange={handleChange}
                            placeholder="2025"
                            bg="whiteAlpha.100"
                            border="1px solid"
                            borderColor="whiteAlpha.200"
                            color="white"
                            _placeholder={{ color: "whiteAlpha.500" }}
                            _focus={{
                              borderColor: "blue.400",
                              boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.3)"
                            }}
                            h={12}
                          />
                        </FormControl>
                      </HStack>

                      <FormControl>
                        <HStack>
                          <input
                            type="checkbox"
                            name="isAnonymous"
                            checked={formData.isAnonymous}
                            onChange={handleChange}
                            style={{ accentColor: '#3182ce' }}
                          />
                          <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500" mb={0}>
                            Post as Anonymous
                          </FormLabel>
                        </HStack>
                      </FormControl>
                      </VStack>
                    )}

                    {currentStep === 2 && (
                      <VStack spacing={6} align="start" w="full">
                        <Heading fontSize="2xl" color="white" fontWeight="600">
                          Company & Role Details
                        </Heading>
                      
                        <FormControl isRequired>
                          <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
                            Company Name
                          </FormLabel>
              <Input
                            name="companyName"
                            value={formData.companyName}
                onChange={handleChange}
                placeholder="Company name"
                            minLength={2}
                            maxLength={100}
                            required
                            bg="whiteAlpha.100"
                border="1px solid"
                            borderColor="whiteAlpha.200"
                            color="white"
                            _placeholder={{ color: "whiteAlpha.500" }}
                            _focus={{
                              borderColor: "blue.400",
                              boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.3)"
                            }}
                            h={12}
              />
            </FormControl>

                      <HStack spacing={4} w="full">
                        <FormControl isRequired>
                          <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
                            Job Role
                          </FormLabel>
              <Input
                            name="jobRole"
                            value={formData.jobRole}
                onChange={handleChange}
                            placeholder="Software Engineer"
                            minLength={2}
                            maxLength={100}
                            required
                            bg="whiteAlpha.100"
                border="1px solid"
                            borderColor="whiteAlpha.200"
                            color="white"
                            _placeholder={{ color: "whiteAlpha.500" }}
                            _focus={{
                              borderColor: "blue.400",
                              boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.3)"
                            }}
                            h={12}
              />
            </FormControl>

                        <FormControl isRequired>
                          <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
                            Position Type
                          </FormLabel>
                          <Select
                            name="positionType"
                            value={formData.positionType}
                            onChange={handleChange}
                            placeholder="Select position type"
                            bg="whiteAlpha.100"
                            border="1px solid"
                            borderColor="whiteAlpha.200"
                            color="white"
                            _focus={{
                              borderColor: "blue.400",
                              boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.3)"
                            }}
                            h={12}
                          >
                            <option value="Placement" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Placement</option>
                            <option value="Internship" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Internship</option>
                          </Select>
                        </FormControl>
                      </HStack>

                      <FormControl>
                        <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
                          Interview Type
                        </FormLabel>
                          <Select
                            name="interviewType"
                            value={formData.interviewType}
                            onChange={handleChange}
                            placeholder="Select type"
                            bg="whiteAlpha.100"
                            border="1px solid"
                            borderColor="whiteAlpha.200"
                            color="white"
                            _focus={{
                              borderColor: "blue.400",
                              boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.3)"
                            }}
                            h={12}
                          >
                            <option value="On-Campus">On-Campus</option>
                            <option value="Off-Campus">Off-Campus</option>
                            <option value="Referral">Referral</option>
                            <option value="Internship">Internship</option>
                          </Select>
                        </FormControl>

                      <HStack spacing={4} w="full">
                        <FormControl>
                          <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
                            Job Location
                          </FormLabel>
                          <Input
                            name="jobLocation"
                            value={formData.jobLocation}
                            onChange={handleChange}
                            placeholder="Bangalore"
                            bg="whiteAlpha.100"
                            border="1px solid"
                            borderColor="whiteAlpha.200"
                            color="white"
                            _placeholder={{ color: "whiteAlpha.500" }}
                            _focus={{
                              borderColor: "blue.400",
                              boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.3)"
                            }}
                            h={12}
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
                            CTC (Optional)
                          </FormLabel>
                          <Input
                            name="ctc"
                            value={formData.ctc}
                            onChange={handleChange}
                            placeholder="6 LPA"
                            pattern="^\d+(\.\d+)?\s*LPA$"
                            title="Please enter CTC in format like '6 LPA' or '6.5 LPA'"
                            maxLength={20}
                            bg="whiteAlpha.100"
                            border="1px solid"
                            borderColor="whiteAlpha.200"
                            color="white"
                            _placeholder={{ color: "whiteAlpha.500" }}
                            _focus={{
                              borderColor: "blue.400",
                              boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.3)"
                            }}
                            h={12}
                          />
                        </FormControl>
                      </HStack>
                      </VStack>
                    )}

                    {currentStep === 3 && (
                      <VStack spacing={6} align="start" w="full">
                        <Heading fontSize="2xl" color="white" fontWeight="600">
                          Selection Process Details
                        </Heading>
                      
                      <HStack spacing={4} w="full">
                        <FormControl isRequired>
                          <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
                            Number of Rounds
                          </FormLabel>
                          <Input
                            name="numberOfRounds"
                            type="number"
                            value={formData.numberOfRounds}
                            onChange={handleChange}
                            placeholder="4"
                            bg="whiteAlpha.100"
                border="1px solid"
                            borderColor="whiteAlpha.200"
                            color="white"
                            _placeholder={{ color: "whiteAlpha.500" }}
                            _focus={{
                              borderColor: "blue.400",
                              boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.3)"
                            }}
                            h={12}
              />
            </FormControl>

                        <FormControl>
                          <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
                            Difficulty Level
                          </FormLabel>
                          <Select
                            name="difficultyLevel"
                            value={formData.difficultyLevel}
                            onChange={handleChange}
                            placeholder="Select difficulty"
                            bg="whiteAlpha.100"
                            border="1px solid"
                            borderColor="whiteAlpha.200"
                            color="white"
                            _focus={{
                              borderColor: "blue.400",
                              boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.3)"
                            }}
                            h={12}
                          >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                          </Select>
                        </FormControl>
                      </HStack>

                      <FormControl>
                        <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
                          Round Types
                        </FormLabel>
                        <HStack spacing={4} wrap="wrap">
                          {['Aptitude', 'Coding', 'Technical', 'HR', 'Group Discussion', 'Presentation'].map((type) => (
                            <HStack key={type}>
                              <input
                                type="checkbox"
                                name="roundTypes"
                                value={type}
                                checked={formData.roundTypes.includes(type)}
                                onChange={handleChange}
                                style={{ accentColor: '#3182ce' }}
                              />
                              <Text color="whiteAlpha.600" fontSize="sm">{type}</Text>
                            </HStack>
                          ))}
                        </HStack>
                      </FormControl>

                      <FormControl isRequired>
                          <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
                            Overall Experience Summary
                          </FormLabel>
                          <Text fontSize="xs" color="whiteAlpha.500" mb={2}>
                            {formData.overallExperience.length}/2000 characters (minimum 50)
                          </Text>
              <Textarea
                          name="overallExperience"
                          value={formData.overallExperience}
                onChange={handleChange}
                          placeholder="The process was challenging but fair. The interviewers were friendly and asked relevant questions..."
                          minLength={50}
                          maxLength={2000}
                          minH="120px"
                          bg="whiteAlpha.100"
                border="1px solid"
                          borderColor="whiteAlpha.200"
                          color="white"
                          _placeholder={{ color: "whiteAlpha.500" }}
                          _focus={{
                            borderColor: "blue.400",
                            boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.3)"
                          }}
                          rows={4}
                          resize="vertical"
              />
            </FormControl>
                      </VStack>
                    )}

                    {currentStep === 4 && (
                      <VStack spacing={6} align="start" w="full">
                        <Heading fontSize="2xl" color="white" fontWeight="600">
                          Detailed Round Descriptions
                        </Heading>
                        
                        {!formData.numberOfRounds ? (
                          <Box p={6} bg="whiteAlpha.100" borderRadius="lg" border="1px solid" borderColor="whiteAlpha.200">
                            <Text color="whiteAlpha.600" textAlign="center">
                              Please enter the number of rounds in the previous step to add detailed round descriptions.
                            </Text>
                          </Box>
                        ) : (
                          <>
                            <Text color="whiteAlpha.600" fontSize="sm">
                              Add detailed descriptions for each round (based on {formData.numberOfRounds} rounds entered)
                            </Text>
                            
                            {formData.rounds.map((round, index) => (
                              <VStack key={index} spacing={4} align="start" w="full" p={4} bg="whiteAlpha.50" borderRadius="lg">
                                <HStack justify="space-between" w="full">
                                  <Text color="white" fontWeight="600">Round {index + 1}</Text>
                                  {formData.rounds.length > 1 && (
            <Button
                                      size="sm"
                                      variant="ghost"
                                      color="red.400"
                                      onClick={() => removeRound(index)}
                                    >
                                      Remove
                                    </Button>
                                  )}
                                </HStack>
                                
                                <FormControl>
                                  <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
                                    Round Name
                                  </FormLabel>
              <Input
                                    value={round.name}
                                    onChange={(e) => updateRound(index, 'name', e.target.value)}
                                    placeholder="Aptitude Test"
                                    bg="whiteAlpha.100"
                                    border="1px solid"
                                    borderColor="whiteAlpha.200"
                                    color="white"
                                    _placeholder={{ color: "whiteAlpha.500" }}
                                    _focus={{
                                      borderColor: "blue.400",
                                      boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.3)"
                                    }}
                                    h={12}
                                  />
                                </FormControl>

                                <FormControl>
                                  <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
                                    Round Description
                                  </FormLabel>
                                  <Textarea
                                    value={round.description}
                                    onChange={(e) => updateRound(index, 'description', e.target.value)}
                                    placeholder="MCQs on logical reasoning and quants. Time limit was 60 minutes..."
                                    minH="100px"
                                    bg="whiteAlpha.100"
                                    border="1px solid"
                                    borderColor="whiteAlpha.200"
                                    color="white"
                                    _placeholder={{ color: "whiteAlpha.500" }}
                                    _focus={{
                                      borderColor: "blue.400",
                                      boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.3)"
                                    }}
                                    rows={3}
                                    resize="vertical"
                                  />
                                </FormControl>
                              </VStack>
                            ))}
                            
                            <Button
                              onClick={addRound}
                              variant="outline"
                              color="blue.400"
                              borderColor="blue.400"
                              _hover={{ bg: "blue.50", color: "blue.600" }}
                              leftIcon={<Icon as={FaPlus} />}
                            >
                              Add Round
                            </Button>
                          </>
                        )}
                      </VStack>
                    )}

                    {currentStep === 5 && (
                      <VStack spacing={6} align="start" w="full">
                        <Heading fontSize="2xl" color="white" fontWeight="600">
                          Technical & HR Questions
                        </Heading>
                      
                      <FormControl>
                        <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
                          Coding Questions Asked
                        </FormLabel>
                        <Textarea
                          name="codingQuestions"
                          value={formData.codingQuestions}
                          onChange={handleChange}
                          placeholder="1. Reverse a linked list&#10;2. Two-sum problem&#10;3. Find the longest common subsequence..."
                          minH="120px"
                          bg="whiteAlpha.100"
                          border="1px solid"
                          borderColor="whiteAlpha.200"
                          color="white"
                          _placeholder={{ color: "whiteAlpha.500" }}
                          _focus={{
                            borderColor: "blue.400",
                            boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.3)"
                          }}
                          rows={4}
                          resize="vertical"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
                          Technical Questions
                        </FormLabel>
                        <Textarea
                          name="technicalQuestions"
                          value={formData.technicalQuestions}
                          onChange={handleChange}
                          placeholder="OOPs concepts, DBMS queries, OS scheduling algorithms, project-related questions..."
                          minH="120px"
                          bg="whiteAlpha.100"
                          border="1px solid"
                          borderColor="whiteAlpha.200"
                          color="white"
                          _placeholder={{ color: "whiteAlpha.500" }}
                          _focus={{
                            borderColor: "blue.400",
                            boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.3)"
                          }}
                          rows={4}
                          resize="vertical"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
                          HR Questions
                        </FormLabel>
                        <Textarea
                          name="hrQuestions"
                          value={formData.hrQuestions}
                          onChange={handleChange}
                          placeholder="Tell me about yourself, strengths, weaknesses, why this company, future goals..."
                          minH="90px"
                          bg="whiteAlpha.100"
                          border="1px solid"
                          borderColor="whiteAlpha.200"
                          color="white"
                          _placeholder={{ color: "whiteAlpha.500" }}
                          _focus={{
                            borderColor: "blue.400",
                            boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.3)"
                          }}
                          rows={3}
                          resize="vertical"
                        />
                      </FormControl>
                      </VStack>
                    )}

                    {currentStep === 6 && (
                      <VStack spacing={6} align="start" w="full">
                        <Heading fontSize="2xl" color="white" fontWeight="600">
                          Preparation Tips
                        </Heading>
                      
                      <FormControl>
                        <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
                          Resources Used
                        </FormLabel>
                        <Textarea
                          name="resourcesUsed"
                          value={formData.resourcesUsed}
                onChange={handleChange}
                          placeholder="LeetCode, Striver's Sheet, GFG, Codeforces, YouTube channels..."
                          minH="90px"
                          bg="whiteAlpha.100"
                border="1px solid"
                          borderColor="whiteAlpha.200"
                          color="white"
                          _placeholder={{ color: "whiteAlpha.500" }}
                          _focus={{
                            borderColor: "blue.400",
                            boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.3)"
                          }}
                          rows={3}
                          resize="vertical"
              />
            </FormControl>

                      <FormControl>
                        <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
                          Tips for Future Candidates
                        </FormLabel>
              <Textarea
                          name="tipsForCandidates"
                          value={formData.tipsForCandidates}
                onChange={handleChange}
                          placeholder="Practice arrays & DP. Focus on basics. Be confident in interviews. Prepare your projects well..."
                          minH="90px"
                          bg="whiteAlpha.100"
                border="1px solid"
                          borderColor="whiteAlpha.200"
                          color="white"
                          _placeholder={{ color: "whiteAlpha.500" }}
                          _focus={{
                            borderColor: "blue.400",
                            boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.3)"
                          }}
                          rows={3}
                          resize="vertical"
              />
            </FormControl>

                      <FormControl>
                        <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
                          Mistakes to Avoid
                        </FormLabel>
                        <Textarea
                          name="mistakesToAvoid"
                          value={formData.mistakesToAvoid}
                          onChange={handleChange}
                          placeholder="Not revising fundamentals before the test. Being nervous during interviews. Not preparing for HR questions..."
                          minH="90px"
                          bg="whiteAlpha.100"
                          border="1px solid"
                          borderColor="whiteAlpha.200"
                          color="white"
                          _placeholder={{ color: "whiteAlpha.500" }}
                          _focus={{
                            borderColor: "blue.400",
                            boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.3)"
                          }}
                          rows={3}
                          resize="vertical"
                        />
                      </FormControl>
                      </VStack>
                    )}

                    {/* reCAPTCHA */}
                    {currentStep === totalSteps && (
                      <Box w="full" display="flex" justifyContent="center">
                        <ReCAPTCHA
                          ref={recaptchaRef}
                          sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                          onChange={onRecaptchaChange}
                          onExpired={onRecaptchaExpired}
                          onError={onRecaptchaError}
                          theme="dark"
                          size="normal"
                        />
                      </Box>
                    )}

                    {/* Navigation Buttons */}
                    <HStack spacing={4} w="full" justify="space-between" mt={6}>
                      <Button
                        onClick={prevStep}
                        variant="outline"
                        color="whiteAlpha.700"
                        borderColor="whiteAlpha.300"
                        _hover={{ 
                          borderColor: "whiteAlpha.500",
                          color: "white",
                          bg: "whiteAlpha.100"
                        }}
                        disabled={currentStep === 1}
              size="lg"
                        h={12}
                        px={8}
                        fontWeight="600"
                        borderRadius="xl"
                        transition="all 0.3s ease"
                        _disabled={{
                          opacity: 0.4,
                          cursor: "not-allowed",
                          _hover: {
                            borderColor: "whiteAlpha.300",
                            color: "whiteAlpha.700",
                            bg: "transparent"
                          }
                        }}
                      >
                        Previous
                      </Button>
                      
                      {currentStep < totalSteps ? (
                        <Button
                          onClick={nextStep}
                          bg="blue.500"
                          color="white"
                          _hover={{ 
                            bg: "blue.600",
                            transform: "translateY(-2px)",
                            boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)"
                          }}
                          _active={{ bg: "blue.700" }}
                          size="lg"
                          h={12}
                          px={8}
                          fontWeight="600"
                          borderRadius="xl"
                          transition="all 0.3s ease"
                        >
                          Next
                        </Button>
                      ) : (
            <Button
              type="submit"
              bg="blue.500"
              color="white"
              isLoading={isSubmitting}
              loadingText="Sharing..."
              _hover={{ 
                bg: "blue.600",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)"
              }}
              _active={{ bg: "blue.700" }}
              size="lg"
              h={12}
              px={8}
              fontSize="md"
              fontWeight="600"
              borderRadius="xl"
              leftIcon={<Icon as={FaPaperPlane} />}
              transition="all 0.3s ease"
              disabled={isSubmitting}
              _disabled={{
                opacity: 0.7,
                cursor: "not-allowed",
                _hover: {
                  bg: "blue.500",
                  transform: "none",
                  boxShadow: "none"
                }
              }}
            >
              Share Experience
            </Button>
                      )}
                    </HStack>
                  </VStack>
          </form>
              </VStack>
          </Box>
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

export default PostExperience