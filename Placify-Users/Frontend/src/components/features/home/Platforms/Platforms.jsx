import { 
  Box, Container, VStack
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import PlatformsHeader from './PlatformsHeader'
import PlatformCards from './PlatformCards'
import PlatformDetails from './PlatformDetails'

const MotionBox = motion(Box)

const Platforms = () => {
  return (
    <Box
      id="platforms"
      py={40}
      bg="#000000"
      position="relative"
      borderTop="1px solid"
      borderColor="whiteAlpha.100"
      overflow="hidden"
    >
      {/* Apple-style color highlights and gradients */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        pointerEvents="none"
      >
        {/* Main radial gradient */}
        <Box
          position="absolute"
          top="20%"
          left="10%"
          w="600px"
          h="600px"
          background="radial-gradient(circle, rgba(0,122,255,0.08) 0%, rgba(255,45,85,0.05) 30%, transparent 70%)"
          borderRadius="full"
          filter="blur(80px)"
        />
        
        {/* Secondary gradient */}
        <Box
          position="absolute"
          top="60%"
          right="15%"
          w="400px"
          h="400px"
          background="radial-gradient(circle, rgba(52,199,89,0.06) 0%, rgba(255,149,0,0.04) 40%, transparent 70%)"
          borderRadius="full"
          filter="blur(60px)"
        />
        
        {/* Accent glow */}
        <Box
          position="absolute"
          bottom="10%"
          left="30%"
          w="300px"
          h="300px"
          background="radial-gradient(circle, rgba(175,82,222,0.05) 0%, transparent 60%)"
          borderRadius="full"
          filter="blur(40px)"
        />
        
        {/* Animated floating elements */}
        <MotionBox
          position="absolute"
          top="15%"
          right="20%"
          w="4px"
          h="4px"
          bg="rgba(0, 122, 255, 0.6)"
          borderRadius="full"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <MotionBox
          position="absolute"
          top="40%"
          left="5%"
          w="6px"
          h="6px"
          bg="rgba(52, 199, 89, 0.5)"
          borderRadius="full"
          animate={{
            y: [0, 15, 0],
            x: [0, 10, 0],
            opacity: [0.4, 0.8, 0.4]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        <MotionBox
          position="absolute"
          bottom="30%"
          right="10%"
          w="3px"
          h="3px"
          bg="rgba(255, 149, 0, 0.7)"
          borderRadius="full"
          animate={{
            y: [0, -10, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
      </Box>

      <Container maxW="1400px">
        <VStack spacing={0} align="stretch">
          <PlatformsHeader />
          <PlatformCards />
          <PlatformDetails />
        </VStack>
      </Container>
    </Box>
  )
}

export default Platforms
