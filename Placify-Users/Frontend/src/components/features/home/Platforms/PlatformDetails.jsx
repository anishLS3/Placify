import { 
  Box, Text, Button, HStack
} from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

const PlatformDetails = () => {
  return (
    <MotionBox
      textAlign="center"
      mt={20}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      viewport={{ once: true }}
    >
      <Text
        fontSize="lg"
        color="whiteAlpha.600"
        mb={8}
        maxW="600px"
        mx="auto"
        lineHeight="1.6"
      >
        Ready to start your coding journey? Choose your platform and begin practicing today.
      </Text>
      
      <HStack justify="center" spacing={6} flexWrap="wrap">
        <Button
          as="a"
          href="https://leetcode.com"
          target="_blank"
          size="lg"
          bg="white"
          color="black"
          _hover={{ bg: "whiteAlpha.900" }}
          borderRadius="full"
          px={8}
          py={6}
          fontSize="md"
          fontWeight="600"
        >
          Start with LeetCode
        </Button>
        
        <Button
          as="a"
          href="https://www.hackerrank.com"
          target="_blank"
          size="lg"
          variant="outline"
          borderColor="whiteAlpha.300"
          color="white"
          _hover={{ 
            bg: "whiteAlpha.100",
            borderColor: "whiteAlpha.500"
          }}
          borderRadius="full"
          px={8}
          py={6}
          fontSize="md"
          fontWeight="600"
        >
          Try HackerRank
        </Button>
      </HStack>
    </MotionBox>
  )
}

export default PlatformDetails
