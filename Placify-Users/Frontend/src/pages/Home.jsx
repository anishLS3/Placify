import { Box, Flex } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useHomeState } from '@/components/features/home/HomeState'
import { HomeNavigation } from '@/components/features/home/HomeNavigation'
import { HeroContent } from '@/components/features/home/HeroContent'
import { Features } from '@/components/features/home/Features'
import { Platforms } from '@/components/features/home/Platforms'
import { InterviewGuide } from '@/components/features/home/InterviewGuide'
import { FAQ } from '@/components/features/home/FAQ'
import { HomeFooter } from '@/components/features/home/HomeFooter'

const MotionBox = motion(Box)

const Home = () => {
  const {
    isOpen,
    onOpen,
    onClose,
    isCardsHovered,
    setIsCardsHovered,
    activeCard,
    setActiveCard,
    activeCategory,
    setActiveCategory,
    expandedQuestion,
    setExpandedQuestion
  } = useHomeState()

  return (
    <Flex direction="column" minH="100vh">
      {/* Hero Section */}
      <MotionBox
        h="100vh"
        bg="#000000"
        id="hero"
        overflow="hidden"
        position="relative"
      >
        {/* Professional Background Pattern */}
        <Box 
          position="absolute"
          top={0} 
          left={0} 
          right={0} 
          bottom={0}
          opacity={0.05}
          sx={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(255,255,255,0.08) 0%, transparent 50%),
              radial-gradient(circle at 40% 60%, rgba(255,255,255,0.06) 0%, transparent 50%)
            `
          }}
        />

        {/* Navigation */}
        <HomeNavigation 
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
        />

        {/* Hero Content */}
        <HeroContent 
          isCardsHovered={isCardsHovered}
          setIsCardsHovered={setIsCardsHovered}
        />
      </MotionBox>

      {/* Features Section */}
      <Features 
        activeCard={activeCard}
        setActiveCard={setActiveCard}
      />

      {/* Practice Platforms Section */}
      <Platforms />

      {/* Interview Guide Section */}
      <InterviewGuide />

      {/* FAQ Section */}
      <FAQ 
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        expandedQuestion={expandedQuestion}
        setExpandedQuestion={setExpandedQuestion}
      />

      {/* Footer Section */}
      <HomeFooter />
    </Flex>
  )
}

export default Home