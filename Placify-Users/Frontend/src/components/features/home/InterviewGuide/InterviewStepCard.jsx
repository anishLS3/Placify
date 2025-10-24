import { 
  Box, Text, VStack, HStack
} from '@chakra-ui/react'

const InterviewStepCard = ({ stepNumber, title, description }) => {
  return (
    <Box
      bg="black"
      borderRadius="2xl"
      p={8}
      minW="280px"
      maxW="280px"
      h="420px"
      flexShrink={0}
      boxShadow="0 4px 20px rgba(0, 0, 0, 0.3)"
      _hover={{ 
        transform: "translateY(-4px)",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)"
      }}
      transition="all 0.3s ease"
      display="flex"
      flexDirection="column"
      position="relative"
      overflow="hidden"
      border="1px solid"
      borderColor="whiteAlpha.100"
    >
      {/* Header Section */}
      <VStack align="start" spacing={6} mb={8}>
        <HStack align="start" spacing={4}>
          <Box
            w={10}
            h={10}
            bg="white"
            color="black"
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontWeight="700"
            fontSize="lg"
            flexShrink={0}
            boxShadow="0 2px 8px rgba(255, 255, 255, 0.2)"
          >
            {stepNumber}
          </Box>
          <Text fontSize="xl" fontWeight="700" color="white" lineHeight="1.2" letterSpacing="-0.02em">
            {title}
          </Text>
        </HStack>
      </VStack>
      
      {/* Content Section */}
      <VStack align="start" spacing={6} flex={1} justify="space-between">
        <Text 
          fontSize="md" 
          color="whiteAlpha.700" 
          lineHeight="1.7" 
          wordBreak="break-word"
          textAlign="left"
          fontWeight="400"
          letterSpacing="0.01em"
        >
          {description}
        </Text>
        
        {/* Bottom accent line */}
        <Box w="full" h="1px" bg="whiteAlpha.200" opacity={0.6} />
      </VStack>
    </Box>
  )
}

export default InterviewStepCard
