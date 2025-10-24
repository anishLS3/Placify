import { Box, Container, Text } from '@chakra-ui/react'

const AppFooter = ({ copyrightText = "© 2025 Placify. All rights reserved." }) => {
  return (
    <Box borderTop="1px solid" borderColor="whiteAlpha.100" py={12}>
      <Container maxW="1400px">
        <Text textAlign="center" color="whiteAlpha.500" fontSize="sm">
          {copyrightText}
        </Text>
      </Container>
    </Box>
  )
}

export default AppFooter
