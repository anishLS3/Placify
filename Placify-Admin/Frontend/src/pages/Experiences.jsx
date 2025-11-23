import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  HStack,
  VStack,
  Input,
  Select,
  Card,
  CardBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Alert,
  AlertIcon,
  Flex,
  Spacer
} from '@chakra-ui/react';
import {
  RiSearchLine,
  RiFilterLine,
  RiEyeLine,
  RiCheckLine,
  RiCloseLine,
  RiMoreLine
} from 'react-icons/ri';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { experienceService } from '../services/experienceService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Experiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('approved');
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();

  useEffect(() => {
    // Set initial filters from URL params
    const status = searchParams.get('status');
    if (status) {
      setStatusFilter(status);
    } else {
      setStatusFilter('approved');
    }
  }, [searchParams]);

  const fetchExperiences = useCallback(async () => {
    try {
      setLoading(true);
      
      // Add delay to prevent rate limiting
      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
      
      // Small delay before making request to space out calls
      await delay(200);
      
      const filters = {
        status: statusFilter
      };
      
      // Only add search if there's actually a search term
      if (searchTerm.trim()) {
        filters.search = searchTerm;
      }
      
      console.log('Fetching with filters:', filters);
      console.log('Current statusFilter:', statusFilter);
      
      const data = await experienceService.getAll(filters);
      // Temporary logging to debug data structure
      if (data && !data.experiences) {
        console.log('API Response structure:', data);
        console.log('Available keys:', Object.keys(data));
      }
      console.log('Received experiences count:', data.experiences?.length || 0);
      setExperiences(data.experiences || data.data || []);
    } catch (error) {
      console.error('Failed to fetch experiences:', error);
      
      // Only show error toast if it's not a rate limit error
      if (!error.message?.includes('Too many requests')) {
        toast({
          title: 'Error',
          description: 'Failed to load experiences',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      } else {
        // For rate limit errors, just log and wait
        console.warn('Rate limit hit, will retry automatically');
        
        // Retry after a longer delay
        setTimeout(() => {
          fetchExperiences();
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchTerm]); // Remove toast from dependencies

  // Initial fetch and fetch when filters change
  useEffect(() => {
    // Prevent multiple API calls in React Strict Mode
    let isCancelled = false;
    let timeoutId;
    
    const loadExperiences = async () => {
      if (!isCancelled) {
        await fetchExperiences();
      }
    };
    
    // Add a delay to reduce rapid successive calls
    timeoutId = setTimeout(loadExperiences, 300);
    
    return () => {
      isCancelled = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [fetchExperiences]); // Watch fetchExperiences which already has statusFilter and searchTerm dependencies

  const handleStatusChange = (newStatus) => {
    console.log('Status filter changed to:', newStatus);
    setStatusFilter(newStatus);
    
    // Update URL parameters
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('status', newStatus);
    console.log('Setting status in URL to:', newStatus);
    setSearchParams(newSearchParams);
  };

  const handleStatusChangeFromAction = async (experienceId, newStatus) => {
    try {
      if (newStatus === 'approved') {
        await experienceService.approve(experienceId);
      } else if (newStatus === 'rejected') {
        await experienceService.reject(experienceId, 'Rejected by admin');
      }
      
      // Refresh the list
      fetchExperiences();
      
      toast({
        title: 'Success',
        description: `Experience ${newStatus} successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    } catch (error) {
      console.error('Failed to update experience status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update experience status',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { colorScheme: 'orange', label: 'Pending' },
      approved: { colorScheme: 'green', label: 'Approved' },
      rejected: { colorScheme: 'red', label: 'Rejected' }
    };
    
    const config = statusConfig[status] || { colorScheme: 'gray', label: status };
    
    return (
      <Badge colorScheme={config.colorScheme} variant="subtle">
        {config.label}
      </Badge>
    );
  };

  const filteredExperiences = experiences.filter(exp => {
    const matchesSearch = (exp.companyName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (exp.jobRole?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (exp.fullName?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || exp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading experiences..." />;
  }

  return (
    <Box p={8} bg="#000000" minH="100vh">
      {/* Header */}
      <Box mb={8}>
        <Heading size="2xl" color="white" mb={2}>Experience Management</Heading>
        <Text color="rgba(255, 255, 255, 0.7)" fontSize="lg">
          Review and moderate student placement experiences
        </Text>
      </Box>

      {/* Filters */}
      <Card mb={8} bg="rgba(28, 28, 30, 0.8)" border="1px solid rgba(255, 255, 255, 0.1)">
        <CardBody>
          <HStack spacing={4}>
            <HStack flex={1}>
              <RiSearchLine color="rgba(255, 255, 255, 0.7)" />
              <Input
                placeholder="Search by company, role, or student name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchExperiences()}
                bg="rgba(255, 255, 255, 0.1)"
                border="1px solid rgba(255, 255, 255, 0.2)"
                color="white"
                _placeholder={{ color: "rgba(255, 255, 255, 0.5)" }}
                _focus={{ borderColor: "rgba(255, 255, 255, 0.4)" }}
              />
            </HStack>
            
            <HStack>
              <RiFilterLine color="rgba(255, 255, 255, 0.7)" />
              <Select
                value={statusFilter}
                onChange={(e) => handleStatusChange(e.target.value)}
                minW="150px"
                bg="rgba(255, 255, 255, 0.1)"
                border="1px solid rgba(255, 255, 255, 0.2)"
                color="white"
                _focus={{ borderColor: "rgba(255, 255, 255, 0.4)" }}
              >
                <option value="pending" style={{backgroundColor: '#1c1c1e', color: 'white'}}>Pending</option>
                <option value="approved" style={{backgroundColor: '#1c1c1e', color: 'white'}}>Approved</option>
                <option value="rejected" style={{backgroundColor: '#1c1c1e', color: 'white'}}>Rejected</option>
              </Select>
            </HStack>
            
            <Button 
              onClick={fetchExperiences} 
              bg="#ff9a56"
              color="white"
              _hover={{ bg: "#ff8a46" }}
            >
              Search
            </Button>
          </HStack>
        </CardBody>
      </Card>

      {/* Results */}
      {filteredExperiences.length === 0 ? (
        <Card bg="rgba(28, 28, 30, 0.8)" border="1px solid rgba(255, 255, 255, 0.1)">
          <CardBody>
            <Alert status="info" bg="rgba(66, 153, 225, 0.2)" color="white">
              <AlertIcon color="#4299e1" />
              No experiences found matching your criteria
            </Alert>
          </CardBody>
        </Card>
      ) : (
        <Card bg="rgba(28, 28, 30, 0.8)" border="1px solid rgba(255, 255, 255, 0.1)">
          <CardBody p={0}>
            <Box overflowX="auto">
              <Table variant="simple" size="md">
                <Thead>
                  <Tr>
                    <Th color="rgba(255, 255, 255, 0.8)" borderColor="rgba(255, 255, 255, 0.1)">Student</Th>
                    <Th color="rgba(255, 255, 255, 0.8)" borderColor="rgba(255, 255, 255, 0.1)">Company</Th>
                    <Th color="rgba(255, 255, 255, 0.8)" borderColor="rgba(255, 255, 255, 0.1)">Role</Th>
                    <Th color="rgba(255, 255, 255, 0.8)" borderColor="rgba(255, 255, 255, 0.1)">Position Type</Th>
                    <Th color="rgba(255, 255, 255, 0.8)" borderColor="rgba(255, 255, 255, 0.1)">Status</Th>
                    <Th color="rgba(255, 255, 255, 0.8)" borderColor="rgba(255, 255, 255, 0.1)">Submitted</Th>
                    <Th color="rgba(255, 255, 255, 0.8)" borderColor="rgba(255, 255, 255, 0.1)">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredExperiences.map((experience) => (
                    <Tr key={experience._id} _hover={{ bg: "rgba(255, 255, 255, 0.05)" }}>
                      <Td borderColor="rgba(255, 255, 255, 0.1)">
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="medium" color="white">{experience.fullName}</Text>
                          <Text fontSize="sm" color="rgba(255, 255, 255, 0.6)">{experience.email}</Text>
                        </VStack>
                      </Td>
                      <Td borderColor="rgba(255, 255, 255, 0.1)">
                        <Text fontWeight="medium" color="white">{experience.companyName}</Text>
                      </Td>
                      <Td borderColor="rgba(255, 255, 255, 0.1)" color="rgba(255, 255, 255, 0.8)">{experience.jobRole}</Td>
                      <Td borderColor="rgba(255, 255, 255, 0.1)" color="rgba(255, 255, 255, 0.8)">{experience.positionType}</Td>
                      <Td borderColor="rgba(255, 255, 255, 0.1)">{getStatusBadge(experience.status)}</Td>
                      <Td borderColor="rgba(255, 255, 255, 0.1)">
                        <Text fontSize="sm" color="rgba(255, 255, 255, 0.6)">
                          {new Date(parseInt(experience._id.substring(0, 8), 16) * 1000).toLocaleDateString()}
                        </Text>
                      </Td>
                      <Td borderColor="rgba(255, 255, 255, 0.1)">
                        <HStack spacing={2}>
                          <IconButton
                            as={RouterLink}
                            to={`/experiences/${experience._id}`}
                            icon={<RiEyeLine />}
                            size="sm"
                            variant="ghost"
                            color="#4299e1"
                            _hover={{ bg: "rgba(66, 153, 225, 0.2)" }}
                            aria-label="View details"
                          />
                          
                          {experience.status === 'pending' && (
                            <>
                              <IconButton
                                icon={<RiCheckLine />}
                                size="sm"
                                variant="ghost"
                                color="#43e97b"
                                _hover={{ bg: "rgba(67, 233, 123, 0.2)" }}
                                aria-label="Approve"
                                onClick={() => handleStatusChangeFromAction(experience._id, 'approved')}
                              />
                              <IconButton
                                icon={<RiCloseLine />}
                                size="sm"
                                variant="ghost"
                                color="#ff3b30"
                                _hover={{ bg: "rgba(255, 59, 48, 0.2)" }}
                                aria-label="Reject"
                                onClick={() => handleStatusChangeFromAction(experience._id, 'rejected')}
                              />
                            </>
                          )}
                          
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              icon={<RiMoreLine />}
                              size="sm"
                              variant="ghost"
                              color="rgba(255, 255, 255, 0.7)"
                              _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
                              aria-label="More actions"
                            />
                            <MenuList bg="#1c1c1e" border="1px solid rgba(255, 255, 255, 0.1)">
                              <MenuItem
                                as={RouterLink}
                                to={`/experiences/${experience._id}`}
                                icon={<RiEyeLine />}
                                bg="#1c1c1e"
                                color="white"
                                _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
                              >
                                View Details
                              </MenuItem>
                              {experience.status !== 'pending' && (
                              <MenuItem
                                icon={<RiCloseLine />}
                                onClick={() => handleStatusChangeFromAction(experience._id, 'pending')}
                                bg="#1c1c1e"
                                color="white"
                                _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
                              >
                                  Reset to Pending
                                </MenuItem>
                              )}
                            </MenuList>
                          </Menu>
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </CardBody>
        </Card>
      )}
    </Box>
  );
};

export default Experiences;