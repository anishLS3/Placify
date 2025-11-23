import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
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
  VStack,
  HStack,
  Button,
  Input,
  Select,
  useDisclosure,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Grid,
  GridItem
} from '@chakra-ui/react';
import {
  RiEyeLine,
  RiMoreLine,
  RiSearchLine,
  RiMailLine,
  RiDeleteBinLine,
  RiFilterLine,
  RiRefreshLine,
  RiDownloadLine,
  RiUserLine,
  RiMessageLine,
  RiCheckLine
} from 'react-icons/ri';
import { contactService } from '../services/contactService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ContactDetail from '../components/ContactDetail';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [stats, setStats] = useState(null);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    // Prevent multiple API calls in React Strict Mode
    let isCancelled = false;
    
    const loadData = async () => {
      if (!isCancelled) {
        // Load contacts first
        await fetchContacts();
        
        // Add delay before loading stats
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (!isCancelled) {
          await fetchStats();
        }
      }
    };
    
    // Add initial delay to prevent rapid calls
    const timeoutId = setTimeout(loadData, 100);
    
    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      
      // Add small delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const data = await contactService.getAll({
        search: searchTerm,
        status: statusFilter
      });
      setContacts(data.contacts);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
      
      // Only show error toast if it's not a rate limit error
      if (!error.message?.includes('Too many requests')) {
        toast({
          title: 'Error',
          description: 'Failed to load contacts',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      } else {
        console.warn('Rate limit hit for contacts, will retry automatically');
        
        // Retry after delay
        setTimeout(() => {
          fetchContacts();
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Add delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const response = await contactService.getStats();
      setStats(response.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      
      // For stats, we can fail silently since it's not critical
      if (error.message?.includes('Too many requests')) {
        console.warn('Rate limit hit for stats, will retry later');
        
        // Retry stats after longer delay
        setTimeout(() => {
          fetchStats();
        }, 5000);
      }
    }
  };

  useEffect(() => {
    let isCancelled = false;
    
    const delayedSearch = setTimeout(() => {
      if (searchTerm !== undefined && !isCancelled) {
        fetchContacts();
      }
    }, 500);

    return () => {
      isCancelled = true;
      clearTimeout(delayedSearch);
    };
  }, [searchTerm, statusFilter]);

  const handleViewContact = (contactId) => {
    setSelectedContactId(contactId);
    onOpen();
  };

  const handleContactUpdate = () => {
    fetchContacts();
    fetchStats();
  };

  const handleQuickStatusUpdate = async (contactId, newStatus) => {
    try {
      await contactService.updateStatus(contactId, newStatus);
      fetchContacts();
      fetchStats();
      
      toast({
        title: 'Success',
        description: `Contact marked as ${newStatus}`,
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    } catch (error) {
      console.error('Failed to update status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update contact status',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const handleDelete = async (contactId) => {
    try {
      await contactService.delete(contactId);
      setContacts(contacts.filter(c => c._id !== contactId));
      toast({
        title: 'Success',
        description: 'Contact deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    } catch (error) {
      console.error('Failed to delete contact:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete contact',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { colorScheme: 'blue', label: 'New' },
      'in-progress': { colorScheme: 'orange', label: 'In Progress' },
      resolved: { colorScheme: 'green', label: 'Resolved' },
      closed: { colorScheme: 'gray', label: 'Closed' }
    };
    
    const config = statusConfig[status] || { colorScheme: 'gray', label: status || 'New' };
    
    return (
      <Badge colorScheme={config.colorScheme} variant="subtle">
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      low: { colorScheme: 'green', label: 'Low' },
      medium: { colorScheme: 'orange', label: 'Medium' },
      high: { colorScheme: 'red', label: 'High' },
      urgent: { colorScheme: 'purple', label: 'Urgent' }
    };
    
    const config = priorityConfig[priority] || { colorScheme: 'gray', label: 'Medium' };
    
    return (
      <Badge colorScheme={config.colorScheme} variant="outline" size="sm">
        {config.label}
      </Badge>
    );
  };

  const filteredContacts = contacts.filter(contact => {
    const searchMatch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.extractedSubject && contact.extractedSubject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.cleanMessage && contact.cleanMessage.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.message && contact.message.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const statusMatch = !statusFilter || contact.status === statusFilter;
    
    return searchMatch && statusMatch;
  });

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading contacts..." />;
  }

  return (
    <Box p={8} bg="#000000" minH="100vh">
      {/* Header */}
      <Box mb={8}>
        <Heading size="2xl" color="white" mb={2}>Contact Management</Heading>
        <Text color="rgba(255, 255, 255, 0.7)" fontSize="lg">
          Manage contact form submissions and inquiries
        </Text>
      </Box>

      {/* Statistics */}
      {stats && (
        <Grid templateColumns="repeat(4, 1fr)" gap={6} mb={8}>
          <GridItem>
            <Card bg="rgba(28, 28, 30, 0.8)" border="1px solid rgba(255, 255, 255, 0.1)">
              <CardBody>
                <Stat>
                  <StatLabel color="rgba(255, 255, 255, 0.8)">Total Contacts</StatLabel>
                  <StatNumber color="white">{stats.total}</StatNumber>
                  <StatHelpText color="rgba(255, 255, 255, 0.6)">All submissions</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
          
          <GridItem>
            <Card bg="rgba(28, 28, 30, 0.8)" border="1px solid rgba(255, 255, 255, 0.1)">
              <CardBody>
                <Stat>
                  <StatLabel color="rgba(255, 255, 255, 0.8)">New Contacts</StatLabel>
                  <StatNumber color="white">{stats.new}</StatNumber>
                  <StatHelpText color="rgba(255, 255, 255, 0.6)">Require attention</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
          
          <GridItem>
            <Card bg="rgba(28, 28, 30, 0.8)" border="1px solid rgba(255, 255, 255, 0.1)">
              <CardBody>
                <Stat>
                  <StatLabel color="rgba(255, 255, 255, 0.8)">In Progress</StatLabel>
                  <StatNumber color="white">{stats.inProgress}</StatNumber>
                  <StatHelpText color="rgba(255, 255, 255, 0.6)">Being handled</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
          
          <GridItem>
            <Card bg="rgba(28, 28, 30, 0.8)" border="1px solid rgba(255, 255, 255, 0.1)">
              <CardBody>
                <Stat>
                  <StatLabel color="rgba(255, 255, 255, 0.8)">Resolved</StatLabel>
                  <StatNumber color="white">{stats.resolved}</StatNumber>
                  <StatHelpText color="rgba(255, 255, 255, 0.6)">Completed</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      )}

      {/* Search and Filters */}
      <Card mb={8} bg="rgba(28, 28, 30, 0.8)" border="1px solid rgba(255, 255, 255, 0.1)">
        <CardBody>
          <Flex gap={4} wrap="wrap">
            <HStack flex={1} minW="300px">
              <RiSearchLine color="rgba(255, 255, 255, 0.7)" />
              <Input
                placeholder="Search by name, email, subject, or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                bg="rgba(255, 255, 255, 0.1)"
                border="1px solid rgba(255, 255, 255, 0.2)"
                color="white"
                _placeholder={{ color: "rgba(255, 255, 255, 0.5)" }}
                _focus={{ borderColor: "rgba(255, 255, 255, 0.4)" }}
              />
            </HStack>
            
            <Select
              placeholder="All Statuses"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              w="200px"
              bg="rgba(255, 255, 255, 0.1)"
              border="1px solid rgba(255, 255, 255, 0.2)"
              color="white"
              _focus={{ borderColor: "rgba(255, 255, 255, 0.4)" }}
            >
              <option value="new" style={{backgroundColor: '#1c1c1e', color: 'white'}}>New</option>
              <option value="in-progress" style={{backgroundColor: '#1c1c1e', color: 'white'}}>In Progress</option>
              <option value="resolved" style={{backgroundColor: '#1c1c1e', color: 'white'}}>Resolved</option>
              <option value="closed" style={{backgroundColor: '#1c1c1e', color: 'white'}}>Closed</option>
            </Select>
            
            <Button
              leftIcon={<RiRefreshLine />}
              onClick={fetchContacts}
              bg="rgba(255, 255, 255, 0.1)"
              color="white"
              border="1px solid rgba(255, 255, 255, 0.2)"
              _hover={{ bg: "rgba(255, 255, 255, 0.2)" }}
            >
              Refresh
            </Button>
          </Flex>
        </CardBody>
      </Card>

      {/* Results */}
      {filteredContacts.length === 0 ? (
        <Card bg="rgba(28, 28, 30, 0.8)" border="1px solid rgba(255, 255, 255, 0.1)">
          <CardBody>
            <Alert status="info" bg="rgba(66, 153, 225, 0.2)" color="white">
              <AlertIcon color="#4299e1" />
              {contacts.length === 0 
                ? 'No contact submissions yet'
                : 'No contacts found matching your search criteria'
              }
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
                    <Th color="rgba(255, 255, 255, 0.8)" borderColor="rgba(255, 255, 255, 0.1)">Contact</Th>
                    <Th color="rgba(255, 255, 255, 0.8)" borderColor="rgba(255, 255, 255, 0.1)">Subject</Th>
                    <Th color="rgba(255, 255, 255, 0.8)" borderColor="rgba(255, 255, 255, 0.1)">Status</Th>
                    <Th color="rgba(255, 255, 255, 0.8)" borderColor="rgba(255, 255, 255, 0.1)">Priority</Th>
                    <Th color="rgba(255, 255, 255, 0.8)" borderColor="rgba(255, 255, 255, 0.1)">Submitted</Th>
                    <Th color="rgba(255, 255, 255, 0.8)" borderColor="rgba(255, 255, 255, 0.1)">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredContacts.map((contact) => (
                    <Tr key={contact._id} _hover={{ bg: "rgba(255, 255, 255, 0.05)" }}>
                      <Td borderColor="rgba(255, 255, 255, 0.1)">
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="medium" color="white">{contact.name}</Text>
                          <Text fontSize="sm" color="rgba(255, 255, 255, 0.6)">{contact.email}</Text>
                        </VStack>
                      </Td>
                      <Td borderColor="rgba(255, 255, 255, 0.1)">
                        <Text noOfLines={2} maxW="250px" color="rgba(255, 255, 255, 0.8)">
                          {contact.extractedSubject || contact.subject || 'No subject'}
                        </Text>
                      </Td>
                      <Td borderColor="rgba(255, 255, 255, 0.1)">{getStatusBadge(contact.status)}</Td>
                      <Td borderColor="rgba(255, 255, 255, 0.1)">{getPriorityBadge(contact.priority)}</Td>
                      <Td borderColor="rgba(255, 255, 255, 0.1)">
                        <Text fontSize="sm" color="rgba(255, 255, 255, 0.6)">
                          {new Date(contact.createdAt || contact.date).toLocaleDateString()}
                        </Text>
                      </Td>
                      <Td borderColor="rgba(255, 255, 255, 0.1)">
                        <HStack spacing={2}>
                          <IconButton
                            icon={<RiEyeLine />}
                            size="sm"
                            variant="ghost"
                            color="#4299e1"
                            _hover={{ bg: "rgba(66, 153, 225, 0.2)" }}
                            aria-label="View details"
                            onClick={() => handleViewContact(contact._id)}
                          />
                          
                          <IconButton
                            icon={<RiMailLine />}
                            size="sm"
                            variant="ghost"
                            color="#43e97b"
                            _hover={{ bg: "rgba(67, 233, 123, 0.2)" }}
                            aria-label="Reply"
                            onClick={() => {
                              const subject = contact.extractedSubject && contact.extractedSubject !== 'No subject' 
                                ? contact.extractedSubject 
                                : 'Contact Inquiry';
                              window.open(`mailto:${contact.email}?subject=Re: ${subject}`);
                            }}
                          />
                          
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
                                icon={<RiEyeLine />}
                                onClick={() => handleViewContact(contact._id)}
                                bg="#1c1c1e"
                                color="white"
                                _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
                              >
                                View Details
                              </MenuItem>
                              <MenuItem 
                                icon={<RiMailLine />}
                                onClick={() => {
                                  window.open(`mailto:${contact.email}?subject=Re: ${contact.subject || 'Contact Inquiry'}`);
                                }}
                                bg="#1c1c1e"
                                color="white"
                                _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
                              >
                                Reply via Email
                              </MenuItem>
                              <MenuItem
                                icon={<RiCheckLine />}
                                onClick={() => handleQuickStatusUpdate(contact._id, 'resolved')}
                                bg="#1c1c1e"
                                color="white"
                                _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
                              >
                                Mark Resolved
                              </MenuItem>
                              <MenuItem
                                icon={<RiDeleteBinLine />}
                                color="red.400"
                                onClick={() => handleDelete(contact._id)}
                                bg="#1c1c1e"
                                _hover={{ bg: "rgba(255, 59, 48, 0.2)" }}
                              >
                                Delete
                              </MenuItem>
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

      {/* Contact Detail Modal */}
      <ContactDetail
        isOpen={isOpen}
        onClose={onClose}
        contactId={selectedContactId}
        onUpdate={handleContactUpdate}
      />
    </Box>
  );
};

export default Contacts;