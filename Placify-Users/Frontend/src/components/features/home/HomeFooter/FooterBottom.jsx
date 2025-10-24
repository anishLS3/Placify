import { Box, Flex, Text, HStack } from '@chakra-ui/react'

const FooterBottom = () => {
  return (
    <Box mt={16} pt={8} borderTop="1px solid" borderColor="whiteAlpha.100">
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "start", md: "center" }}
        gap={4}
      >
        <Text color="whiteAlpha.500" fontSize="md" fontWeight="400">
          © 2025 Placify. All Rights Reserved.
        </Text>
        
        <HStack spacing={8}>
          <Text color="whiteAlpha.600" fontSize="md" cursor="pointer" _hover={{ color: "white" }} fontWeight="400">
            Terms of Service
          </Text>
          <Text color="whiteAlpha.600" fontSize="md" cursor="pointer" _hover={{ color: "white" }} fontWeight="400">
            Privacy Policy
          </Text>
        </HStack>
      </Flex>
    </Box>
  )
}

export default FooterBottom
