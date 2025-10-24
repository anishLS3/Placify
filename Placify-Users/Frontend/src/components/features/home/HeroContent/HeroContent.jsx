import { 
  Box, Container, Heading, Text, Grid, VStack, HStack, Icon, Button
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FaBriefcase, FaCode, FaTrophy, FaRocket } from 'react-icons/fa'
import CompanyCards from './CompanyCards'

const MotionBox = motion(Box)
const MotionHeading = motion(Heading)
const MotionText = motion(Text)

const HeroContent = ({ isCardsHovered, setIsCardsHovered }) => {
  return (
    <Container maxW="container.xl" position="relative" h="100vh" display="flex" alignItems="center" pt={20}>
      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={12} w="100%" alignItems="center">
        {/* Left Section - Text Content */}
        <MotionBox
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Main Headline - Apple Style */}
          <Heading
            fontSize={{ base: '4xl', md: '6xl', lg: '7xl' }}
            fontWeight="600"
            color="white"
            mb={6}
            lineHeight="1.05"
            letterSpacing="-0.02em"
          >
            Get placed at
            <br />
            top companies.
          </Heading>

          {/* Subtitle */}
          <Text
            fontSize={{ base: 'lg', md: 'xl' }}
            color="whiteAlpha.700"
            mb={12}
            maxW="600px"
            lineHeight="1.6"
            fontWeight="400"
          >
            Learn from real interview experiences, prepare with expert resources, and land your dream job at top tech companies.
          </Text>
        </MotionBox>

        {/* Right Section - 3D Company Cards Fan Layout */}
        <CompanyCards 
          isCardsHovered={isCardsHovered}
          setIsCardsHovered={setIsCardsHovered}
        />
      </Grid>
    </Container>
  )
}

export default HeroContent
