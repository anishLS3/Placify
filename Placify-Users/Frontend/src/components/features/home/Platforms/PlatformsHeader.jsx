import { Box, Text, Heading } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

const PlatformsHeader = () => {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      textAlign="center"
      mb={24}
    >
      <Text
        fontSize="sm"
        color="whiteAlpha.500"
        mb={4}
        letterSpacing="0.1em"
        textTransform="uppercase"
      >
        Practice Platforms
      </Text>
      
      <Heading
        fontSize={{ base: '4xl', md: '6xl', lg: '7xl' }}
        fontWeight="600"
        color="white"
        mb={6}
        lineHeight="1.05"
        letterSpacing="-0.03em"
      >
        Master coding.
        <br />
        Anywhere.
      </Heading>
      
      <Text
        fontSize={{ base: 'lg', md: 'xl' }}
        color="whiteAlpha.600"
        maxW="800px"
        mx="auto"
        lineHeight="1.6"
      >
        Connect with the world's leading coding platforms. Practice, learn, and compete with millions of developers worldwide.
      </Text>
    </MotionBox>
  )
}

export default PlatformsHeader
