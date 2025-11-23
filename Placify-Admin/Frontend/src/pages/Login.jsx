import React, { useState } from 'react'
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Card,
  CardBody,
  InputGroup,
  InputRightElement,
  IconButton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useForm } from 'react-hook-form'
import { useToast } from '@chakra-ui/react'
import { Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { login, isAuthenticated, error, clearError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  
  const from = location.state?.from?.pathname || '/'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const onSubmit = async (data) => {
    try {
      clearError()
      await login(data)
      toast({
        title: 'Login successful!',
        status: 'success',
        duration: 3000,
        isClosable: true
      })
      navigate(from, { replace: true })
    } catch (error) {
      console.error('Login failed:', error)
      // Error is already handled by auth context and shown via error state
    }
  }

  return (
    <Box bg="#000000" minH="100vh" py={{ base: 8, md: 12 }} px={{ base: 4, md: 0 }}>
      <Container maxW={{ base: "sm", md: "md" }}>
        <VStack spacing={{ base: 6, md: 8 }}>
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Heading
              size={{ base: "lg", md: "xl" }}
              color="white"
              fontFamily="heading"
            >
              Placify Admin
            </Heading>
            <Text color="rgba(255, 255, 255, 0.7)" fontSize={{ base: "md", md: "lg" }}>
              Sign in to manage placement experiences
            </Text>
          </VStack>

          {/* Login Form */}
          <Card 
            w="full" 
            maxW="md" 
            bg="rgba(28, 28, 30, 0.8)" 
            border="1px solid rgba(255, 255, 255, 0.1)"
            borderRadius="2xl"
          >
            <CardBody p={{ base: 6, md: 8 }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <VStack spacing={{ base: 4, md: 6 }}>
                  {/* Error Alert */}
                  {error && (
                    <Alert status="error" bg="rgba(245, 101, 101, 0.2)" color="white" borderRadius="lg">
                      <AlertIcon color="#f56565" />
                      <Box>
                        <AlertTitle fontSize="sm">Login failed!</AlertTitle>
                        <AlertDescription fontSize="sm">
                          {error}
                        </AlertDescription>
                      </Box>
                    </Alert>
                  )}

                  {/* Email Field */}
                  <FormControl isInvalid={errors.email}>
                    <FormLabel fontSize="sm" fontWeight="600" color="rgba(255, 255, 255, 0.8)">
                      Email Address
                    </FormLabel>
                    <Input
                      type="email"
                      placeholder="admin@placify.com"
                      size={{ base: "md", md: "lg" }}
                      borderRadius="xl"
                      bg="rgba(255, 255, 255, 0.1)"
                      border="1px solid rgba(255, 255, 255, 0.2)"
                      color="white"
                      _placeholder={{ color: "rgba(255, 255, 255, 0.5)" }}
                      _hover={{ borderColor: "rgba(255, 255, 255, 0.3)" }}
                      _focus={{
                        borderColor: "rgba(255, 255, 255, 0.4)",
                        boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.4)"
                      }}
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Please enter a valid email address'
                        }
                      })}
                    />
                    <FormErrorMessage color="#ff3b30">
                      {errors.email && errors.email.message}
                    </FormErrorMessage>
                  </FormControl>

                  {/* Password Field */}
                  <FormControl isInvalid={errors.password}>
                    <FormLabel fontSize="sm" fontWeight="600" color="rgba(255, 255, 255, 0.8)">
                      Password
                    </FormLabel>
                    <InputGroup>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        size="lg"
                        borderRadius="xl"
                        bg="rgba(255, 255, 255, 0.1)"
                        border="1px solid rgba(255, 255, 255, 0.2)"
                        color="white"
                        _placeholder={{ color: "rgba(255, 255, 255, 0.5)" }}
                        _hover={{ borderColor: "rgba(255, 255, 255, 0.3)" }}
                        _focus={{
                          borderColor: "rgba(255, 255, 255, 0.4)",
                          boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.4)"
                        }}
                        {...register('password', {
                          required: 'Password is required',
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters'
                          }
                        })}
                      />
                      <InputRightElement h="full">
                        <IconButton
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                          icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          color="rgba(255, 255, 255, 0.7)"
                          _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
                        />
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage color="#ff3b30">
                      {errors.password && errors.password.message}
                    </FormErrorMessage>
                  </FormControl>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    w="full"
                    borderRadius="xl"
                    isLoading={isSubmitting}
                    loadingText="Signing in..."
                    bg="#ff9a56"
                    color="white"
                    _hover={{
                      bg: "#ff8a46",
                      transform: 'translateY(-2px)',
                      boxShadow: 'lg'
                    }}
                    transition="all 0.2s"
                  >
                    Sign In
                  </Button>
                </VStack>
              </form>
            </CardBody>
          </Card>

          {/* Footer */}
          <Text fontSize="sm" color="rgba(255, 255, 255, 0.5)" textAlign="center">
            Placify Admin Panel v1.0
            <br />
            Secure access for authorized personnel only
          </Text>
        </VStack>
      </Container>
    </Box>
  )
}

export default Login