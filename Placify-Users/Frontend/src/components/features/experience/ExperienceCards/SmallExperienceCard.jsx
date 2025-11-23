import { 
  Box, VStack, HStack, Text, Icon 
} from '@chakra-ui/react'
import { FaLinkedin } from 'react-icons/fa'
import { motion } from 'framer-motion'
import VerificationBadge from '../../../common/VerificationBadge'

const MotionBox = motion(Box)

const SmallExperienceCard = ({ experience, onClick, index }) => {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      minW="280px"
      p={6}
      bg="white"
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.200"
      cursor="pointer"
      position="relative"
      _hover={{ 
        transform: "translateY(-4px)",
        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s"
      }}
      onClick={() => onClick(experience)}
    >
      {/* Verification Badge */}
      {experience.verificationBadge && (
        <VerificationBadge 
          size="sm" 
          top={3} 
          right={3}
        />
      )}
      
      {/* Verification Badge */}
      {experience.verificationBadge && (
        <VerificationBadge 
          size="sm" 
          top={3} 
          right={3}
        />
      )}
      
      <VStack align="start" spacing={3}>
        <HStack spacing={2} w="full" justify="space-between">
          <HStack spacing={2}>
            <Text fontSize="lg" fontWeight="600" color="gray.900">
              {experience.fullName}
            </Text>
            {experience.linkedinUrl && (
              <Icon 
                as={FaLinkedin} 
                color="blue.500" 
                fontSize="sm" 
                cursor="pointer"
                _hover={{ color: "blue.400", transform: "scale(1.1)" }}
                transition="all 0.2s"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(experience.linkedinUrl, '_blank')
                }}
              />
            )}
          </HStack>
          <Text fontSize="xs" color="gray.500">
            {new Date(experience.date).toLocaleDateString()}
          </Text>
        </HStack>
        <Text fontSize="md" color="blue.500" fontWeight="500">
          {experience.companyName} - {experience.jobRole}
        </Text>
        <Text fontSize="sm" color="gray.600">
          {experience.positionType}
        </Text>
        <Text color="gray.600" lineHeight="1.5" fontSize="sm" noOfLines={2}>
          {experience.overallExperience}
        </Text>
      </VStack>
    </MotionBox>
  )
}

export default SmallExperienceCard
