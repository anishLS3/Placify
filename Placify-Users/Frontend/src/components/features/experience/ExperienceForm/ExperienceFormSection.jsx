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
import { handleError, getUserFriendlyMessage, formatValidationErrors, retryRequest } from '@/utils/errorHandler'
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
      // Only sanitize specific fields that need it, not all text inputs
      let processedValue = value
      
      // Only sanitize fields that might contain HTML or scripts
      const fieldsToSanitize = ['overallExperience', 'codingQuestions', 'technicalQuestions', 'hrQuestions', 'resourcesUsed', 'tipsForCandidates', 'mistakesToAvoid']
      
      if (fieldsToSanitize.includes(name)) {
        processedValue = sanitizeInput(value)
      }
      
      // Handle numberOfRounds change to dynamically create round inputs
      if (name === 'numberOfRounds') {
        const numberOfRounds = parseInt(value) || 0
        const currentRoundsCount = formData.rounds.length
        
        // Create new rounds array based on numberOfRounds
        let newRounds = [...formData.rounds]
        
        if (numberOfRounds > currentRoundsCount) {
          // Add new rounds
          for (let i = currentRoundsCount; i < numberOfRounds; i++) {
            newRounds.push({ name: '', description: '' })
          }
        } else if (numberOfRounds < currentRoundsCount) {
          // Remove excess rounds
          newRounds = newRounds.slice(0, numberOfRounds)
        }
        
        setFormData({
          ...formData,
          [name]: processedValue,
          rounds: newRounds
        })
      } else {
        setFormData({
          ...formData,
          [name]: processedValue
        })
      }
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
      // Validate current step before proceeding
      if (validateCurrentStep()) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (step) => {
    // Allow going to previous steps, but validate if going to next steps
    if (step > currentStep) {
      if (validateCurrentStep()) {
        setCurrentStep(step)
      }
    } else {
      setCurrentStep(step)
    }
  }

  // Validate current step before proceeding
  const validateCurrentStep = () => {
    const errors = []
    
    switch (currentStep) {
      case 1: // Personal Details Step
        if (!formData.isAnonymous) {
          if (!formData.fullName || formData.fullName.trim() === '') {
            errors.push('Full name is required for non-anonymous posts')
          }
          if (!formData.linkedinUrl || formData.linkedinUrl.trim() === '') {
            errors.push('LinkedIn URL is required for non-anonymous posts')
          }
        }
        break
        
      case 2: // Company Details Step
        if (!formData.companyName || formData.companyName.trim() === '') {
          errors.push('Company name is required')
        }
        if (!formData.jobRole || formData.jobRole.trim() === '') {
          errors.push('Job role is required')
        }
        if (!formData.positionType || formData.positionType === '') {
          errors.push('Position type is required')
        }
        break
        
      case 3: // Process Details Step
        if (!formData.numberOfRounds || formData.numberOfRounds === '') {
          errors.push('Number of rounds is required')
        }
        break
        
      case 4: // Round Details Step
        // Check if all rounds have both name and description
        const numberOfRounds = parseInt(formData.numberOfRounds) || 0
        if (numberOfRounds === 0) {
          errors.push('Number of rounds must be selected first')
        } else {
          // Check if we have the correct number of rounds
          if (formData.rounds.length !== numberOfRounds) {
            errors.push(`Please add all ${numberOfRounds} rounds`)
          } else {
            // Check if all rounds have both name and description
            const invalidRounds = formData.rounds.filter((round, index) => 
              !round.name || round.name.trim() === '' || 
              !round.description || round.description.trim() === ''
            )
            
            if (invalidRounds.length > 0) {
              const missingRounds = invalidRounds.map((_, index) => {
                const roundIndex = formData.rounds.findIndex(round => 
                  !round.name || round.name.trim() === '' || 
                  !round.description || round.description.trim() === ''
                )
                return roundIndex + 1
              })
              errors.push(`Round ${missingRounds.join(', ')} ${missingRounds.length === 1 ? 'is' : 'are'} missing name or description`)
            }
          }
        }
        break
        
      case 5: // Questions Step
        // Questions are optional, no validation needed
        break
        
      case 6: // Tips Step
        if (!formData.overallExperience || formData.overallExperience.trim() === '') {
          errors.push('Overall experience is required')
        } else if (formData.overallExperience.trim().length < 50) {
          errors.push('Overall experience must be at least 50 characters long')
        }
        break
        
      default:
        break
    }
    
    // Show errors if any
    if (errors.length > 0) {
      toast({
        title: 'Please complete required fields',
        description: errors[0],
        status: 'warning',
        duration: 4000,
        isClosable: true,
      })
      return false
    }
    
    return true
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
      // Helper function to filter out empty values
      const filterEmptyValues = (obj) => {
        const filtered = {}
        Object.keys(obj).forEach(key => {
          const value = obj[key]
          if (value !== '' && value !== null && value !== undefined) {
            if (Array.isArray(value)) {
              if (key === 'rounds') {
                // Filter out empty rounds (rounds with empty name and description)
                const validRounds = value.filter(round => 
                  round.name && round.name.trim() !== '' && 
                  round.description && round.description.trim() !== ''
                )
                if (validRounds.length > 0) {
                  filtered[key] = validRounds
                }
              } else if (value.length > 0) {
                filtered[key] = value
              }
            } else {
              filtered[key] = value
            }
          }
        })
        return filtered
      }

      // Send structured data to API
      const experienceData = filterEmptyValues({
        // Personal & Academic Details
        fullName: formData.fullName,
        email: formData.email,
        collegeName: formData.collegeName,
        branch: formData.branch,
        batchYear: parseInt(formData.batchYear) || new Date().getFullYear(),
        linkedinUrl: formData.linkedinUrl || '',
        isAnonymous: formData.isAnonymous || false,
        
        // Security (only include in production)
        ...(import.meta.env.DEV ? {} : { recaptchaToken: recaptchaToken }),
        
        // Company & Role Details
        companyName: formData.companyName,
        jobRole: formData.jobRole,
        positionType: formData.positionType,
        interviewType: formData.interviewType,
        jobLocation: formData.jobLocation,
        ctc: formData.ctc,
        
        // Selection Process Details
        numberOfRounds: parseInt(formData.numberOfRounds) || 1,
        roundTypes: Array.isArray(formData.roundTypes) ? formData.roundTypes : (formData.roundTypes ? [formData.roundTypes] : []),
        difficultyLevel: formData.difficultyLevel,
        overallExperience: formData.overallExperience,
        
        // Detailed Round Descriptions
        rounds: Array.isArray(formData.rounds) ? formData.rounds : [],
        
        // Technical & HR Questions
        codingQuestions: formData.codingQuestions || '',
        technicalQuestions: formData.technicalQuestions || '',
        hrQuestions: formData.hrQuestions || '',
        
        // Preparation Tips
        resourcesUsed: formData.resourcesUsed || '',
        tipsForCandidates: formData.tipsForCandidates || '',
        mistakesToAvoid: formData.mistakesToAvoid || '',
        
        // Default system fields
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        verificationBadge: false
      })
      
      // Debug: Log the data being sent
      console.log('Sending experience data:', experienceData)
      
      await addExperience(experienceData)
      toast({
        title: 'Experience shared successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      navigate('/experience')
    } catch (error) {
      console.error('Form submission error:', error)
      
      // Extract detailed error message from backend response
      let errorMessage = 'An unexpected error occurred. Please try again.'
      let errorTitle = 'Failed to share experience'
      
      if (error.response && error.response.data) {
        const backendError = error.response.data
        console.log('Backend error details:', backendError)
        
        // Handle validation errors with detailed field information
        if (backendError.errors && Array.isArray(backendError.errors)) {
          errorTitle = 'Validation Error'
          const validationMessages = backendError.errors.map(err => {
            if (err.field && err.message) {
              return `${err.field}: ${err.message}`
            }
            return err.message || err.toString()
          })
          errorMessage = validationMessages.join('\n')
        } 
        // Handle general error messages
        else if (backendError.message) {
          errorMessage = backendError.message
        }
      }
      // Handle network errors  
      else if (error.message && error.message.includes('Network Error')) {
        errorTitle = 'Connection Error'
        errorMessage = 'Unable to connect to server. Please check your internet connection and try again.'
      }
      // Use enhanced error handling as fallback
      else {
        const processedError = handleError(error, { 
          context: 'experience_form_submission',
          formData: experienceData 
        })
        
        errorMessage = getUserFriendlyMessage(processedError.type, processedError.message)
        
        // Handle specific error types
        switch (processedError.type) {
          case 'VALIDATION_ERROR':
            errorTitle = 'Validation Error'
            if (processedError.errors && processedError.errors.length > 0) {
              const formattedErrors = formatValidationErrors(processedError.errors)
              errorMessage = formattedErrors[0] // Show first error
            }
            break
            
          case 'NETWORK_ERROR':
            errorTitle = 'Connection Error'
            errorMessage = 'Unable to connect to server. Please check your internet connection and try again.'
            break
            
          case 'SERVER_ERROR':
            errorTitle = 'Server Error'
            errorMessage = 'Server is temporarily unavailable. Please try again later.'
            break
            
          case 'TIMEOUT_ERROR':
            errorTitle = 'Request Timeout'
            errorMessage = 'Request timed out. Please try again.'
            break
            
          default:
            errorMessage = processedError.message || 'An unexpected error occurred. Please try again.'
        }
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        status: 'error',
        duration: 7000,
        isClosable: true,
      })
      
      // Reset reCAPTCHA on error (only in production)
      if (!import.meta.env.DEV) {
        resetRecaptcha()
      }
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
                formData={formData}
              />

              {/* Step Content */}
              {renderStep()}

              {/* reCAPTCHA - Only show in production */}
              {currentStep === totalSteps && !import.meta.env.DEV && (
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

              {/* Development mode - skip reCAPTCHA validation */}
              {currentStep === totalSteps && import.meta.env.DEV && (
                <Box w="full" display="flex" justifyContent="center" p={4}>
                  <Text color="whiteAlpha.500" fontSize="sm">
                    reCAPTCHA disabled in development mode
                  </Text>
                </Box>
              )}

              {/* Navigation Buttons - Only Previous/Next */}
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
                
                {currentStep < totalSteps && (
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
                )}
              </HStack>
            </VStack>
          </form>
          
          {/* Submit Button - Outside Form Container */}
          {currentStep === totalSteps && (
            <Box w="full" mt={8} display="flex" justifyContent="center">
              <Button
                onClick={handleSubmit}
                bg="blue.500"
                color="white"
                isLoading={isSubmitting}
                loadingText="Sharing Experience..."
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
                Share Experience
              </Button>
            </Box>
          )}
        </VStack>
      </Box>
    </MotionBox>
  )
}

export default ExperienceFormSection
