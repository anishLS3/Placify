import { Box, Text, Heading } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)
const MotionHeading = motion(Heading)
const MotionText = motion(Text)

const FAQHeader = () => {
  return (
    <MotionBox
      textAlign="center"
      mb={16}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <MotionHeading
        fontSize={{ base: '3xl', md: '5xl' }}
        fontWeight="600"
        color="white"
        mb={4}
        letterSpacing="-0.02em"
      >
        Frequently asked
        <br />
        questions.
      </MotionHeading>
      <MotionText
        fontSize="xl"
        color="whiteAlpha.600"
        maxW="700px"
        mx="auto"
        lineHeight="1.6"
      >
        Everything you need to know about Placify.
      </MotionText>
    </MotionBox>
  )
}

export default FAQHeader
