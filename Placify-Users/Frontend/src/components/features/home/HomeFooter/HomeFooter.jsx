import { Box, Container, VStack } from '@chakra-ui/react'
import FooterHeader from './FooterHeader'
import FooterContact from './FooterContact'
import FooterLinks from './FooterLinks'
import FooterBottom from './FooterBottom'

const HomeFooter = () => {
  return (
    <Box
      as="footer"
      bg="#000000"
      py={20}
      position="relative"
      overflow="hidden"
    >
      <Container maxW="1400px">
        <VStack spacing={16} align="start">
          <FooterHeader />
          <FooterContact />
          <FooterLinks />
          <FooterBottom />
        </VStack>
      </Container>
    </Box>
  )
}

export default HomeFooter
