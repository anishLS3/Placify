import { Box, Flex, Text, VStack } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import FeaturedExperienceCard from '../ExperienceCards/FeaturedExperienceCard'
import ExperienceScrollContainer from '../ExperienceCards/ExperienceScrollContainer'

const MotionBox = motion(Box)

const ExperienceList = ({ 
  latestExperience, 
  otherExperiences, 
  onExperienceClick, 
  scrollPosition, 
  scrollLeft, 
  scrollRight 
}) => {
  // Show empty state if no experiences
  if (!latestExperience) {
    return (
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        mb={12}
      >
        <VStack spacing={4} textAlign="center" py={16}>
          <Text fontSize="xl" color="whiteAlpha.600" fontWeight="400">
            No experiences found
          </Text>
          <Text fontSize="md" color="whiteAlpha.500">
            Try adjusting your search or filters, or check back later for new experiences.
          </Text>
        </VStack>
      </MotionBox>
    )
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      mb={12}
    >
      <Flex direction={{ base: 'column', lg: 'row' }} gap={8} align="start">
        {/* Big Featured Card */}
        <FeaturedExperienceCard 
          experience={latestExperience}
          onClick={onExperienceClick}
        />

        {/* Scrollable Small Cards */}
        {otherExperiences.length > 0 && (
          <ExperienceScrollContainer
            experiences={otherExperiences}
            onExperienceClick={onExperienceClick}
            scrollPosition={scrollPosition}
            scrollLeft={scrollLeft}
            scrollRight={scrollRight}
          />
        )}
      </Flex>
    </MotionBox>
  )
}

export default ExperienceList
