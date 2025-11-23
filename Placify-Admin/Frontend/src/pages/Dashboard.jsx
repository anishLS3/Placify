import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Heading,
  Text,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  VStack,
  HStack,
  Icon,
  Button,
  Badge
} from '@chakra-ui/react';
import { 
  RiFileTextLine, 
  RiCheckLine, 
  RiCloseLine, 
  RiTimeLine,
  RiEyeLine
} from 'react-icons/ri';
import { Link as RouterLink } from 'react-router-dom';
import { experienceService } from '../services/experienceService';
import { analyticsService } from '../services/analyticsService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentExperiences, setRecentExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Prevent multiple API calls in React Strict Mode
    let isCancelled = false;
    
    const fetchDashboardData = async () => {
      if (isCancelled) return;
      
      try {
        console.log('Fetching recent experiences...');
        const recentData = await experienceService.getRecent(5);
        
        if (recentData.success && !isCancelled) {
          setRecentExperiences(recentData.experiences);
        }
        
        // Add delay between API calls to prevent rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));
        
        if (isCancelled) return;
        
        console.log('Fetching dashboard stats...');
        // Try the dashboard stats endpoint first
        try {
          const statsResponse = await experienceService.getStats();
          if (statsResponse && (statsResponse.total > 0 || statsResponse.pending > 0 || statsResponse.approved > 0)) {
            console.log('Dashboard stats from stats endpoint:', statsResponse);
            setStats({
              total: statsResponse.total || 0,
              pending: statsResponse.pending || 0,
              approved: statsResponse.approved || 0,
              rejected: statsResponse.rejected || 0
            });
            return;
          }
        } catch (error) {
          console.log('Stats endpoint failed, trying alternative approach:', error.message);
        }
        
        console.log('Fetching all experiences for dashboard stats...');
        // Fetch all experiences without pagination to get accurate counts
        const [allExperiences, pendingExperiences, approvedExperiences, rejectedExperiences] = await Promise.all([
          experienceService.getAll({ limit: 1000 }), // Get all experiences
          experienceService.getByStatus('pending', 1, 1000),
          experienceService.getByStatus('approved', 1, 1000), 
          experienceService.getByStatus('rejected', 1, 1000)
        ]);
        
        if (allExperiences.success) {
          const total = allExperiences.pagination?.totalRecords || allExperiences.experiences?.length || 0;
          const pending = pendingExperiences.success ? (pendingExperiences.pagination?.totalRecords || pendingExperiences.experiences?.length || 0) : 0;
          const approved = approvedExperiences.success ? (approvedExperiences.pagination?.totalRecords || approvedExperiences.experiences?.length || 0) : 0;
          const rejected = rejectedExperiences.success ? (rejectedExperiences.pagination?.totalRecords || rejectedExperiences.experiences?.length || 0) : 0;
          
          console.log('Dashboard stats calculated from experiences API:', { total, pending, approved, rejected });
          
          setStats({
            total,
            pending,
            approved,
            rejected
          });
        } else {
          throw new Error('Experiences API failed');
        }
        
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        
        // Show accurate empty state - no fake approved data
        const emptyStats = {
          total: 0,
          pending: 0,
          approved: 0,
          rejected: 0
        };
        
        setStats(emptyStats);
        console.log('Using empty state (no data available):', emptyStats);
        
        if (!recentExperiences.length) {
          // Don't show fake data - keep empty for professional appearance
          setRecentExperiences([]);
        }
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchDashboardData, 100);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading dashboard..." />;
  }

  return (
    <Box p={8} bg="#000000" minH="100vh">
      {/* Simple Header */}
      <Box mb={10}>
        <Heading size="2xl" color="white" mb={2}>
          Dashboard
        </Heading>
        <Text color="rgba(255, 255, 255, 0.7)" fontSize="lg">
          Welcome back. Here's an overview of your platform.
        </Text>
      </Box>

      {/* Simple Stats Cards */}
      <Grid 
        templateColumns={{ 
          base: "1fr", 
          sm: "repeat(2, 1fr)", 
          lg: "repeat(4, 1fr)" 
        }} 
        gap={{ base: 4, md: 8 }} 
        mb={10}
      >
        <Card bg="rgba(28, 28, 30, 0.8)" border="1px solid rgba(255, 255, 255, 0.1)">
          <CardBody>
            <Stat>
              <HStack mb={4}>
                <Icon as={RiFileTextLine} color="white" boxSize={6} />
                <StatLabel color="rgba(255, 255, 255, 0.8)" fontSize="sm">
                  Total Experiences
                </StatLabel>
              </HStack>
              <StatNumber color="white" fontSize="3xl">
                {stats?.total || 0}
              </StatNumber>
              <StatHelpText color="rgba(255, 255, 255, 0.6)">
                All submitted experiences
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg="rgba(28, 28, 30, 0.8)" border="1px solid rgba(255, 255, 255, 0.1)">
          <CardBody>
            <Stat>
              <HStack mb={4}>
                <Icon as={RiTimeLine} color="#ff9a56" boxSize={6} />
                <StatLabel color="rgba(255, 255, 255, 0.8)" fontSize="sm">
                  Pending Review
                </StatLabel>
              </HStack>
              <StatNumber color="white" fontSize="3xl">
                {stats?.pending || 0}
              </StatNumber>
              <StatHelpText color="rgba(255, 255, 255, 0.6)">
                Awaiting approval
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg="rgba(28, 28, 30, 0.8)" border="1px solid rgba(255, 255, 255, 0.1)">
          <CardBody>
            <Stat>
              <HStack mb={4}>
                <Icon as={RiCheckLine} color="#43e97b" boxSize={6} />
                <StatLabel color="rgba(255, 255, 255, 0.8)" fontSize="sm">
                  Approved
                </StatLabel>
              </HStack>
              <StatNumber color="white" fontSize="3xl">
                {stats?.approved || 0}
              </StatNumber>
              <StatHelpText color="rgba(255, 255, 255, 0.6)">
                Successfully approved
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg="rgba(28, 28, 30, 0.8)" border="1px solid rgba(255, 255, 255, 0.1)">
          <CardBody>
            <Stat>
              <HStack mb={4}>
                <Icon as={RiCloseLine} color="#ff3b30" boxSize={6} />
                <StatLabel color="rgba(255, 255, 255, 0.8)" fontSize="sm">
                  Rejected
                </StatLabel>
              </HStack>
              <StatNumber color="white" fontSize="3xl">
                {stats?.rejected || 0}
              </StatNumber>
              <StatHelpText color="rgba(255, 255, 255, 0.6)">
                Needs improvement
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </Grid>

      {/* Quick Actions */}
      <Box mb={10}>
        <Heading size="lg" color="white" mb={6}>
          Quick Actions
        </Heading>
        <HStack spacing={4}>
          <Button
            as={RouterLink}
            to="/experiences?status=pending"
            size="lg"
            leftIcon={<Icon as={RiTimeLine} />}
            bg="#ff9a56"
            color="white"
            _hover={{ bg: "#ff8a46" }}
          >
            Review Pending ({stats?.pending || 0})
          </Button>
          
          <Button
            as={RouterLink}
            to="/experiences"
            size="lg"
            leftIcon={<Icon as={RiEyeLine} />}
            bg="rgba(255, 255, 255, 0.1)"
            color="white"
            _hover={{ bg: "rgba(255, 255, 255, 0.2)" }}
          >
            View All Experiences
          </Button>
        </HStack>
      </Box>

      {/* Recent Activity */}
      {recentExperiences.length > 0 && (
        <Box>
          <Heading size="lg" color="white" mb={6}>
            Recent Activity
          </Heading>
          <Card bg="rgba(28, 28, 30, 0.8)" border="1px solid rgba(255, 255, 255, 0.1)">
            <CardBody>
              <VStack spacing={4} align="stretch">
                {recentExperiences.map((experience) => (
                  <Box 
                    key={experience._id}
                    p={4}
                    borderRadius="lg"
                    bg="rgba(255, 255, 255, 0.05)"
                    border="1px solid rgba(255, 255, 255, 0.1)"
                  >
                    <HStack justify="space-between" mb={2}>
                      <Box>
                        <Text fontWeight="medium" color="white">
                          {experience.company} - {experience.role}
                        </Text>
                        <Text fontSize="sm" color="rgba(255, 255, 255, 0.7)">
                          by {experience.studentName}
                        </Text>
                      </Box>
                      <Badge
                        colorScheme={experience.status === 'approved' ? 'green' : 
                                   experience.status === 'rejected' ? 'red' : 'orange'}
                      >
                        {experience.status}
                      </Badge>
                    </HStack>
                    <Text fontSize="sm" color="rgba(255, 255, 255, 0.5)">
                      {new Date(experience.createdAt).toLocaleString()}
                    </Text>
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;