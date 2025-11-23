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
  RiMoreLine,
  RiArrowLeftLine,
  RiArrowRightLine
} from 'react-icons/ri';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { experienceService } from '../services/experienceService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Experiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalExperiences, setTotalExperiences] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();
  
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    // Set initial filters from URL params
    const status = searchParams.get('status');
    const page = searchParams.get('page');
    
    if (status) {
      setStatusFilter(status);
    } else {
      setStatusFilter('pending');
    }
    
    if (page) {
      setCurrentPage(parseInt(page, 10));
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
        status: statusFilter,
        page: currentPage,
        limit: ITEMS_PER_PAGE
      };
      
      // Only add search if there's actually a search term
      if (searchTerm.trim()) {
        filters.search = searchTerm;
      }
      
      console.log('Fetching with filters:', filters);
      console.log('Current statusFilter:', statusFilter);
      console.log('Current page:', currentPage);
      
      const data = await experienceService.getAll(filters);
      // Temporary logging to debug data structure
      if (data && !data.experiences) {
        console.log('API Response structure:', data);
        console.log('Available keys:', Object.keys(data));
      }
      console.log('Received experiences count:', data.experiences?.length || 0);
      console.log('Total experiences from API:', data.pagination?.totalRecords || data.total);
      
      setExperiences(data.experiences || data.data || []);
      setTotalExperiences(data.pagination?.totalRecords || data.total || 0);
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
  }, [statusFilter, searchTerm, currentPage]); // Add currentPage to dependencies

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
    setCurrentPage(1); // Reset to first page when changing filters
    
    // Update URL parameters
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('status', newStatus);
    newSearchParams.set('page', '1');
    console.log('Setting status in URL to:', newStatus);
    setSearchParams(newSearchParams);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    
    // Update URL parameters
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', newPage.toString());
    setSearchParams(newSearchParams);
    
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
    fetchExperiences();
  };

  // Calculate pagination info
  const totalPages = Math.ceil(totalExperiences / ITEMS_PER_PAGE);
  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalExperiences);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);
      
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push('...');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
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

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading experiences..." />;
  }

  return (
    <Box p={{ base: 4, md: 8 }} bg="#000000" minH="100vh">
      {/* Header */}
      <Box mb={8}>
        <Heading size={{ base: "xl", md: "2xl" }} color="white" mb={2}>Experience Management</Heading>
        <Text color="rgba(255, 255, 255, 0.7)" fontSize={{ base: "md", md: "lg" }}>
          Review and moderate student placement experiences
        </Text>
      </Box>

      {/* Filters */}
      <Card mb={8} bg="rgba(28, 28, 30, 0.8)" border="1px solid rgba(255, 255, 255, 0.1)">
        <CardBody>
          <VStack spacing={4} align="stretch">
            <HStack spacing={4} flexWrap={{ base: "wrap", md: "nowrap" }}>
              <HStack flex={1} minW={{ base: "100%", md: "auto" }}>
                <RiSearchLine color="rgba(255, 255, 255, 0.7)" />
                <Input
                  placeholder="Search by company, role, or student name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  bg="rgba(255, 255, 255, 0.1)"
                  border="1px solid rgba(255, 255, 255, 0.2)"
                  color="white"
                  _placeholder={{ color: "rgba(255, 255, 255, 0.5)" }}
                  _focus={{ borderColor: "rgba(255, 255, 255, 0.4)" }}
                />
              </HStack>
              
              <HStack spacing={4} flexWrap={{ base: "wrap", md: "nowrap" }} w={{ base: "100%", md: "auto" }}>
                <RiFilterLine color="rgba(255, 255, 255, 0.7)" />
                <Select
                  value={statusFilter}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  minW={{ base: "100%", md: "150px" }}
                  bg="rgba(255, 255, 255, 0.1)"
                  border="1px solid rgba(255, 255, 255, 0.2)"
                  color="white"
                  _focus={{ borderColor: "rgba(255, 255, 255, 0.4)" }}
                >
                  <option value="pending" style={{backgroundColor: '#1c1c1e', color: 'white'}}>Pending</option>
                  <option value="approved" style={{backgroundColor: '#1c1c1e', color: 'white'}}>Approved</option>
                  <option value="rejected" style={{backgroundColor: '#1c1c1e', color: 'white'}}>Rejected</option>
                </Select>
                
                <Button 
                  onClick={handleSearch} 
                  bg="#ff9a56"
                  color="white"
                  _hover={{ bg: "#ff8a46" }}
                  w={{ base: "100%", md: "auto" }}
                >
                  Search
                </Button>
              </HStack>
            </HStack>
          </VStack>
        </CardBody>
      </Card>

      {/* Results */}
      {experiences.length === 0 ? (
        <Card bg="rgba(28, 28, 30, 0.8)" border="1px solid rgba(255, 255, 255, 0.1)">
          <CardBody>
            <Alert status="info" bg="rgba(66, 153, 225, 0.2)" color="white">
              <AlertIcon color="#4299e1" />
              No experiences found matching your criteria
            </Alert>
          </CardBody>
        </Card>
      ) : (
        <>
          {/* Results Summary */}
          <Flex mb={4} align="center" justify="space-between">
            <Text color="rgba(255, 255, 255, 0.7)" fontSize="sm">
              Showing {startItem} to {endItem} of {totalExperiences} experiences
            </Text>
            <Text color="rgba(255, 255, 255, 0.7)" fontSize="sm">
              Page {currentPage} of {totalPages}
            </Text>
          </Flex>

          <Card bg="rgba(28, 28, 30, 0.8)" border="1px solid rgba(255, 255, 255, 0.1)">
            <CardBody p={0}>
              <Box overflowX="auto">
                <Table variant="simple" size={{ base: "sm", md: "md" }}>
                  <Thead>
                    <Tr>
                      <Th color="rgba(255, 255, 255, 0.8)" borderColor="rgba(255, 255, 255, 0.1)">Student</Th>
                      <Th color="rgba(255, 255, 255, 0.8)" borderColor="rgba(255, 255, 255, 0.1)" display={{ base: "none", md: "table-cell" }}>Company</Th>
                      <Th color="rgba(255, 255, 255, 0.8)" borderColor="rgba(255, 255, 255, 0.1)" display={{ base: "none", lg: "table-cell" }}>Role</Th>
                      <Th color="rgba(255, 255, 255, 0.8)" borderColor="rgba(255, 255, 255, 0.1)" display={{ base: "none", lg: "table-cell" }}>Position Type</Th>
                      <Th color="rgba(255, 255, 255, 0.8)" borderColor="rgba(255, 255, 255, 0.1)">Status</Th>
                      <Th color="rgba(255, 255, 255, 0.8)" borderColor="rgba(255, 255, 255, 0.1)" display={{ base: "none", md: "table-cell" }}>Submitted</Th>
                      <Th color="rgba(255, 255, 255, 0.8)" borderColor="rgba(255, 255, 255, 0.1)">Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {experiences.map((experience) => (
                      <Tr key={experience._id} _hover={{ bg: "rgba(255, 255, 255, 0.05)" }}>
                        <Td borderColor="rgba(255, 255, 255, 0.1)">
                          <VStack align="start" spacing={1}>
                            <HStack spacing={2}>
                              <Text fontWeight="medium" color="white">{experience.fullName}</Text>
                              {experience.isNew && (
                                <Badge
                                  bg="#ff9a56"
                                  color="white"
                                  fontSize="xs"
                                  px={2}
                                  py={0.5}
                                  borderRadius="full"
                                  fontWeight="bold"
                                >
                                  NEW
                                </Badge>
                              )}
                            </HStack>
                            <Text fontSize="sm" color="rgba(255, 255, 255, 0.6)">{experience.email}</Text>
                          </VStack>
                        </Td>
                        <Td borderColor="rgba(255, 255, 255, 0.1)" display={{ base: "none", md: "table-cell" }}>
                          <Text fontWeight="medium" color="white">{experience.companyName}</Text>
                        </Td>
                        <Td borderColor="rgba(255, 255, 255, 0.1)" color="rgba(255, 255, 255, 0.8)" display={{ base: "none", lg: "table-cell" }}>{experience.jobRole}</Td>
                        <Td borderColor="rgba(255, 255, 255, 0.1)" color="rgba(255, 255, 255, 0.8)" display={{ base: "none", lg: "table-cell" }}>{experience.positionType}</Td>
                        <Td borderColor="rgba(255, 255, 255, 0.1)">{getStatusBadge(experience.status)}</Td>
                        <Td borderColor="rgba(255, 255, 255, 0.1)" display={{ base: "none", md: "table-cell" }}>
                          <Text fontSize="sm" color="rgba(255, 255, 255, 0.6)">
                            {new Date(parseInt(experience._id.substring(0, 8), 16) * 1000).toLocaleDateString()}
                          </Text>
                        </Td>
                        <Td borderColor="rgba(255, 255, 255, 0.1)">
                          <HStack spacing={{ base: 1, md: 2 }}>
                            <IconButton
                              as={RouterLink}
                              to={`/experiences/${experience._id}`}
                              icon={<RiEyeLine />}
                              size={{ base: "xs", md: "sm" }}
                              variant="ghost"
                              color="#4299e1"
                              _hover={{ bg: "rgba(66, 153, 225, 0.2)" }}
                              aria-label="View details"
                            />
                            
                            {experience.status === 'pending' && (
                              <>
                                <IconButton
                                  icon={<RiCheckLine />}
                                  size={{ base: "xs", md: "sm" }}
                                  variant="ghost"
                                  color="#43e97b"
                                  _hover={{ bg: "rgba(67, 233, 123, 0.2)" }}
                                  aria-label="Approve"
                                  onClick={() => handleStatusChangeFromAction(experience._id, 'approved')}
                                />
                                <IconButton
                                  icon={<RiCloseLine />}
                                  size={{ base: "xs", md: "sm" }}
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Flex 
              justify="center" 
              align="center" 
              mt={8} 
              gap={{ base: 1, md: 2 }}
              flexWrap="wrap"
            >
              <IconButton
                icon={<RiArrowLeftLine />}
                onClick={() => handlePageChange(currentPage - 1)}
                isDisabled={currentPage === 1}
                bg="rgba(255, 255, 255, 0.1)"
                color="white"
                border="1px solid rgba(255, 255, 255, 0.2)"
                _hover={{ bg: "rgba(255, 255, 255, 0.2)" }}
                _disabled={{ opacity: 0.4, cursor: "not-allowed" }}
                size={{ base: "xs", md: "sm" }}
                aria-label="Previous page"
              />
              
              <HStack spacing={{ base: 0.5, md: 1 }} flexWrap="wrap">
                {getPageNumbers().map((pageNum, index) => (
                  pageNum === '...' ? (
                    <Text key={index} color="rgba(255, 255, 255, 0.5)" px={{ base: 1, md: 2 }} fontSize={{ base: "xs", md: "sm" }}>
                      ...
                    </Text>
                  ) : (
                    <Button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      size={{ base: "xs", md: "sm" }}
                      variant={currentPage === pageNum ? "solid" : "ghost"}
                      bg={currentPage === pageNum ? "#ff9a56" : "rgba(255, 255, 255, 0.1)"}
                      color="white"
                      border="1px solid rgba(255, 255, 255, 0.2)"
                      _hover={{ 
                        bg: currentPage === pageNum ? "#ff8a46" : "rgba(255, 255, 255, 0.2)" 
                      }}
                      minW={{ base: "8", md: "10" }}
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      {pageNum}
                    </Button>
                  )
                ))}
              </HStack>
              
              <IconButton
                icon={<RiArrowRightLine />}
                onClick={() => handlePageChange(currentPage + 1)}
                isDisabled={currentPage === totalPages}
                bg="rgba(255, 255, 255, 0.1)"
                color="white"
                border="1px solid rgba(255, 255, 255, 0.2)"
                _hover={{ bg: "rgba(255, 255, 255, 0.2)" }}
                _disabled={{ opacity: 0.4, cursor: "not-allowed" }}
                size="sm"
                aria-label="Next page"
              />
            </Flex>
          )}
        </>
      )}
    </Box>
  );
};

export default Experiences;