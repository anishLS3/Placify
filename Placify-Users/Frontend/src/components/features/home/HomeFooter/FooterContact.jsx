import { VStack, Heading, Text } from '@chakra-ui/react'

const FooterContact = () => {
  return (
    <VStack align="start" spacing={8} w="full">
      <Heading size="xl" color="white" fontWeight="600" letterSpacing="-0.01em">
        Contact Us
      </Heading>
      
      <VStack align="start" spacing={6} w="full">
        <VStack align="start" spacing={3}>
          <Text color="whiteAlpha.500" fontSize="sm" fontWeight="500" letterSpacing="0.05em" textTransform="uppercase">
            Email
          </Text>
          <Text color="white" fontSize="lg" fontWeight="400">
            support@placify.com
          </Text>
        </VStack>

        <VStack align="start" spacing={4}>
          <Text color="whiteAlpha.500" fontSize="sm" fontWeight="500" letterSpacing="0.05em" textTransform="uppercase">
            Phone
          </Text>
          <VStack align="start" spacing={3}>
            <VStack align="start" spacing={1}>
              <Text color="white" fontSize="lg" fontWeight="500">
                Anish L S
              </Text>
              <Text color="whiteAlpha.600" fontSize="md">
                9566541288
              </Text>
            </VStack>
            <VStack align="start" spacing={1}>
              <Text color="white" fontSize="lg" fontWeight="500">
                Danush S
              </Text>
              <Text color="whiteAlpha.600" fontSize="md">
                9003412202
              </Text>
            </VStack>
          </VStack>
        </VStack>
      </VStack>
    </VStack>
  )
}

export default FooterContact
