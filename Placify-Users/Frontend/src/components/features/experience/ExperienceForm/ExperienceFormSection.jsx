import { useState, useRef } from 'react'
import {
  Box,
  VStack,
  HStack,
  Button,
  useToast,
  Icon,
  Text
} from '@chakra-ui/react'
import { FaPaperPlane } from 'react-icons/fa'
import { motion } from 'framer-motion'
import ReCAPTCHA from 'react-google-recaptcha'
import { useNavigate } from 'react-router-dom'
import { addExperience } from '@/utils/api'
import { validateExperienceForm, sanitizeInput } from '../ExperienceValidation/validation'
import ExperienceStepNavigation from '../ExperienceSteps/StepNavigation'
import PersonalDetailsStep from '../ExperienceSteps/PersonalDetailsStep'
import CompanyDetailsStep from '../ExperienceSteps/CompanyDetailsStep'
import ProcessDetailsStep from '../ExperienceSteps/ProcessDetailsStep'
import RoundDetailsStep from '../ExperienceSteps/RoundDetailsStep'
import QuestionsStep from '../ExperienceSteps/QuestionsStep'
import TipsStep from '../ExperienceSteps/TipsStep'

const MotionBox = motion(Box)

const ExperienceFormSection = () => {
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
    const { isValid, error } = validateExperienceForm(formData)
    
    if (!isValid) {
      toast({
        title: 'Validation Error',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return false
    }

    // reCAPTCHA validation (skip in development mode)
    const isDevelopment = import.meta.env.DEV
    if (!recaptchaToken && !recaptchaError && !isDevelopment) {
      toast({
        title: 'reCAPTCHA Required',
        description: 'Please complete the reCAPTCHA verification',
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalDetailsStep formData={formData} handleChange={handleChange} />
      case 2:
        return <CompanyDetailsStep formData={formData} handleChange={handleChange} />
      case 3:
        return <ProcessDetailsStep formData={formData} handleChange={handleChange} />
      case 4:
        return (
          <RoundDetailsStep 
            formData={formData} 
            addRound={addRound}
            removeRound={removeRound}
            updateRound={updateRound}
          />
        )
      case 5:
        return <QuestionsStep formData={formData} handleChange={handleChange} />
      case 6:
        return <TipsStep formData={formData} handleChange={handleChange} />
      default:
        return null
    }
  }

  return (
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
            <h1 style={{
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: 600,
              color: 'white',
              letterSpacing: '-0.02em',
              margin: 0
            }}>
              Tell your story
            </h1>
            <Text fontSize="lg" color="whiteAlpha.600" fontWeight="400">
              Share details about your placement experience to help others succeed.
            </Text>
          </VStack>
          
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={8} align="start" w="full">
              
              {/* Progress Steps */}
              <ExperienceStepNavigation 
                currentStep={currentStep}
                totalSteps={totalSteps}
                onStepClick={goToStep}
              />

              {/* Step Content */}
              {renderStep()}

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
  )
}

export default ExperienceFormSection
