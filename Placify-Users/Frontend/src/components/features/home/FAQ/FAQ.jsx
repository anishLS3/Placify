import { Box, Container } from '@chakra-ui/react'
import FAQHeader from './FAQHeader'
import FAQContent from './FAQContent'
import FAQBackground from './FAQBackground'

const FAQ = ({ 
  activeCategory, 
  setActiveCategory, 
  expandedQuestion, 
  setExpandedQuestion 
}) => {
  return (
    <Box
      id="faq"
      py={32}
      pb={32}
      position="relative"
      overflow="hidden"
      bg="#000000"
      borderTop="1px solid"
      borderColor="whiteAlpha.100"
    >
      <FAQBackground />
      
      <Container maxW="container.xl" position="relative">
        <FAQHeader />
        <FAQContent 
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          expandedQuestion={expandedQuestion}
          setExpandedQuestion={setExpandedQuestion}
        />
      </Container>
    </Box>
  )
}

export default FAQ
