import { 
  Box, Heading, Text, SimpleGrid, VStack 
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import PreparationCard from './PreparationCard'

const MotionBox = motion(Box)

const PreparationCardsGrid = ({ 
  preparationCards, 
  onCardClick 
}) => {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      mb={8}
    >
      <VStack align="start" spacing={12} w="full">
        <VStack align="start" spacing={6} w="full">
          <Heading
            fontSize={{ base: '3xl', md: '5xl' }}
            fontWeight="600"
            color="white"
            letterSpacing="-0.02em"
            textAlign="center"
            w="full"
          >
            Your preparation journey.
          </Heading>
          <Text fontSize="xl" color="whiteAlpha.600" fontWeight="400" textAlign="center" w="full">
            Everything you need to prepare effectively for campus placements.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
          {preparationCards.map((card, index) => (
            <PreparationCard
              key={index}
              card={card}
              index={index}
              onCardClick={onCardClick}
            />
          ))}
        </SimpleGrid>
      </VStack>
    </MotionBox>
  )
}

export default PreparationCardsGrid
