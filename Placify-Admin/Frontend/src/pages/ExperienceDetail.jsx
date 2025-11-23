import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  HStack,
  VStack,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Divider,
  Textarea,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  useToast,
  Grid,
  GridItem,
  Link,
  OrderedList,
  ListItem,
  UnorderedList,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from '@chakra-ui/react';
import {
  RiArrowLeftLine,
  RiCheckLine,
  RiCloseLine,
  RiCalendarLine,
  RiMapPinLine,
  RiUserLine,
  RiMailLine,
  RiBriefcaseLine,
  RiSchoolLine,
  RiLinkedinBoxLine,
  RiStarLine,
  RiShieldCheckLine
} from 'react-icons/ri';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { experienceService } from '../services/experienceService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ExperienceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [moderationNotes, setModerationNotes] = useState('');
  const [togglingBadge, setTogglingBadge] = useState(false);

  useEffect(() => {
    fetchExperience();
  }, [id]);

  const fetchExperience = async () => {
    try {
      const data = await experienceService.getById(id);
      setExperience(data.experience || data);
      setModerationNotes(data.experience?.moderationNotes || data.moderationNotes || '');
    } catch (error) {
      console.error('Failed to fetch experience:', error);
      toast({
        title: 'Error',
        description: 'Failed to load experience details',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      navigate('/experiences');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      
      // Use the new updateStatus method for all status changes
      await experienceService.updateStatus(id, newStatus, moderationNotes);
      
      toast({
        title: 'Success',
        description: `Experience ${newStatus} successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      
      // Refresh the experience data
      fetchExperience();
    } catch (error) {
      console.error('Failed to update experience status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update experience status',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setUpdating(false);
    }
  };

  const toggleVerificationBadge = async () => {
    try {
      setTogglingBadge(true);
      await experienceService.toggleVerificationBadge(id);
      
      toast({
        title: 'Success',
        description: `Verification badge ${experience.verificationBadge ? 'removed' : 'added'} successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      
      // Refresh the experience data
      fetchExperience();
    } catch (error) {
      console.error('Failed to toggle verification badge:', error);
      toast({
        title: 'Error',
        description: 'Failed to toggle verification badge',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setTogglingBadge(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { colorScheme: 'orange', label: 'Pending Review' },
      approved: { colorScheme: 'green', label: 'Approved' },
      rejected: { colorScheme: 'red', label: 'Rejected' }
    };
    
    const config = statusConfig[status] || { colorScheme: 'gray', label: status };
    
    return (
      <Badge colorScheme={config.colorScheme} variant="solid" fontSize="sm" px={3} py={1}>
        {config.label}
      </Badge>
    );
  };

  const getDifficultyBadge = (difficulty) => {
    const colorMap = {
      'Easy': 'green',
      'Medium': 'orange', 
      'Hard': 'red'
    };
    
    return (
      <Badge colorScheme={colorMap[difficulty] || 'gray'} variant="outline">
        {difficulty}
      </Badge>
    );
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading experience details..." />;
  }

  if (!experience) {
    return (
      <Alert status="error">
        <AlertIcon />
        Experience not found
      </Alert>
    );
  }

  return (
    <Box p={{ base: 4, md: 6 }}>
      {/* Header */}
      <HStack mb={6} flexDirection={{ base: "column", sm: "row" }} align={{ base: "stretch", sm: "center" }} spacing={{ base: 2, sm: 4 }}>
        <Button
          as={RouterLink}
          to="/experiences"
          leftIcon={<RiArrowLeftLine />}
          variant="ghost"
          size={{ base: "sm", md: "md" }}
          w={{ base: "full", sm: "auto" }}
        >
          Back to Experiences
        </Button>
      </HStack>

      <Box mb={6}>
        <VStack align="start" spacing={4}>
          <Heading size={{ base: "md", md: "lg" }} color="white">
            {experience.companyName} - {experience.jobRole}
          </Heading>
          <HStack wrap="wrap" spacing={3}>
            {experience.verificationBadge && (
              <Badge colorScheme="blue" variant="solid">
                <HStack spacing={1}>
                  <RiShieldCheckLine />
                  <Text fontSize={{ base: "xs", md: "sm" }}>Verified</Text>
                </HStack>
              </Badge>
            )}
            {getStatusBadge(experience.status)}
          </HStack>
          <Text color="rgba(255, 255, 255, 0.6)" fontSize={{ base: "sm", md: "md" }}>
            Placement experience submitted by {experience.isAnonymous ? 'Anonymous' : experience.fullName}
          </Text>
        </VStack>
      </Box>

      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={{ base: 4, md: 6 }}>
        {/* Main Content */}
        <VStack spacing={{ base: 4, md: 6 }} align="stretch">
          {/* Company & Position Details */}
          <Card>
            <CardHeader>
              <Heading size="md">Position Details</Heading>
            </CardHeader>
            <CardBody pt={0}>
              <StatGroup>
                <Stat>
                  <StatLabel>Position Type</StatLabel>
                  <StatNumber fontSize="lg">{experience.positionType}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Interview Type</StatLabel>
                  <StatNumber fontSize="lg">{experience.interviewType}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Location</StatLabel>
                  <StatNumber fontSize="lg">{experience.jobLocation}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Package</StatLabel>
                  <StatNumber fontSize="lg">{experience.ctc}</StatNumber>
                </Stat>
              </StatGroup>
              
              <Divider my={4} />
              
              <HStack justify="space-between">
                <Box>
                  <Text fontWeight="semibold">Interview Date</Text>
                  <Text color="gray.600">
                    {new Date(experience.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="semibold">Difficulty Level</Text>
                  {getDifficultyBadge(experience.difficultyLevel)}
                </Box>
                <Box>
                  <Text fontWeight="semibold">Number of Rounds</Text>
                  <Text color="gray.600">{experience.numberOfRounds}</Text>
                </Box>
              </HStack>
            </CardBody>
          </Card>

          {/* Interview Process Details */}
          <Card>
            <CardHeader>
              <Heading size="md">Interview Process</Heading>
            </CardHeader>
            <CardBody pt={0}>
              <Tabs variant="soft-rounded" colorScheme="blue">
                <TabList mb={4}>
                  <Tab>Overview</Tab>
                  <Tab>Round Details</Tab>
                  <Tab>Questions</Tab>
                  <Tab>Preparation</Tab>
                </TabList>
                
                <TabPanels>
                  {/* Overview Tab */}
                  <TabPanel p={0}>
                    <VStack spacing={4} align="stretch">
                      <Box>
                        <Text fontWeight="semibold" mb={2}>Round Types</Text>
                        <HStack wrap="wrap">
                          {experience.roundTypes?.map((type, index) => (
                            <Badge key={index} variant="outline" colorScheme="blue">
                              {type}
                            </Badge>
                          ))}
                        </HStack>
                      </Box>
                      
                      <Divider />
                      
                      <Box>
                        <Text fontWeight="semibold" mb={2}>Overall Experience</Text>
                        <Text whiteSpace="pre-wrap">{experience.overallExperience}</Text>
                      </Box>
                    </VStack>
                  </TabPanel>

                  {/* Round Details Tab */}
                  <TabPanel p={0}>
                    <VStack spacing={4} align="stretch">
                      {experience.rounds?.map((round, index) => (
                        <Box key={index} p={4} border="1px" borderColor="gray.200" borderRadius="md">
                          <Text fontWeight="semibold" mb={2}>
                            Round {index + 1}: {round.name}
                          </Text>
                          <Text whiteSpace="pre-wrap" color="gray.700">
                            {round.description}
                          </Text>
                        </Box>
                      ))}
                      {(!experience.rounds || experience.rounds.length === 0) && (
                        <Text color="gray.500" fontStyle="italic">
                          No detailed round information provided
                        </Text>
                      )}
                    </VStack>
                  </TabPanel>

                  {/* Questions Tab */}
                  <TabPanel p={0}>
                    <VStack spacing={6} align="stretch">
                      {experience.codingQuestions && (
                        <Box>
                          <Text fontWeight="semibold" mb={3} color="blue.600">
                            💻 Coding Questions
                          </Text>
                          <Box p={4} bg="blue.50" borderRadius="md">
                            <Text whiteSpace="pre-wrap">{experience.codingQuestions}</Text>
                          </Box>
                        </Box>
                      )}
                      
                      {experience.technicalQuestions && (
                        <Box>
                          <Text fontWeight="semibold" mb={3} color="green.600">
                            🔧 Technical Questions
                          </Text>
                          <Box p={4} bg="green.50" borderRadius="md">
                            <Text whiteSpace="pre-wrap">{experience.technicalQuestions}</Text>
                          </Box>
                        </Box>
                      )}
                      
                      {experience.hrQuestions && (
                        <Box>
                          <Text fontWeight="semibold" mb={3} color="purple.600">
                            👥 HR Questions
                          </Text>
                          <Box p={4} bg="purple.50" borderRadius="md">
                            <Text whiteSpace="pre-wrap">{experience.hrQuestions}</Text>
                          </Box>
                        </Box>
                      )}
                      
                      {!experience.codingQuestions && !experience.technicalQuestions && !experience.hrQuestions && (
                        <Text color="gray.500" fontStyle="italic">
                          No specific questions provided
                        </Text>
                      )}
                    </VStack>
                  </TabPanel>

                  {/* Preparation Tab */}
                  <TabPanel p={0}>
                    <VStack spacing={6} align="stretch">
                      {experience.resourcesUsed && (
                        <Box>
                          <Text fontWeight="semibold" mb={3} color="orange.600">
                            📚 Resources Used
                          </Text>
                          <Box p={4} bg="orange.50" borderRadius="md">
                            <Text whiteSpace="pre-wrap">{experience.resourcesUsed}</Text>
                          </Box>
                        </Box>
                      )}
                      
                      {experience.tipsForCandidates && (
                        <Box>
                          <Text fontWeight="semibold" mb={3} color="green.600">
                            💡 Tips for Future Candidates
                          </Text>
                          <Box p={4} bg="green.50" borderRadius="md">
                            <Text whiteSpace="pre-wrap">{experience.tipsForCandidates}</Text>
                          </Box>
                        </Box>
                      )}
                      
                      {experience.mistakesToAvoid && (
                        <Box>
                          <Text fontWeight="semibold" mb={3} color="red.600">
                            ⚠️ Mistakes to Avoid
                          </Text>
                          <Box p={4} bg="red.50" borderRadius="md">
                            <Text whiteSpace="pre-wrap">{experience.mistakesToAvoid}</Text>
                          </Box>
                        </Box>
                      )}
                      
                      {!experience.resourcesUsed && !experience.tipsForCandidates && !experience.mistakesToAvoid && (
                        <Text color="gray.500" fontStyle="italic">
                          No preparation guidance provided
                        </Text>
                      )}
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </CardBody>
          </Card>
        </VStack>

        {/* Sidebar */}
        <VStack spacing={6} align="stretch">
          {/* Student Information */}
          <Card>
            <CardHeader>
              <Heading size="md">Student Information</Heading>
            </CardHeader>
            <CardBody pt={0}>
              <VStack spacing={4} align="stretch">
                {!experience.isAnonymous ? (
                  <>
                    <HStack>
                      <RiUserLine />
                      <Box>
                        <Text fontWeight="semibold">{experience.fullName}</Text>
                        <Text fontSize="sm" color="gray.600">
                          {experience.branch} - Batch {experience.batchYear}
                        </Text>
                      </Box>
                    </HStack>
                    
                    <HStack>
                      <RiMailLine />
                      <Text fontSize="sm">{experience.email}</Text>
                    </HStack>
                    
                    <HStack>
                      <RiSchoolLine />
                      <Text fontSize="sm">{experience.collegeName}</Text>
                    </HStack>
                    
                    {experience.linkedinUrl && (
                      <HStack>
                        <RiLinkedinBoxLine />
                        <Link 
                          href={experience.linkedinUrl} 
                          isExternal 
                          fontSize="sm" 
                          color="blue.500"
                        >
                          LinkedIn Profile
                        </Link>
                      </HStack>
                    )}
                  </>
                ) : (
                  <Box p={4} bg="gray.100" borderRadius="md" textAlign="center">
                    <Text fontWeight="semibold" color="gray.600">
                      Anonymous Submission
                    </Text>
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      Student details hidden by request
                    </Text>
                  </Box>
                )}
                
                <Divider />
                
                <HStack>
                  <RiCalendarLine />
                  <Text fontSize="sm" color="gray.600">
                    Submitted {new Date(parseInt(experience._id.substring(0, 8), 16) * 1000).toLocaleDateString()}
                  </Text>
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Moderation */}
          <Card>
            <CardHeader>
              <Heading size="md">Moderation</Heading>
            </CardHeader>
            <CardBody pt={0}>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel fontSize="sm">Moderation Notes</FormLabel>
                  <Textarea
                    value={moderationNotes}
                    onChange={(e) => setModerationNotes(e.target.value)}
                    placeholder="Add notes about this experience..."
                    size="sm"
                    rows={4}
                  />
                </FormControl>
                
                {/* Verification Badge Toggle */}
                <Button
                  leftIcon={<RiShieldCheckLine />}
                  colorScheme={experience.verificationBadge ? 'red' : 'blue'}
                  variant={experience.verificationBadge ? 'outline' : 'solid'}
                  size="sm"
                  w="full"
                  isLoading={togglingBadge}
                  onClick={toggleVerificationBadge}
                >
                  {experience.verificationBadge ? 'Remove Verification Badge' : 'Add Verification Badge'}
                </Button>
                
                {/* Status Change Controls - Available for any status */}
                <VStack spacing={2} w="full">
                  <Text fontSize="sm" fontWeight="semibold" color="gray.600">
                    Change Status:
                  </Text>
                  
                  {experience.status !== 'pending' && (
                    <Button
                      leftIcon={<RiCalendarLine />}
                      colorScheme="orange"
                      variant="outline"
                      size="sm"
                      w="full"
                      isLoading={updating}
                      onClick={() => handleStatusChange('pending')}
                    >
                      Mark as Pending
                    </Button>
                  )}
                  
                  {experience.status !== 'approved' && (
                    <Button
                      leftIcon={<RiCheckLine />}
                      colorScheme="green"
                      variant={experience.status === 'pending' ? 'solid' : 'outline'}
                      size="sm"
                      w="full"
                      isLoading={updating}
                      onClick={() => handleStatusChange('approved')}
                    >
                      {experience.status === 'pending' ? 'Approve Experience' : 'Mark as Approved'}
                    </Button>
                  )}
                  
                  {experience.status !== 'rejected' && (
                    <Button
                      leftIcon={<RiCloseLine />}
                      colorScheme="red"
                      variant="outline"
                      size="sm"
                      w="full"
                      isLoading={updating}
                      onClick={() => handleStatusChange('rejected')}
                    >
                      {experience.status === 'pending' ? 'Reject Experience' : 'Mark as Rejected'}
                    </Button>
                  )}
                </VStack>
                
                {experience.moderatedBy && (
                  <Box p={3} bg="gray.50" borderRadius="md">
                    <Text fontSize="sm" color="gray.600">
                      Moderated by {experience.moderatedBy}
                    </Text>
                    {(experience.approvedAt || experience.rejectedAt) && (
                      <Text fontSize="xs" color="gray.500">
                        {new Date(experience.approvedAt || experience.rejectedAt).toLocaleString()}
                      </Text>
                    )}
                  </Box>
                )}
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Grid>
    </Box>
  );
};

export default ExperienceDetail;