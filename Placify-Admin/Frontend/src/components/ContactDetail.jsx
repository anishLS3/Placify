import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  Textarea,
  Select,
  Divider,
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Heading,
  useToast,
  Alert,
  AlertIcon,
  AlertDescription,
  Flex,
  Icon,
  Tag,
  TagLabel,
  TagLeftIcon,
  Wrap,
  WrapItem,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  FormControl,
  FormLabel,
  Input,
  Grid,
  GridItem,
  Spinner
} from '@chakra-ui/react';
import {
  RiMailLine,
  RiCalendarLine,
  RiTimeLine,
  RiUserLine,
  RiPhoneLine,
  RiMapPinLine,
  RiMessageLine,
  RiSendPlaneLine,
  RiCheckLine,
  RiCloseLine,
  RiAlertLine,
  RiFlagLine,
  RiEditLine,
  RiSaveLine
} from 'react-icons/ri';
import { contactService } from '../services/contactService';

const ContactDetail = ({ isOpen, onClose, contactId, onUpdate }) => {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [replying, setReplying] = useState(false);
  const [reply, setReply] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('general');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [notes, setNotes] = useState('');
  const toast = useToast();

  useEffect(() => {
    if (contactId && isOpen) {
      fetchContactDetails();
    }
  }, [contactId, isOpen]);

  const fetchContactDetails = async () => {
    try {
      setLoading(true);
      const response = await contactService.getById(contactId);
      const contactData = response.contact;
      setContact(contactData);
      setStatus(contactData.status || 'new');
      setPriority(contactData.priority || 'medium');
      setCategory(contactData.category || 'general');
      setTags(contactData.tags || []);
      setNotes(contactData.notes || '');
    } catch (error) {
      console.error('Failed to fetch contact details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load contact details',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true);
      await contactService.updateStatus(contactId, newStatus);
      setStatus(newStatus);
      setContact(prev => ({ ...prev, status: newStatus }));
      
      toast({
        title: 'Success',
        description: `Contact status updated to ${newStatus}`,
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Failed to update status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update contact status',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleReply = async () => {
    if (!reply.trim()) {
      toast({
        title: 'Warning',
        description: 'Please enter a reply message',
        status: 'warning',
        duration: 3000,
        isClosable: true
      });
      return;
    }

    try {
      setReplying(true);
      await contactService.respond(contactId, reply);
      
      setContact(prev => ({
        ...prev,
        response: reply,
        respondedAt: new Date().toISOString(),
        status: 'resolved'
      }));
      
      setReply('');
      setStatus('resolved');
      
      toast({
        title: 'Success',
        description: 'Reply sent successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Failed to send reply:', error);
      toast({
        title: 'Error',
        description: 'Failed to send reply',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setReplying(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const getStatusColor = (status) => {
    const colors = {
      'new': 'blue',
      'in-progress': 'orange',
      'resolved': 'green',
      'closed': 'gray'
    };
    return colors[status] || 'gray';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'low': 'green',
      'medium': 'orange',
      'high': 'red',
      'urgent': 'purple'
    };
    return colors[priority] || 'gray';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!contact && loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalBody py={20}>
            <VStack spacing={4}>
              <Spinner size="xl" />
              <Text>Loading contact details...</Text>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  if (!contact) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack spacing={3}>
            <Avatar name={contact.name} size="sm" />
            <Box>
              <Text fontSize="lg" fontWeight="bold">{contact.name}</Text>
              <Text fontSize="sm" color="gray.500">{contact.email}</Text>
              <Text fontSize="sm" color="blue.600" fontWeight="medium">
                {contact.extractedSubject || contact.subject || 'No subject'}
              </Text>
            </Box>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <Grid templateColumns="2fr 1fr" gap={6}>
            {/* Main Content */}
            <Box>
              <VStack spacing={6} align="stretch">
                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <Heading size="md">Contact Information</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <HStack>
                        <Icon as={RiUserLine} color="blue.500" />
                        <Box>
                          <Text fontWeight="semibold">Name</Text>
                          <Text>{contact.name}</Text>
                        </Box>
                      </HStack>
                      
                      <HStack>
                        <Icon as={RiMailLine} color="blue.500" />
                        <Box>
                          <Text fontWeight="semibold">Email</Text>
                          <Text>{contact.email}</Text>
                        </Box>
                      </HStack>
                      
                      {contact.subject && (
                        <HStack>
                          <Icon as={RiMessageLine} color="blue.500" />
                          <Box>
                            <Text fontWeight="semibold">Subject</Text>
                            <Text>{contact.subject}</Text>
                          </Box>
                        </HStack>
                      )}
                      
                      <HStack>
                        <Icon as={RiCalendarLine} color="blue.500" />
                        <Box>
                          <Text fontWeight="semibold">Submitted</Text>
                          <Text>{formatDate(contact.createdAt || contact.date)}</Text>
                        </Box>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Subject */}
                <Card>
                  <CardHeader>
                    <Heading size="md">Subject</Heading>
                  </CardHeader>
                  <CardBody>
                    <Text fontWeight="medium" fontSize="lg">
                      {contact.extractedSubject || contact.subject || 'No subject'}
                    </Text>
                  </CardBody>
                </Card>

                {/* Message */}
                <Card>
                  <CardHeader>
                    <Heading size="md">Message</Heading>
                  </CardHeader>
                  <CardBody>
                    <Text whiteSpace="pre-wrap" lineHeight="1.6">
                      {contact.cleanMessage || contact.message}
                    </Text>
                  </CardBody>
                </Card>

                {/* Previous Response (if any) */}
                {contact.response && (
                  <Card>
                    <CardHeader>
                      <HStack>
                        <Heading size="md">Previous Response</Heading>
                        <Badge colorScheme="green">Responded</Badge>
                      </HStack>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={3} align="stretch">
                        <Text whiteSpace="pre-wrap" lineHeight="1.6">
                          {contact.response}
                        </Text>
                        {contact.respondedAt && (
                          <Text fontSize="sm" color="gray.500">
                            Responded on: {formatDate(contact.respondedAt)}
                          </Text>
                        )}
                      </VStack>
                    </CardBody>
                  </Card>
                )}

                {/* Reply Section */}
                <Card>
                  <CardHeader>
                    <Heading size="md">
                      {contact.response ? 'Add Follow-up Response' : 'Send Response'}
                    </Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4}>
                      <Textarea
                        placeholder="Type your response here..."
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        rows={6}
                        resize="vertical"
                      />
                      <HStack justify="space-between" w="full">
                        <Button
                          leftIcon={<RiMailLine />}
                          onClick={() => {
                            window.open(`mailto:${contact.email}?subject=Re: ${contact.subject || 'Contact Inquiry'}&body=Hello ${contact.name},%0D%0A%0D%0A`);
                          }}
                          variant="outline"
                        >
                          Reply via Email
                        </Button>
                        <Button
                          leftIcon={<RiSendPlaneLine />}
                          colorScheme="blue"
                          onClick={handleReply}
                          isLoading={replying}
                          loadingText="Sending..."
                          isDisabled={!reply.trim()}
                        >
                          Send Response
                        </Button>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            </Box>

            {/* Sidebar */}
            <Box>
              <VStack spacing={6} align="stretch">
                {/* Status & Priority */}
                <Card>
                  <CardHeader>
                    <Heading size="sm">Status & Priority</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4}>
                      <FormControl>
                        <FormLabel fontSize="sm">Status</FormLabel>
                        <Select
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          size="sm"
                        >
                          <option value="new">New</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </Select>
                      </FormControl>
                      
                      <FormControl>
                        <FormLabel fontSize="sm">Priority</FormLabel>
                        <Select
                          value={priority}
                          onChange={(e) => setPriority(e.target.value)}
                          size="sm"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </Select>
                      </FormControl>
                      
                      <FormControl>
                        <FormLabel fontSize="sm">Category</FormLabel>
                        <Select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          size="sm"
                        >
                          <option value="general">General</option>
                          <option value="technical">Technical</option>
                          <option value="account">Account</option>
                          <option value="feedback">Feedback</option>
                          <option value="bug-report">Bug Report</option>
                          <option value="feature-request">Feature Request</option>
                        </Select>
                      </FormControl>

                      <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={() => handleStatusUpdate(status)}
                        isLoading={updating}
                        leftIcon={<RiSaveLine />}
                        w="full"
                      >
                        Update Status
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <Heading size="sm">Quick Actions</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={2}>
                      <Button
                        size="sm"
                        leftIcon={<RiCheckLine />}
                        colorScheme="green"
                        variant="outline"
                        w="full"
                        onClick={() => handleStatusUpdate('resolved')}
                        isLoading={updating}
                      >
                        Mark Resolved
                      </Button>
                      
                      <Button
                        size="sm"
                        leftIcon={<RiEditLine />}
                        colorScheme="orange"
                        variant="outline"
                        w="full"
                        onClick={() => handleStatusUpdate('in-progress')}
                        isLoading={updating}
                      >
                        Mark In Progress
                      </Button>
                      
                      <Button
                        size="sm"
                        leftIcon={<RiCloseLine />}
                        colorScheme="gray"
                        variant="outline"
                        w="full"
                        onClick={() => handleStatusUpdate('closed')}
                        isLoading={updating}
                      >
                        Close Contact
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Contact Meta */}
                <Card>
                  <CardHeader>
                    <Heading size="sm">Details</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={3} align="stretch">
                      <HStack justify="space-between">
                        <Text fontSize="sm" color="gray.600">Status:</Text>
                        <Badge colorScheme={getStatusColor(contact.status)}>
                          {contact.status || 'new'}
                        </Badge>
                      </HStack>
                      
                      <HStack justify="space-between">
                        <Text fontSize="sm" color="gray.600">Priority:</Text>
                        <Badge colorScheme={getPriorityColor(priority)}>
                          {priority}
                        </Badge>
                      </HStack>
                      
                      <HStack justify="space-between">
                        <Text fontSize="sm" color="gray.600">Category:</Text>
                        <Badge variant="outline">
                          {category}
                        </Badge>
                      </HStack>
                      
                      <HStack justify="space-between">
                        <Text fontSize="sm" color="gray.600">Has Response:</Text>
                        <Badge colorScheme={contact.response ? 'green' : 'red'}>
                          {contact.response ? 'Yes' : 'No'}
                        </Badge>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Tags */}
                <Card>
                  <CardHeader>
                    <Heading size="sm">Tags</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={3} align="stretch">
                      <Wrap>
                        {tags.map((tag, index) => (
                          <WrapItem key={index}>
                            <Tag size="sm" colorScheme="blue" variant="solid">
                              <TagLabel>{tag}</TagLabel>
                              <Button
                                size="xs"
                                ml={1}
                                onClick={() => removeTag(tag)}
                                variant="ghost"
                                p={0}
                                minW="auto"
                                h="auto"
                              >
                                ×
                              </Button>
                            </Tag>
                          </WrapItem>
                        ))}
                      </Wrap>
                      
                      <HStack>
                        <Input
                          placeholder="Add tag"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          size="sm"
                          onKeyPress={(e) => e.key === 'Enter' && addTag()}
                        />
                        <Button size="sm" onClick={addTag}>
                          Add
                        </Button>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            </Box>
          </Grid>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ContactDetail;