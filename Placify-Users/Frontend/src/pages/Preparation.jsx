import { 
  Box, Container
} from '@chakra-ui/react'
import { useState } from 'react'
import { AppNavigation, AppFooter } from '@/components/common/Layout'
import { PageHero } from '@/components/common/UI'
import { PreparationCardsGrid } from '@/components/features/preparation/PreparationCards'
import { PreparationDetailsModal } from '@/components/features/preparation/PreparationModal'
import { preparationCards } from '@/components/features/preparation/PreparationData'
import { InspirationalQuote } from '@/components/features/preparation/PreparationQuote'

const Preparation = () => {
  const [selectedCard, setSelectedCard] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCardClick = (card) => {
    setSelectedCard(card)
    setIsModalOpen(true)
  }

  return (
    <Box minH="100vh" bg="#000000" position="relative" overflow="hidden">
      <AppNavigation />

      {/* Main Content */}
      <Box pt={20}>
        
        <PageHero
          title="Placement Preparation Guide"
          subtitle="Your one-stop guide to prepare effectively for campus placements — from resume building to cracking your final interview."
          gradientWords={['preparation', 'guide']}
        />

        <Container maxW="1400px" px={6} pb={4}>
          
          {/* Preparation Cards Section */}
          <PreparationCardsGrid
            preparationCards={preparationCards}
            onCardClick={handleCardClick}
          />



        </Container>

        {/* Inspirational Quote Section */}
        <InspirationalQuote />

        {/* Detailed Preparation Modal */}
        <PreparationDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedCard={selectedCard}
        />

        <AppFooter />

      </Box>
    </Box>
  )
}

export default Preparation