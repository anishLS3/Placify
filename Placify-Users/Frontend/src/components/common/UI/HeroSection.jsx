import { Box, Heading, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

const PageHero = ({ title, subtitle, minHeight = "100vh" }) => {
  return (
    <Box 
      textAlign="center" 
      py={{ base: 20, md: 32 }} 
      px={6} 
      minH={minHeight} 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
    >
      <MotionBox
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Heading
          fontSize={{ base: '4xl', md: '6xl', lg: '8xl' }}
          fontWeight="600"
          color="white"
          mb={6}
          lineHeight="1.05"
          letterSpacing="-0.02em"
        >
          {title}
        </Heading>
        
        {subtitle && (
          <Text
            fontSize={{ base: 'xl', md: '2xl' }} 
            color="whiteAlpha.700" 
            maxW="800px" 
            mx="auto" 
            fontWeight="400"
            lineHeight="1.5"
          >
            {subtitle}
          </Text>
        )}
      </MotionBox>
    </Box>
  )
}

export default PageHero
