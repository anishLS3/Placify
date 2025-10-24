import { 
  Box, Text, VStack, HStack
} from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

const PlatformCard = ({ 
  href, 
  name, 
  tag, 
  description, 
  stats, 
  topics,
  borderColor,
  bgColor,
  gradientColor
}) => {
  return (
    <MotionBox
      as="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      p={10}
      textDecoration="none"
      cursor="pointer"
      position="relative"
      whileHover={{ 
        bg: 'whiteAlpha.50',
        scale: 1.02,
        y: -2
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      borderRadius="2xl"
      border="1px solid"
      borderColor={borderColor}
      bg={bgColor}
      backdropFilter="blur(10px)"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(135deg, ${gradientColor} 0%, transparent 50%)`,
        borderRadius: '2xl',
        opacity: 0,
        transition: 'opacity 0.3s ease'
      }}
      _hover={{
        _before: { opacity: 1 }
      }}
    >
      <VStack align="start" spacing={4}>
        <HStack justify="space-between" w="full">
          <Text fontSize="2xl" fontWeight="700" color="white">
            {name}
          </Text>
          <Text fontSize="xs" color="whiteAlpha.400" bg="whiteAlpha.100" px={2} py={1} borderRadius="full">
            {tag}
          </Text>
        </HStack>
        
        <Text fontSize="md" color="whiteAlpha.700" lineHeight="1.6">
          {description}
        </Text>
        
        <HStack spacing={4} fontSize="sm" color="whiteAlpha.500">
          {stats.map((stat, index) => (
            <Text key={index}>{stat}</Text>
          ))}
        </HStack>
        
        <Box w="full" h="1px" bg="whiteAlpha.200" />
        
        <Text fontSize="sm" color="whiteAlpha.600">
          {topics}
        </Text>
      </VStack>
    </MotionBox>
  )
}

export default PlatformCard
