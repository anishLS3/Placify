import React from 'react'
import {
  Box,
  Spinner,
  Text,
  VStack,
  Center
} from '@chakra-ui/react'

const LoadingSpinner = ({ 
  fullScreen = false, 
  text = 'Loading...', 
  size = 'lg',
  color = 'brand.500' 
}) => {
  const content = (
    <VStack spacing={4}>
      <Spinner
        thickness="3px"
        speed="0.65s"
        emptyColor="gray.200"
        color={color}
        size={size}
      />
      {text && (
        <Text
          color="gray.600"
          fontSize="sm"
          fontWeight="medium"
        >
          {text}
        </Text>
      )}
    </VStack>
  )

  if (fullScreen) {
    return (
      <Center
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="white"
        zIndex={9999}
      >
        {content}
      </Center>
    )
  }

  return (
    <Box p={8} textAlign="center">
      {content}
    </Box>
  )
}

export default LoadingSpinner