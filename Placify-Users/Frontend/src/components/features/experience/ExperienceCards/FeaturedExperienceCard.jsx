import { 
  Box, VStack, HStack, Text, Icon 
} from '@chakra-ui/react'
import { FaLinkedin } from 'react-icons/fa'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

const FeaturedExperienceCard = ({ experience, onClick }) => {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      flex="1"
      p={12}
      bg="white"
      borderRadius="2xl"
      border="1px solid"
      borderColor="gray.200"
      cursor="pointer"
      _hover={{ 
        transform: "translateY(-4px)",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s"
      }}
      onClick={() => onClick(experience)}
    >
      <VStack align="start" spacing={6}>
        <HStack spacing={4} w="full" justify="space-between">
          <VStack align="start" spacing={3}>
            <HStack spacing={3}>
              <Text fontSize="3xl" fontWeight="700" color="gray.900">
                {experience.fullName}
              </Text>
              {experience.linkedinUrl && (
                <Icon 
                  as={FaLinkedin} 
                  color="blue.500" 
                  fontSize="2xl" 
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
            <Text fontSize="2xl" color="blue.500" fontWeight="600">
              {experience.companyName} - {experience.jobRole}
            </Text>
            <Text fontSize="lg" color="gray.600">
              {experience.positionType}
            </Text>
          </VStack>
          <Text fontSize="lg" color="gray.500" fontWeight="500">
            {new Date(experience.date).toLocaleDateString()}
          </Text>
        </HStack>
        <Text color="gray.700" lineHeight="1.6" fontSize="lg" noOfLines={3}>
          {experience.overallExperience}
        </Text>
      </VStack>
    </MotionBox>
  )
}

export default FeaturedExperienceCard
