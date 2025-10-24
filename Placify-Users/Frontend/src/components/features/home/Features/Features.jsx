import { Box, Container, Heading, Text, Flex, Icon, Button, VStack } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaBook, FaUsers, FaUserTie } from 'react-icons/fa'

const MotionBox = motion(Box)
const MotionHeading = motion(Heading)
const MotionText = motion(Text)
const MotionButton = motion(Button)

const Features = ({ activeCard, setActiveCard }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <Box 
      id="features" 
      py={20}
      bg="white"
      position="relative"
    >
      <Container maxW="container.xl">
        <MotionBox
          display="flex"
          flexDirection={{ base: 'column', lg: 'row' }}
          alignItems="center"
          gap={12}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Left Section - Text Content */}
          <MotionBox
            flex={1}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <MotionBox
              bg="purple.100"
              color="purple.800"
              px={4}
              py={2}
              borderRadius="full"
              fontSize="sm"
              fontWeight="medium"
              display="inline-block"
              mb={6}
            >
              Simplify placement process
            </MotionBox>
            
            <MotionHeading
              fontSize={{ base: '4xl', md: '6xl', lg: '7xl' }}
              fontWeight="bold"
              color="gray.900"
              lineHeight="1.1"
              mb={6}
            >
              All-in-One
              <br />
              platform for
              <br />
              placements
            </MotionHeading>
            
            <MotionText
              fontSize="xl"
              color="gray.600"
              lineHeight="1.6"
              maxW="2xl"
            >
              Streamline your placement journey with our comprehensive all-in-one platform. 
              Simplify preparation, sharing experiences, and connecting with successful candidates effortlessly.
            </MotionText>
          </MotionBox>

          {/* Right Section - Gradient with Interactive Cards */}
          <MotionBox
            flex={1}
            position="relative"
            overflow="hidden"
            borderRadius="2xl"
            bgGradient="linear(to-br, orange.400, purple.500, pink.400)"
            sx={{
              background: 'linear-gradient(135deg, #ff8a80 0%, #805ad5 50%, #f687b3 100%)'
            }}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Background Pattern */}
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              opacity={0.1}
              bgImage="radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 70%)"
            />
            
            <Box p={8} position="relative" zIndex={2}>
              <MotionHeading
                fontSize={{ base: '2xl', md: '4xl' }}
                color="white"
                fontWeight="bold"
                mb={4}
                textShadow="0 2px 4px rgba(0,0,0,0.1)"
              >
                {activeCard === 1 ? "Explore Experience" : activeCard === 2 ? "Preparation Tips" : "Post Experience"}
              </MotionHeading>
              
              <MotionText
                color="whiteAlpha.900"
                fontSize="lg"
                mb={8}
                textShadow="0 1px 2px rgba(0,0,0,0.1)"
              >
                {activeCard === 1 
                  ? "Browse through real placement experiences shared by successful candidates from top companies."
                  : activeCard === 2 
                  ? "Get expert tips and strategies for technical interviews, behavioral questions, and company-specific preparation."
                  : "Share your placement journey and help other students by posting your interview experiences and success stories."
                }
              </MotionText>
              
              {/* Dynamic Card Content */}
              <MotionBox
                bg="white"
                borderRadius="xl"
                p={6}
                boxShadow="2xl"
                position="relative"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                key={activeCard}
                _hover={{
                  "& .overlay-button": {
                    opacity: 1,
                    transform: "translateY(0)"
                  }
                }}
              >
                {activeCard === 1 && (
                  <>
                    {/* Search Bar */}
                    <MotionBox
                      display="flex"
                      alignItems="center"
                      bg="gray.50"
                      borderRadius="lg"
                      p={3}
                      mb={4}
                    >
                      <Icon as={FaBook} w={5} h={5} color="gray.400" mr={3} />
                      <Text color="gray.500" fontSize="sm">Search placement experiences...</Text>
                    </MotionBox>
                    
                    {/* Filter Pills */}
                    <MotionBox
                      bg="white"
                      borderRadius="lg"
                      p={4}
                      boxShadow="lg"
                      position="absolute"
                      top="-10px"
                      right="-10px"
                      minW="180px"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.4 }}
                      zIndex={10}
                    >
                      <Text fontSize="sm" fontWeight="bold" color="gray.700" mb={3}>
                        Experience Filters 6
                      </Text>
                      <Flex flexWrap="wrap" gap={1.5}>
                        {['Success Stories 10', 'Interview Tips 7', 'Company Insights 8', 'Preparation 3', 'Challenges 2', 'Resources 23'].map((filter, index) => (
                          <MotionBox
                            key={index}
                            bg={index === 0 ? "purple.500" : "gray.200"}
                            color={index === 0 ? "white" : "gray.700"}
                            px={2.5}
                            py={1}
                            borderRadius="full"
                            fontSize="xs"
                            fontWeight="medium"
                            whileHover={{ scale: 1.05 }}
                            cursor="pointer"
                          >
                            {filter}
                          </MotionBox>
                        ))}
                      </Flex>
                    </MotionBox>
                    
                    {/* Experience List */}
                    <VStack spacing={3} align="stretch">
                      {[
                        { name: "Sarah Johnson", company: "Google", text: "The technical interview process was challenging but the preparation resources helped me succeed..." },
                        { name: "Mike Chen", company: "Microsoft", text: "Behavioral questions were the key focus. Here's how I prepared for the STAR method..." },
                        { name: "Alex Kumar", company: "Amazon", text: "System design round was intense. These are the concepts that helped me the most..." }
                      ].map((experience, index) => (
                        <MotionBox
                          key={index}
                          display="flex"
                          alignItems="center"
                          p={3}
                          bg="gray.50"
                          borderRadius="lg"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                        >
                          <Box
                            w={8}
                            h={8}
                            bg="purple.500"
                            borderRadius="full"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            mr={3}
                          >
                            <Text color="white" fontSize="xs" fontWeight="bold">
                              {experience.name.charAt(0)}
                            </Text>
                          </Box>
                          <Box flex={1}>
                            <Text fontSize="sm" fontWeight="bold" color="gray.800">
                              {experience.name} - {experience.company}
                            </Text>
                            <Text fontSize="xs" color="gray.600">
                              {experience.text}
                            </Text>
                          </Box>
                        </MotionBox>
                      ))}
                    </VStack>
                  </>
                )}
          
                {activeCard === 2 && (
                  <>
                    {/* Search Bar */}
                    <MotionBox
                      display="flex"
                      alignItems="center"
                      bg="gray.50"
                      borderRadius="lg"
                      p={3}
                      mb={4}
                    >
                      <Icon as={FaBook} w={5} h={5} color="gray.400" mr={3} />
                      <Text color="gray.500" fontSize="sm">Search preparation resources...</Text>
                    </MotionBox>
                    
                    {/* Filter Pills */}
                    <MotionBox
                      bg="white"
                      borderRadius="lg"
                      p={4}
                      boxShadow="lg"
                      position="absolute"
                      top="-10px"
                      right="-10px"
                      minW="180px"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.4 }}
                      zIndex={10}
                    >
                      <Text fontSize="sm" fontWeight="bold" color="gray.700" mb={3}>
                        Prep Categories 6
                      </Text>
                      <Flex flexWrap="wrap" gap={1.5}>
                        {['Technical Prep 8', 'Behavioral 5', 'Company Research 3', 'Mock Tests 2', 'Resources 12', 'Tips 7'].map((filter, index) => (
                          <MotionBox
                            key={index}
                            bg={index === 0 ? "purple.500" : "gray.200"}
                            color={index === 0 ? "white" : "gray.700"}
                            px={2.5}
                            py={1}
                            borderRadius="full"
                            fontSize="xs"
                            fontWeight="medium"
                            whileHover={{ scale: 1.05 }}
                            cursor="pointer"
                          >
                            {filter}
                          </MotionBox>
                        ))}
                      </Flex>
                    </MotionBox>

                    {/* Preparation List */}
                    <VStack spacing={3} align="stretch">
                      {[
                        { name: "Technical Prep", topic: "45% Weightage", text: "Focus on coding problems, algorithms, and data structures. This forms the core of technical interviews..." },
                        { name: "Behavioral Prep", topic: "25% Weightage", text: "STAR method practice, leadership examples, and teamwork scenarios. Essential for cultural fit..." },
                        { name: "System Design", topic: "20% Weightage", text: "High-level system architecture, scalability concepts, and trade-offs. Critical for senior roles..." }
                      ].map((prep, index) => (
                        <MotionBox
                          key={index}
                          display="flex"
                          alignItems="center"
                          p={3}
                          bg="gray.50"
                          borderRadius="lg"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                        >
                          <Box
                            w={8}
                            h={8}
                            bg="purple.500"
                            borderRadius="full"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            mr={3}
                          >
                            <Text color="white" fontSize="xs" fontWeight="bold">
                              {prep.name.charAt(0)}
                            </Text>
                          </Box>
                          <Box flex={1}>
                            <Text fontSize="sm" fontWeight="bold" color="gray.800">
                              {prep.name} - {prep.topic}
                            </Text>
                            <Text fontSize="xs" color="gray.600">
                              {prep.text}
                            </Text>
                          </Box>
                        </MotionBox>
                      ))}
                    </VStack>
                  </>
                )}

                {activeCard === 3 && (
                  <>
                    {/* Search Bar */}
                    <MotionBox
                      display="flex"
                      alignItems="center"
                      bg="gray.50"
                      borderRadius="lg"
                      p={3}
                      mb={4}
                    >
                      <Icon as={FaUserTie} w={5} h={5} color="gray.400" mr={3} />
                      <Text color="gray.500" fontSize="sm">Search success stories...</Text>
                    </MotionBox>
                    
                    {/* Filter Pills */}
                    <MotionBox
                      bg="white"
                      borderRadius="lg"
                      p={4}
                      boxShadow="lg"
                      position="absolute"
                      top="-10px"
                      right="-10px"
                      minW="180px"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.4 }}
                      zIndex={10}
                    >
                      <Text fontSize="sm" fontWeight="bold" color="gray.700" mb={3}>
                        Story Types 6
                      </Text>
                      <Flex flexWrap="wrap" gap={1.5}>
                        {['Success Stories 10', 'Interview Tips 7', 'Company Insights 8', 'Preparation 3', 'Challenges 2', 'Resources 23'].map((filter, index) => (
                          <MotionBox
                            key={index}
                            bg={index === 0 ? "green.500" : "gray.200"}
                            color={index === 0 ? "white" : "gray.700"}
                            px={2.5}
                            py={1}
                            borderRadius="full"
                            fontSize="xs"
                            fontWeight="medium"
                            whileHover={{ scale: 1.05 }}
                            cursor="pointer"
                          >
                            {filter}
                          </MotionBox>
                        ))}
                      </Flex>
                    </MotionBox>
                    
                    {/* Success Stories List */}
                    <VStack spacing={3} align="stretch">
                      {[
                        { name: "Lisa Park", company: "Meta", text: "After 6 months of preparation, I finally got my dream offer at Meta. Here's my complete journey and what worked..." },
                        { name: "Ryan Torres", company: "Netflix", text: "The system design interview was intense but manageable. These resources and practice sessions were crucial..." },
                        { name: "Priya Sharma", company: "Apple", text: "Behavioral questions were the key differentiator. Here's how I prepared using the STAR method effectively..." }
                      ].map((story, index) => (
                        <MotionBox
                          key={index}
                          display="flex"
                          alignItems="center"
                          p={3}
                          bg="gray.50"
                          borderRadius="lg"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                        >
                          <Box
                            w={8}
                            h={8}
                            bg="green.500"
                            borderRadius="full"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            mr={3}
                          >
                            <Text color="white" fontSize="xs" fontWeight="bold">
                              {story.name.charAt(0)}
                            </Text>
                          </Box>
                          <Box flex={1}>
                            <Text fontSize="sm" fontWeight="bold" color="gray.800">
                              {story.name} - {story.company}
                            </Text>
                            <Text fontSize="xs" color="gray.600">
                              {story.text}
                            </Text>
                          </Box>
                        </MotionBox>
                      ))}
                    </VStack>
                  </>
                )}
                
                {/* Overlay Button */}
                <MotionBox
                  className="overlay-button"
                  position="absolute"
                  bottom="20px"
                  left="50%"
                  transform="translateX(-50%)"
                  opacity={0}
                  transition="all 0.3s ease"
                  zIndex={20}
                >
                  <Button
                    as={RouterLink}
                    to={activeCard === 1 ? "/experience" : activeCard === 2 ? "/preparation" : "/post-experience"}
                    bg={activeCard === 1 ? "purple.500" : activeCard === 2 ? "blue.500" : "green.500"}
                    color="white"
                    size="md"
                    px={6}
                    py={3}
                    borderRadius="xl"
                    fontWeight="bold"
                    fontSize="sm"
                    boxShadow="0 8px 25px rgba(0, 0, 0, 0.15)"
                    _hover={{
                      bg: activeCard === 1 ? "purple.600" : activeCard === 2 ? "blue.600" : "green.600",
                      transform: "translateY(-2px)",
                      boxShadow: "0 12px 30px rgba(0, 0, 0, 0.2)"
                    }}
                    _active={{
                      transform: "translateY(0)"
                    }}
                    leftIcon={<Icon as={activeCard === 1 ? FaUsers : activeCard === 2 ? FaBook : FaUserTie} />}
                  >
                    {activeCard === 1 ? "Explore Experiences" : activeCard === 2 ? "Start Preparation" : "Share Experience"}
                  </Button>
                </MotionBox>
              </MotionBox>
            </Box>
          </MotionBox>

          {/* 1, 2, 3 Indicators - Outside Container */}
          <MotionBox
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
            ml={8}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            {[1, 2, 3].map((num, index) => (
              <MotionBox
                key={num}
                position="relative"
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <MotionBox
                  w={12}
                  h={12}
                  bg={activeCard === num ? "purple.500" : "gray.200"}
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  cursor="pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCard(num)}
                  border="2px solid"
                  borderColor={activeCard === num ? "purple.500" : "gray.300"}
                  boxShadow={activeCard === num ? "0 0 20px rgba(128, 90, 213, 0.3)" : "none"}
                  zIndex={2}
                >
                  <Text 
                    color={activeCard === num ? "white" : "gray.600"} 
                    fontSize="lg" 
                    fontWeight="bold"
                  >
                    {num}
                  </Text>
                </MotionBox>
                
                {/* Connecting Line */}
                {index < 2 && (
                  <Box
                    w="2px"
                    h="16px"
                    bg="gray.300"
                    mt={2}
                  />
                )}
              </MotionBox>
            ))}
          </MotionBox>
        </MotionBox>
      </Container>
    </Box>
  )
}

export default Features
