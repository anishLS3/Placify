import { 
  Box, Button, FormControl, FormErrorMessage, FormLabel, HStack, 
  Icon, Input, Text, Textarea, VStack, useToast 
} from '@chakra-ui/react'
import { FaPaperPlane } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { submitContact, validateForm } from '@/utils'
import ReCAPTCHA from 'react-google-recaptcha'

const MotionBox = motion(Box)

const ContactFormSection = () => {
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
  const [recaptchaToken, setRecaptchaToken] = useState('')
  
  // reCAPTCHA configuration
  const isDevelopment = import.meta.env.DEV
  const RECAPTCHA_SITE_KEY = isDevelopment 
    ? '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI' // Test site key
    : process.env.REACT_APP_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'

  // reCAPTCHA callback
  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token)
  }

  // Handle reCAPTCHA errors
  const handleRecaptchaError = () => {
    console.warn('reCAPTCHA error occurred')
    setRecaptchaToken('')
  }

  const handleRecaptchaExpired = () => {
    console.warn('reCAPTCHA expired')
    setRecaptchaToken('')
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
    
    const { errors: newErrors, isValid } = validateForm(formData)
    setErrors(newErrors)
    
    if (!isValid) {
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
        message: `Subject: ${formData.subject.trim()}\n\n${formData.message.trim()}`,
        recaptchaToken: isDevelopment ? 'dev-token' : recaptchaToken
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
      setRecaptchaToken('')
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
    <MotionBox
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <VStack spacing={12} w="full">
        <VStack spacing={6} textAlign="center">
          <motion.h2
            style={{
              fontSize: 'clamp(1.875rem, 4vw, 3rem)',
              fontWeight: 600,
              color: 'white',
              letterSpacing: '-0.02em',
              margin: 0
            }}
          >
            Send us a message.
          </motion.h2>
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

              {/* reCAPTCHA Widget */}
              {!isDevelopment && (
                <Box w="full" display="flex" justifyContent="center">
                  <ReCAPTCHA
                    sitekey={RECAPTCHA_SITE_KEY}
                    onChange={handleRecaptchaChange}
                    onErrored={handleRecaptchaError}
                    onExpired={handleRecaptchaExpired}
                    theme="dark"
                    size="normal"
                  />
                </Box>
              )}
              
              {/* Development mode - skip reCAPTCHA validation */}
              {isDevelopment && (
                <Box w="full" display="flex" justifyContent="center" p={4}>
                  <Text color="whiteAlpha.500" fontSize="sm">
                    reCAPTCHA disabled in development mode
                  </Text>
                </Box>
              )}

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
  )
}

export default ContactFormSection
