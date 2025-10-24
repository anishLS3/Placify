import { VStack, Heading, Text } from '@chakra-ui/react'

const FooterHeader = () => {
  return (
    <VStack align="start" spacing={8} w="full">
      <Heading
        size="2xl"
        color="white"
        fontWeight="700"
        letterSpacing="-0.02em"
      >
        Placify
      </Heading>
      <Text color="whiteAlpha.600" fontSize="lg" lineHeight="1.6" maxW="500px">
        Your ultimate placement companion. Learn, prepare, and succeed with real interview insights and guided preparation resources.
      </Text>
    </VStack>
  )
}

export default FooterHeader
