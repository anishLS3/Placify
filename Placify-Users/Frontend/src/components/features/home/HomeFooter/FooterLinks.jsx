import { VStack, Heading, HStack, Button, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

const FooterLinks = () => {
  return (
    <VStack align="start" spacing={8} w="full">
      <Heading size="xl" color="white" fontWeight="600" letterSpacing="-0.01em">
        Quick Links
      </Heading>
      
      <HStack spacing={12} wrap="wrap">
        <Button
          as={RouterLink}
          to="/"
          variant="link"
          color="whiteAlpha.600"
          p={0}
          h="auto"
          fontWeight="400"
          fontSize="lg"
          _hover={{ color: "white" }}
          textAlign="left"
        >
          About Placify
        </Button>
        <Button
          as={RouterLink}
          to="/preparation"
          variant="link"
          color="whiteAlpha.600"
          p={0}
          h="auto"
          fontWeight="400"
          fontSize="lg"
          _hover={{ color: "white" }}
          textAlign="left"
        >
          Preparation Tips
        </Button>
        <Button
          as={RouterLink}
          to="/experience"
          variant="link"
          color="whiteAlpha.600"
          p={0}
          h="auto"
          fontWeight="400"
          fontSize="lg"
          _hover={{ color: "white" }}
          textAlign="left"
        >
          Interview Experience
        </Button>
        <Button
          onClick={() => {
            const faqSection = document.getElementById('faq')
            if (faqSection) {
              faqSection.scrollIntoView({ behavior: 'smooth' })
            }
          }}
          variant="link"
          color="whiteAlpha.600"
          p={0}
          h="auto"
          fontWeight="400"
          fontSize="lg"
          _hover={{ color: "white" }}
          textAlign="left"
        >
          FAQ
        </Button>
      </HStack>
    </VStack>
  )
}

export default FooterLinks
