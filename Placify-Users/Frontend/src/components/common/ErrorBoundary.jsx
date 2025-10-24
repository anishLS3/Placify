import React from 'react'
import { Box, Button, Text, VStack } from '@chakra-ui/react'
import { logErrorToMonitoring } from '@/utils/errorHandler'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    logErrorToMonitoring(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          p={8}
          textAlign="center"
          bg="red.50"
          border="1px solid"
          borderColor="red.200"
          borderRadius="lg"
          m={4}
        >
          <VStack spacing={4}>
            <Text fontSize="xl" fontWeight="bold" color="red.600">
              Something went wrong
            </Text>
            <Text color="red.500">
              An unexpected error occurred. Please refresh the page and try again.
            </Text>
            <Button
              colorScheme="red"
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
          </VStack>
        </Box>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
