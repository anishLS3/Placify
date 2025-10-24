import { 
  Box, Text, VStack, HStack, Button, Icon 
} from '@chakra-ui/react'
import { FaPlus } from 'react-icons/fa'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

const PreparationCard = ({ 
  card, 
  index, 
  onCardClick 
}) => {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      p={8}
      bg="whiteAlpha.50"
      borderRadius="2xl"
      border="1px solid"
      borderColor="whiteAlpha.100"
      position="relative"
      _hover={{ 
        transform: "translateY(-4px)",
        boxShadow: "0 8px 30px rgba(255, 255, 255, 0.1)",
        transition: "all 0.3s"
      }}
      cursor="pointer"
      onClick={() => onCardClick(card)}
    >
      <VStack align="start" spacing={6}>
        <HStack spacing={4} w="full" justify="space-between">
          <Icon 
            as={card.icon} 
            color={`${card.color}.400`} 
            fontSize="2xl" 
          />
          <Button
            size="sm"
            bg="black"
            color="white"
            borderRadius="full"
            w={8}
            h={8}
            minW={8}
            p={0}
            _hover={{ bg: "gray.800" }}
          >
            <Icon as={FaPlus} fontSize="sm" />
          </Button>
        </HStack>
        
        <VStack align="start" spacing={3}>
          <Text fontSize="2xl" fontWeight="600" color="white">
            {card.title}
          </Text>
          <Text fontSize="lg" color={`${card.color}.400`} fontWeight="600">
            {card.stats}
          </Text>
          <Text color="whiteAlpha.700" fontSize="md" lineHeight="1.6">
            {card.description}
          </Text>
        </VStack>
      </VStack>
    </MotionBox>
  )
}

export default PreparationCard
