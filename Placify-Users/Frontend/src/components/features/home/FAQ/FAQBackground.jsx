import { Box } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

const FAQBackground = () => {
  return (
    <>
      {/* Floating Gradient Circles */}
      <MotionBox
        position="absolute"
        top="10%"
        left="5%"
        w="300px"
        h="300px"
        borderRadius="full"
        bg="linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(236, 72, 153, 0.1) 100%)"
        filter="blur(60px)"
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <MotionBox
        position="absolute"
        top="50%"
        right="5%"
        w="400px"
        h="400px"
        borderRadius="full"
        bg="linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(147, 51, 234, 0.08) 100%)"
        filter="blur(70px)"
        animate={{
          y: [0, 40, 0],
          x: [0, -25, 0],
          scale: [1, 1.15, 1]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      <MotionBox
        position="absolute"
        bottom="15%"
        left="15%"
        w="250px"
        h="250px"
        borderRadius="full"
        bg="linear-gradient(135deg, rgba(251, 191, 36, 0.12) 0%, rgba(245, 158, 11, 0.08) 100%)"
        filter="blur(50px)"
        animate={{
          y: [0, -20, 0],
          x: [0, 15, 0],
          scale: [1, 1.08, 1]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      {/* Small Decorative Dots */}
      <MotionBox
        position="absolute"
        top="20%"
        right="25%"
        w="80px"
        h="80px"
        borderRadius="full"
        bg="rgba(168, 85, 247, 0.2)"
        animate={{
          y: [0, -15, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <MotionBox
        position="absolute"
        bottom="30%"
        right="10%"
        w="60px"
        h="60px"
        borderRadius="full"
        bg="rgba(59, 130, 246, 0.25)"
        animate={{
          y: [0, 20, 0],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
      />
      
      <MotionBox
        position="absolute"
        top="60%"
        left="8%"
        w="100px"
        h="100px"
        borderRadius="full"
        bg="rgba(236, 72, 153, 0.18)"
        animate={{
          y: [0, -25, 0],
          opacity: [0.35, 0.65, 0.35]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.8
        }}
      />
    </>
  )
}

export default FAQBackground
