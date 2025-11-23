import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Progress,
  useToast
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { setupService } from '../services/setupService';

const InitialSetup = ({ onSetupComplete }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [setupProgress, setSetupProgress] = useState(0);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setSetupProgress(20);

      // Create initial admin user
      await setupService.createInitialAdmin({
        name: data.name,
        email: data.email,
        password: data.password
      });
      
      setSetupProgress(60);
      
      // Complete setup
      await setupService.completeSetup();
      
      setSetupProgress(100);
      
      toast({
        title: 'Setup Complete!',
        description: 'Your admin account has been created successfully',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
      
      // Notify parent component
      setTimeout(() => {
        onSetupComplete();
      }, 1500);
      
    } catch (error) {
      console.error('Setup failed:', error);
      toast({
        title: 'Setup Failed',
        description: error.response?.data?.message || 'Failed to complete setup',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      setSetupProgress(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box bg="gray.50" minH="100vh" py={12}>
      <Container maxW="md">
        <VStack spacing={8}>
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Heading
              size="xl"
              bgGradient="linear(to-r, brand.500, accent.500)"
              bgClip="text"
              fontFamily="heading"
            >
              Placify Admin Setup
            </Heading>
            <Text color="gray.600" fontSize="lg">
              Create your administrator account to get started
            </Text>
          </VStack>

          {/* Setup Info */}
          <Alert status="info" borderRadius="lg">
            <AlertIcon />
            <Box>
              <AlertTitle fontSize="sm">Initial Setup Required</AlertTitle>
              <AlertDescription fontSize="sm">
                This is a one-time setup to create your admin account.
                You'll use these credentials to access the admin panel.
              </AlertDescription>
            </Box>
          </Alert>

          {/* Setup Form */}
          <Card w="full" boxShadow="xl" borderRadius="2xl">
            <CardBody p={8}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <VStack spacing={6}>
                  {/* Progress Bar */}
                  {setupProgress > 0 && (
                    <Box w="full">
                      <Text fontSize="sm" mb={2} color="gray.600">
                        Setup Progress
                      </Text>
                      <Progress value={setupProgress} colorScheme="brand" borderRadius="md" />
                    </Box>
                  )}

                  {/* Name Field */}
                  <FormControl isInvalid={errors.name}>
                    <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                      Full Name
                    </FormLabel>
                    <Input
                      placeholder="Enter your full name"
                      size="lg"
                      borderRadius="xl"
                      {...register('name', {
                        required: 'Name is required',
                        minLength: {
                          value: 2,
                          message: 'Name must be at least 2 characters'
                        }
                      })}
                    />
                    <FormErrorMessage>
                      {errors.name && errors.name.message}
                    </FormErrorMessage>
                  </FormControl>

                  {/* Email Field */}
                  <FormControl isInvalid={errors.email}>
                    <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                      Email Address
                    </FormLabel>
                    <Input
                      type="email"
                      placeholder="admin@yourcompany.com"
                      size="lg"
                      borderRadius="xl"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Please enter a valid email address'
                        }
                      })}
                    />
                    <FormErrorMessage>
                      {errors.email && errors.email.message}
                    </FormErrorMessage>
                  </FormControl>

                  {/* Password Field */}
                  <FormControl isInvalid={errors.password}>
                    <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                      Password
                    </FormLabel>
                    <Input
                      type="password"
                      placeholder="Create a strong password"
                      size="lg"
                      borderRadius="xl"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters'
                        },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                          message: 'Password must contain uppercase, lowercase, number and special character'
                        }
                      })}
                    />
                    <FormErrorMessage>
                      {errors.password && errors.password.message}
                    </FormErrorMessage>
                  </FormControl>

                  {/* Confirm Password Field */}
                  <FormControl isInvalid={errors.confirmPassword}>
                    <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                      Confirm Password
                    </FormLabel>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      size="lg"
                      borderRadius="xl"
                      {...register('confirmPassword', {
                        required: 'Please confirm your password'
                      })}
                    />
                    <FormErrorMessage>
                      {errors.confirmPassword && errors.confirmPassword.message}
                    </FormErrorMessage>
                  </FormControl>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    w="full"
                    borderRadius="xl"
                    isLoading={isSubmitting}
                    loadingText="Setting up..."
                    colorScheme="brand"
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'lg'
                    }}
                    transition="all 0.2s"
                  >
                    Complete Setup
                  </Button>
                </VStack>
              </form>
            </CardBody>
          </Card>

          {/* Footer */}
          <Text fontSize="sm" color="gray.500" textAlign="center">
            This will create your administrator account for Placify
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default InitialSetup;