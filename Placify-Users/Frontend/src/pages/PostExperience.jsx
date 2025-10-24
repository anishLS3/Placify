import { Box, Container } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { AppNavigation, AppFooter } from '@/components/common/Layout'
import { PageHero } from '@/components/common/UI'
import { ExperienceFormSection } from '@/components/features/experience'

const MotionBox = motion(Box)

const PostExperience = () => {
  return (
    <Box minH="100vh" bg="#000000" position="relative" overflow="hidden">
      <AppNavigation />

      {/* Main Content */}
      <Box pt={20}>
        <PageHero 
          title="Share Your Experience"
          subtitle="Help fellow students by sharing your placement journey and interview experience."
        />

        <Container maxW="1400px" px={6} pb={32}>
          <ExperienceFormSection />
        </Container>

        <AppFooter />
      </Box>
    </Box>
  )
}

export default PostExperience