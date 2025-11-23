import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Grid,
  GridItem,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  HStack,
  Avatar,
  Divider,
  Alert,
  AlertIcon,
  useToast
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [updating, setUpdating] = useState(false);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const onSubmitProfile = async (data) => {
    try {
      setUpdating(true);
      // TODO: Implement profile update API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setUpdating(false);
    }
  };

  const onSubmitPassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      return;
    }

    try {
      setUpdating(true);
      // TODO: Implement password change API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: 'Success',
        description: 'Password updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    } catch (error) {
      console.error('Failed to update password:', error);
      toast({
        title: 'Error',
        description: 'Failed to update password',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Box p={{ base: 4, md: 8 }} bg="#000000" minH="100vh">
      {/* Header */}
      <Box mb={8}>
        <Heading size={{ base: "xl", md: "2xl" }} color="white" mb={2}>Admin Profile</Heading>
        <Text color="rgba(255, 255, 255, 0.7)" fontSize={{ base: "md", md: "lg" }}>
          Manage your account settings and preferences
        </Text>
      </Box>

      <Grid templateColumns={{ base: '1fr', lg: '1fr 2fr' }} gap={{ base: 4, md: 6 }}>
        {/* Profile Info */}
        <Card bg="rgba(28, 28, 30, 0.8)" border="1px solid rgba(255, 255, 255, 0.1)">
          <CardBody>
            <VStack spacing={4}>
              <Avatar
                size={{ base: "lg", md: "xl" }}
                name={user?.name || 'Admin'}
                src={user?.avatar}
                bg="#ff9a56"
              />
              <Box textAlign="center">
                <Text fontWeight="bold" fontSize="lg" color="white">
                  {user?.name || 'Admin User'}
                </Text>
                <Text color="rgba(255, 255, 255, 0.6)" fontSize="sm">
                  {user?.email || 'admin@placify.com'}
                </Text>
                <Text color="rgba(255, 255, 255, 0.5)" fontSize="xs" mt={2}>
                  Administrator
                </Text>
              </Box>
              
              <Divider borderColor="rgba(255, 255, 255, 0.1)" />
              
              <VStack spacing={2} w="full">
                <Text fontSize="sm" fontWeight="semibold" color="rgba(255, 255, 255, 0.8)">
                  Account Status
                </Text>
                <Alert status="success" bg="rgba(72, 187, 120, 0.2)" color="white">
                  <AlertIcon color="#48bb78" />
                  <Text fontSize="xs">Account Active</Text>
                </Alert>
              </VStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Settings Forms */}
        <VStack spacing={6}>
          {/* Profile Information */}
          <Card w="full" bg="rgba(28, 28, 30, 0.8)" border="1px solid rgba(255, 255, 255, 0.1)">
            <CardHeader>
              <Heading size="md" color="white">Profile Information</Heading>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit(onSubmitProfile)}>
                <VStack spacing={4}>
                  <FormControl isInvalid={errors.name}>
                    <FormLabel color="rgba(255, 255, 255, 0.8)">Full Name</FormLabel>
                    <Input
                      {...register('name', { required: 'Name is required' })}
                      placeholder="Enter your full name"
                      bg="rgba(255, 255, 255, 0.1)"
                      border="1px solid rgba(255, 255, 255, 0.2)"
                      color="white"
                      _placeholder={{ color: "rgba(255, 255, 255, 0.5)" }}
                      _focus={{ borderColor: "rgba(255, 255, 255, 0.4)" }}
                    />
                  </FormControl>

                  <FormControl isInvalid={errors.email}>
                    <FormLabel color="rgba(255, 255, 255, 0.8)">Email Address</FormLabel>
                    <Input
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Please enter a valid email address'
                        }
                      })}
                      placeholder="Enter your email address"
                      bg="rgba(255, 255, 255, 0.1)"
                      border="1px solid rgba(255, 255, 255, 0.2)"
                      color="white"
                      _placeholder={{ color: "rgba(255, 255, 255, 0.5)" }}
                      _focus={{ borderColor: "rgba(255, 255, 255, 0.4)" }}
                    />
                  </FormControl>

                  <Button
                    type="submit"
                    bg="#ff9a56"
                    color="white"
                    _hover={{ bg: "#ff8a46" }}
                    size="md"
                    isLoading={updating}
                    isDisabled={!isDirty}
                    w="full"
                  >
                    Update Profile
                  </Button>
                </VStack>
              </form>
            </CardBody>
          </Card>

          {/* Change Password */}
          <Card w="full" bg="rgba(28, 28, 30, 0.8)" border="1px solid rgba(255, 255, 255, 0.1)">
            <CardHeader>
              <Heading size="md" color="white">Change Password</Heading>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit(onSubmitPassword)}>
                <VStack spacing={4}>
                  <FormControl isInvalid={errors.currentPassword}>
                    <FormLabel color="rgba(255, 255, 255, 0.8)">Current Password</FormLabel>
                    <Input
                      type="password"
                      {...register('currentPassword', {
                        required: 'Current password is required'
                      })}
                      placeholder="Enter current password"
                      bg="rgba(255, 255, 255, 0.1)"
                      border="1px solid rgba(255, 255, 255, 0.2)"
                      color="white"
                      _placeholder={{ color: "rgba(255, 255, 255, 0.5)" }}
                      _focus={{ borderColor: "rgba(255, 255, 255, 0.4)" }}
                    />
                  </FormControl>

                  <FormControl isInvalid={errors.newPassword}>
                    <FormLabel color="rgba(255, 255, 255, 0.8)">New Password</FormLabel>
                    <Input
                      type="password"
                      {...register('newPassword', {
                        required: 'New password is required',
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters'
                        }
                      })}
                      placeholder="Enter new password"
                      bg="rgba(255, 255, 255, 0.1)"
                      border="1px solid rgba(255, 255, 255, 0.2)"
                      color="white"
                      _placeholder={{ color: "rgba(255, 255, 255, 0.5)" }}
                      _focus={{ borderColor: "rgba(255, 255, 255, 0.4)" }}
                    />
                  </FormControl>

                  <FormControl isInvalid={errors.confirmPassword}>
                    <FormLabel color="rgba(255, 255, 255, 0.8)">Confirm New Password</FormLabel>
                    <Input
                      type="password"
                      {...register('confirmPassword', {
                        required: 'Please confirm your new password'
                      })}
                      placeholder="Confirm new password"
                      bg="rgba(255, 255, 255, 0.1)"
                      border="1px solid rgba(255, 255, 255, 0.2)"
                      color="white"
                      _placeholder={{ color: "rgba(255, 255, 255, 0.5)" }}
                      _focus={{ borderColor: "rgba(255, 255, 255, 0.4)" }}
                    />
                  </FormControl>

                  <Button
                    type="submit"
                    bg="rgba(255, 59, 48, 0.8)"
                    color="white"
                    border="1px solid rgba(255, 59, 48, 0.3)"
                    _hover={{ bg: "rgba(255, 59, 48, 0.9)" }}
                    size="md"
                    isLoading={updating}
                    w="full"
                  >
                    Change Password
                  </Button>
                </VStack>
              </form>
            </CardBody>
          </Card>
        </VStack>
      </Grid>
    </Box>
  );
};

export default Profile;