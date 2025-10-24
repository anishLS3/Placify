import { 
  Box, VStack, HStack, Heading, Text, Button, Flex 
} from '@chakra-ui/react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { Icon } from '@chakra-ui/react'
import SmallExperienceCard from './SmallExperienceCard'

const ExperienceScrollContainer = ({ 
  experiences, 
  onExperienceClick, 
  scrollPosition, 
  scrollLeft, 
  scrollRight 
}) => {
  // Don't render if no experiences
  if (!experiences || experiences.length === 0) {
    return null
  }

  // Calculate if we can scroll right
  const containerWidth = 800 // Approximate container width
  const cardWidth = 320 // Approximate card width + gap
  const maxScroll = Math.max(0, (experiences.length * cardWidth) - containerWidth)
  const canScrollRight = scrollPosition < maxScroll
  const canScrollLeft = scrollPosition > 0
  
  return (
    <Box flex="1" minW="0">
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between" align="center">
          <VStack spacing={1} align="start">
            <Heading fontSize="2xl" fontWeight="600" color="white">
              More Experiences
            </Heading>
            <Text fontSize="sm" color="whiteAlpha.500">
              Click any card to view full details
            </Text>
          </VStack>
          <HStack spacing={2}>
            <Button
              size="sm"
              variant="outline"
              color={canScrollLeft ? "whiteAlpha.600" : "whiteAlpha.300"}
              borderColor={canScrollLeft ? "whiteAlpha.200" : "whiteAlpha.100"}
              _hover={canScrollLeft ? { borderColor: "whiteAlpha.400", color: "white" } : {}}
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              cursor={canScrollLeft ? "pointer" : "not-allowed"}
            >
              <Icon as={FaChevronLeft} />
            </Button>
            <Button
              size="sm"
              variant="outline"
              color={canScrollRight ? "whiteAlpha.600" : "whiteAlpha.300"}
              borderColor={canScrollRight ? "whiteAlpha.200" : "whiteAlpha.100"}
              _hover={canScrollRight ? { borderColor: "whiteAlpha.400", color: "white" } : {}}
              onClick={scrollRight}
              disabled={!canScrollRight}
              cursor={canScrollRight ? "pointer" : "not-allowed"}
            >
              <Icon as={FaChevronRight} />
            </Button>
          </HStack>
        </HStack>
        
        <Box overflow="hidden" borderRadius="xl">
          <Flex
            gap={4}
            transform={`translateX(-${scrollPosition}px)`}
            transition="transform 0.3s ease"
            pb={4}
          >
            {experiences.map((exp, index) => (
              <SmallExperienceCard
                key={exp._id}
                experience={exp}
                onClick={onExperienceClick}
                index={index}
              />
            ))}
          </Flex>
        </Box>
      </VStack>
    </Box>
  )
}

export default ExperienceScrollContainer
