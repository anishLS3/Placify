import React from 'react';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Grid,
  GridItem,
  Divider,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Switch,
  FormControl,
  FormLabel,
  Textarea,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import {
  FiSearch,
  FiFilter,
  FiDownload,
  FiRefreshCw,
  FiMoreHorizontal,
  FiEdit,
  FiTrash2,
  FiEye,
  FiCheck,
  FiX,
  FiClock,
  FiUser,
  FiMail,
  FiPhone
} from 'react-icons/fi';

/**
 * Presentational Components - Pure UI components without business logic
 * These components receive data and callbacks as props from Container components
 */

// ============ LOADING AND ERROR COMPONENTS ============

export const LoadingSpinner = ({ size = "lg", message = "Loading..." }) => (
  <Box textAlign="center" py={8}>
    <Spinner size={size} mb={4} />
    <Text>{message}</Text>
  </Box>
);

export const ErrorAlert = ({ error, onRetry }) => (
  <Alert status="error" my={4}>
    <AlertIcon />
    <VStack align="start" spacing={2} flex={1}>
      <Text fontWeight="semibold">Error occurred</Text>
      <Text fontSize="sm">{error}</Text>
      {onRetry && (
        <Button size="sm" colorScheme="red" variant="outline" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </VStack>
  </Alert>
);

// ============ STAT CARDS ============

export const StatsGrid = ({ stats }) => (
  <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={6} mb={8}>
    {stats.map((stat, index) => (
      <GridItem key={index}>
        <Stat
          px={4}
          py={5}
          shadow="base"
          border="1px solid"
          borderColor={useColorModeValue("gray.200", "gray.700")}
          rounded="lg"
        >
          <StatLabel color={useColorModeValue("gray.600", "gray.400")}>
            {stat.label}
          </StatLabel>
          <StatNumber fontSize="2xl" fontWeight="medium">
            {stat.value}
          </StatNumber>
          {stat.change && (
            <StatHelpText color={stat.change.type === 'increase' ? 'green.500' : 'red.500'}>
              {stat.change.value}
            </StatHelpText>
          )}
        </Stat>
      </GridItem>
    ))}
  </Grid>
);

// ============ EXPERIENCE LIST PRESENTATIONAL ============

export const ExperienceFilters = ({ filters, onFilterChange, onReset }) => {
  const bgColor = useColorModeValue("white", "gray.800");
  
  return (
    <Card mb={6}>
      <CardHeader>
        <HStack justify="space-between">
          <Heading size="sm">Filters</Heading>
          <Button size="sm" variant="ghost" onClick={onReset}>
            Reset
          </Button>
        </HStack>
      </CardHeader>
      <CardBody>
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)", lg: "repeat(5, 1fr)" }} gap={4}>
          <FormControl>
            <FormLabel fontSize="sm">Status</FormLabel>
            <Select
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              size="sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm">Company</FormLabel>
            <Input
              placeholder="Company name"
              value={filters.company}
              onChange={(e) => onFilterChange('company', e.target.value)}
              size="sm"
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm">Position</FormLabel>
            <Input
              placeholder="Job position"
              value={filters.position}
              onChange={(e) => onFilterChange('position', e.target.value)}
              size="sm"
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm">Sort By</FormLabel>
            <Select
              value={filters.sortBy}
              onChange={(e) => onFilterChange('sortBy', e.target.value)}
              size="sm"
            >
              <option value="createdAt">Date Created</option>
              <option value="company">Company</option>
              <option value="position">Position</option>
              <option value="status">Status</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm">Order</FormLabel>
            <Select
              value={filters.sortOrder}
              onChange={(e) => onFilterChange('sortOrder', e.target.value)}
              size="sm"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </Select>
          </FormControl>
        </Grid>
      </CardBody>
    </Card>
  );
};

export const ExperienceTable = ({ 
  experiences, 
  loading, 
  onStatusUpdate, 
  onView, 
  selectedItems = [],
  onSelectItem,
  onSelectAll 
}) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const toast = useToast();

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'green';
      case 'rejected': return 'red';
      case 'pending': return 'yellow';
      default: return 'gray';
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await onStatusUpdate(id, newStatus);
      toast({
        title: "Status updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to update status",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) return <LoadingSpinner message="Loading experiences..." />;

  return (
    <Card>
      <CardBody p={0}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>
                <input
                  type="checkbox"
                  checked={selectedItems.length === experiences.length && experiences.length > 0}
                  onChange={onSelectAll}
                />
              </Th>
              <Th>Company</Th>
              <Th>Position</Th>
              <Th>Submitted By</Th>
              <Th>Date</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {experiences.map((experience) => (
              <Tr key={experience._id}>
                <Td>
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(experience._id)}
                    onChange={() => onSelectItem(experience._id)}
                  />
                </Td>
                <Td fontWeight="medium">{experience.company}</Td>
                <Td>{experience.position}</Td>
                <Td>{experience.submittedBy?.name || 'Anonymous'}</Td>
                <Td>
                  <Text fontSize="sm" color="gray.500">
                    {new Date(experience.createdAt).toLocaleDateString()}
                  </Text>
                </Td>
                <Td>
                  <Badge colorScheme={getStatusColor(experience.status)}>
                    {experience.status}
                  </Badge>
                  {experience.isNew && (
                    <Badge colorScheme="blue" ml={2}>
                      NEW
                    </Badge>
                  )}
                </Td>
                <Td>
                  <HStack spacing={1}>
                    <IconButton
                      size="sm"
                      variant="ghost"
                      icon={<FiEye />}
                      onClick={() => onView(experience)}
                      aria-label="View details"
                    />
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        size="sm"
                        variant="ghost"
                        icon={<FiMoreHorizontal />}
                        aria-label="More actions"
                      />
                      <MenuList>
                        <MenuItem 
                          icon={<FiCheck />}
                          onClick={() => handleStatusUpdate(experience._id, 'approved')}
                        >
                          Approve
                        </MenuItem>
                        <MenuItem 
                          icon={<FiX />}
                          onClick={() => handleStatusUpdate(experience._id, 'rejected')}
                        >
                          Reject
                        </MenuItem>
                        <MenuItem 
                          icon={<FiClock />}
                          onClick={() => handleStatusUpdate(experience._id, 'pending')}
                        >
                          Mark Pending
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

// ============ USER MANAGEMENT PRESENTATIONAL ============

export const UserFilters = ({ searchQuery, roleFilter, statusFilter, onFilterChange }) => (
  <HStack spacing={4} mb={6}>
    <InputGroup maxW="300px">
      <InputLeftElement>
        <FiSearch />
      </InputLeftElement>
      <Input
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => onFilterChange('search', e.target.value)}
      />
    </InputGroup>
    
    <Select
      value={roleFilter}
      onChange={(e) => onFilterChange('role', e.target.value)}
      maxW="150px"
    >
      <option value="all">All Roles</option>
      <option value="admin">Admin</option>
      <option value="user">User</option>
    </Select>
    
    <Select
      value={statusFilter}
      onChange={(e) => onFilterChange('status', e.target.value)}
      maxW="150px"
    >
      <option value="all">All Status</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </Select>
  </HStack>
);

export const UserTable = ({ users, onRoleUpdate, onStatusToggle, onDelete }) => {
  const toast = useToast();

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      await onRoleUpdate(userId, newRole);
      toast({
        title: "Role updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to update role",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Card>
      <CardBody p={0}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>User</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Status</Th>
              <Th>Joined</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user._id}>
                <Td>
                  <HStack>
                    <Avatar size="sm" name={user.name} />
                    <Text fontWeight="medium">{user.name}</Text>
                  </HStack>
                </Td>
                <Td>{user.email}</Td>
                <Td>
                  <Select
                    value={user.role}
                    onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                    size="sm"
                    width="100px"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </Select>
                </Td>
                <Td>
                  <Switch
                    isChecked={user.isActive}
                    onChange={(e) => onStatusToggle(user._id, e.target.checked)}
                    size="sm"
                  />
                </Td>
                <Td>
                  <Text fontSize="sm" color="gray.500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Text>
                </Td>
                <Td>
                  <IconButton
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    icon={<FiTrash2 />}
                    onClick={() => onDelete(user._id)}
                    aria-label="Delete user"
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

// ============ CONTACT MANAGEMENT PRESENTATIONAL ============

export const ContactCard = ({ contact, onStatusUpdate, onDelete, onMarkRead }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [response, setResponse] = React.useState('');
  const [status, setStatus] = React.useState(contact.status);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const handleStatusUpdate = async () => {
    try {
      await onStatusUpdate(contact._id, status, response);
      onClose();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <>
      <Card mb={4} opacity={contact.isRead ? 1 : 0.7}>
        <CardHeader>
          <HStack justify="space-between">
            <VStack align="start" spacing={1}>
              <HStack>
                <Text fontWeight="bold">{contact.name}</Text>
                {!contact.isRead && (
                  <Badge colorScheme="blue" variant="solid">
                    Unread
                  </Badge>
                )}
                <Badge colorScheme={getPriorityColor(contact.priority)}>
                  {contact.priority} priority
                </Badge>
              </HStack>
              <HStack color="gray.500" fontSize="sm">
                <FiMail />
                <Text>{contact.email}</Text>
                {contact.phone && (
                  <>
                    <FiPhone />
                    <Text>{contact.phone}</Text>
                  </>
                )}
              </HStack>
            </VStack>
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FiMoreHorizontal />}
                variant="ghost"
                size="sm"
              />
              <MenuList>
                <MenuItem onClick={onOpen}>Respond</MenuItem>
                <MenuItem onClick={() => onMarkRead(contact._id)}>
                  Mark as Read
                </MenuItem>
                <MenuItem color="red.500" onClick={() => onDelete(contact._id)}>
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </CardHeader>
        <CardBody pt={0}>
          <Text mb={4}>{contact.message}</Text>
          <HStack justify="space-between" fontSize="sm" color="gray.500">
            <Text>
              {new Date(contact.createdAt).toLocaleDateString()} at{' '}
              {new Date(contact.createdAt).toLocaleTimeString()}
            </Text>
            <Badge colorScheme={contact.status === 'resolved' ? 'green' : 'yellow'}>
              {contact.status}
            </Badge>
          </HStack>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Respond to {contact.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Box>
                <Text fontWeight="bold" mb={2}>Original Message:</Text>
                <Box p={3} bg="gray.50" rounded="md">
                  <Text>{contact.message}</Text>
                </Box>
              </Box>
              
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Response</FormLabel>
                <Textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Type your response here..."
                  rows={4}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleStatusUpdate}>
              Send Response
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

// ============ ANALYTICS PRESENTATIONAL ============

export const AnalyticsCard = ({ title, children, actions }) => (
  <Card>
    <CardHeader>
      <HStack justify="space-between">
        <Heading size="md">{title}</Heading>
        {actions && (
          <HStack spacing={2}>
            {actions}
          </HStack>
        )}
      </HStack>
    </CardHeader>
    <CardBody>
      {children}
    </CardBody>
  </Card>
);

export const MetricsGrid = ({ metrics }) => (
  <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
    {metrics.map((metric, index) => (
      <GridItem key={index}>
        <AnalyticsCard title={metric.title}>
          <VStack align="start" spacing={2}>
            <Text fontSize="3xl" fontWeight="bold" color={metric.color}>
              {metric.value}
            </Text>
            <Text color="gray.500">{metric.description}</Text>
            {metric.change && (
              <Text 
                fontSize="sm" 
                color={metric.change.type === 'increase' ? 'green.500' : 'red.500'}
              >
                {metric.change.value} from last period
              </Text>
            )}
          </VStack>
        </AnalyticsCard>
      </GridItem>
    ))}
  </Grid>
);

// ============ SETTINGS PRESENTATIONAL ============

export const SettingsSection = ({ title, children }) => (
  <Card mb={6}>
    <CardHeader>
      <Heading size="md">{title}</Heading>
    </CardHeader>
    <CardBody>
      {children}
    </CardBody>
  </Card>
);

export const SettingField = ({ label, description, children }) => (
  <FormControl mb={4}>
    <FormLabel>{label}</FormLabel>
    {children}
    {description && (
      <Text fontSize="sm" color="gray.500" mt={1}>
        {description}
      </Text>
    )}
  </FormControl>
);

// ============ PAGINATION COMPONENT ============

export const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  showFirstLast = true,
  showPrevNext = true 
}) => {
  const pages = [];
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <HStack justify="center" spacing={2} mt={6}>
      {showFirstLast && currentPage > 3 && (
        <Button size="sm" onClick={() => onPageChange(1)}>
          First
        </Button>
      )}
      
      {showPrevNext && currentPage > 1 && (
        <Button size="sm" onClick={() => onPageChange(currentPage - 1)}>
          Previous
        </Button>
      )}

      {pages.map(page => (
        <Button
          key={page}
          size="sm"
          variant={page === currentPage ? "solid" : "outline"}
          colorScheme={page === currentPage ? "blue" : "gray"}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      {showPrevNext && currentPage < totalPages && (
        <Button size="sm" onClick={() => onPageChange(currentPage + 1)}>
          Next
        </Button>
      )}

      {showFirstLast && currentPage < totalPages - 2 && (
        <Button size="sm" onClick={() => onPageChange(totalPages)}>
          Last
        </Button>
      )}
    </HStack>
  );
};