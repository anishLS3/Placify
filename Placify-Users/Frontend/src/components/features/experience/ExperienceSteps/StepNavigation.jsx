import { Box, HStack, VStack, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

const ExperienceStepNavigation = ({ 
  currentStep, 
  totalSteps, 
  onStepClick 
}) => {
  const steps = [
    { number: 1, label: "Personal" },
    { number: 2, label: "Company" },
    { number: 3, label: "Process" },
    { number: 4, label: "Rounds" },
    { number: 5, label: "Questions" },
    { number: 6, label: "Tips" }
  ]

  return (
    <VStack spacing={4} w="full">
      <HStack spacing={2} w="full" justify="space-between">
        {steps.map((step) => (
          <VStack key={step.number} spacing={2}>
            <MotionBox
              w={8}
              h={8}
              borderRadius="full"
              bg={step.number <= currentStep ? "blue.500" : "whiteAlpha.100"}
              color={step.number <= currentStep ? "white" : "whiteAlpha.500"}
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="sm"
              fontWeight="600"
              cursor="pointer"
              onClick={() => onStepClick(step.number)}
              transition="all 0.3s"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {step.number}
            </MotionBox>
            <Text fontSize="xs" color="whiteAlpha.600" textAlign="center">
              {step.label}
            </Text>
          </VStack>
        ))}
      </HStack>
      
      <Text fontSize="sm" color="whiteAlpha.500" textAlign="center">
        Step {currentStep} of {totalSteps}
      </Text>
    </VStack>
  )
}

export default ExperienceStepNavigation
