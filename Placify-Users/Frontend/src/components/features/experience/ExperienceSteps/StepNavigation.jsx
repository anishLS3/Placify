import { Box, HStack, VStack, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

const ExperienceStepNavigation = ({ 
  currentStep, 
  totalSteps, 
  onStepClick,
  formData 
}) => {
  const steps = [
    { number: 1, label: "Personal" },
    { number: 2, label: "Company" },
    { number: 3, label: "Process" },
    { number: 4, label: "Rounds" },
    { number: 5, label: "Questions" },
    { number: 6, label: "Tips" }
  ]

  // Check if a step is completed
  const isStepCompleted = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        if (formData.isAnonymous) return true
        return formData.fullName && formData.fullName.trim() !== '' && 
               formData.linkedinUrl && formData.linkedinUrl.trim() !== ''
      case 2:
        return formData.companyName && formData.companyName.trim() !== '' && 
               formData.jobRole && formData.jobRole.trim() !== '' && 
               formData.positionType && formData.positionType !== ''
      case 3:
        return formData.numberOfRounds && formData.numberOfRounds !== ''
      case 4:
        const validRounds = formData.rounds.filter(round => 
          round.name && round.name.trim() !== '' && 
          round.description && round.description.trim() !== ''
        )
        return validRounds.length > 0
      case 5:
        return true // Questions are optional
      case 6:
        return formData.overallExperience && formData.overallExperience.trim() !== '' && 
               formData.overallExperience.trim().length >= 50
      default:
        return false
    }
  }

  // Check if a step can be accessed
  const canAccessStep = (stepNumber) => {
    if (stepNumber <= currentStep) return true // Can always go back to previous steps
    if (stepNumber === currentStep + 1) {
      // Can only go to next step if current step is completed
      return isStepCompleted(currentStep)
    }
    return false // Cannot skip ahead
  }

  return (
    <VStack spacing={4} w="full">
      <HStack spacing={2} w="full" justify="space-between">
        {steps.map((step) => {
          const isCompleted = isStepCompleted(step.number)
          const isCurrent = step.number === currentStep
          const canAccess = canAccessStep(step.number)
          
          return (
            <VStack key={step.number} spacing={2}>
              <MotionBox
                w={8}
                h={8}
                borderRadius="full"
                bg={
                  isCompleted ? "green.500" : 
                  isCurrent ? "blue.500" : 
                  canAccess ? "whiteAlpha.200" : "whiteAlpha.100"
                }
                color={
                  isCompleted || isCurrent ? "white" : 
                  canAccess ? "whiteAlpha.700" : "whiteAlpha.400"
                }
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="sm"
                fontWeight="600"
                cursor={canAccess ? "pointer" : "not-allowed"}
                onClick={() => canAccess && onStepClick(step.number)}
                transition="all 0.3s"
                whileHover={canAccess ? { scale: 1.1 } : {}}
                whileTap={canAccess ? { scale: 0.95 } : {}}
                opacity={canAccess ? 1 : 0.5}
              >
                {isCompleted ? "✓" : step.number}
              </MotionBox>
              <Text 
                fontSize="xs" 
                color={canAccess ? "whiteAlpha.600" : "whiteAlpha.400"} 
                textAlign="center"
              >
                {step.label}
              </Text>
            </VStack>
          )
        })}
      </HStack>
      
      <Text fontSize="sm" color="whiteAlpha.500" textAlign="center">
        Step {currentStep} of {totalSteps}
      </Text>
    </VStack>
  )
}

export default ExperienceStepNavigation
