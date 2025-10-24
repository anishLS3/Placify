import { Box, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

const InspirationalQuote = () => {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      textAlign="center"
      py={10}
      px={6}
    >
      <Text
        fontSize={{ base: '2xl', md: '4xl' }}
        color="whiteAlpha.900"
        fontWeight="500"
        fontStyle="italic"
        maxW="800px"
        mx="auto"
        lineHeight="1.5"
        letterSpacing="-0.01em"
      >
        "Every interview is not a test,
        <br />
        it's a step toward the right opportunity."
      </Text>
    </MotionBox>
  )
}

export default InspirationalQuote
