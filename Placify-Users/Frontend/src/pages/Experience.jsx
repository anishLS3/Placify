import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  Input,
  Select,
  Stack,
  Flex,
  Button,
  HStack,
  Icon,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FaComments, FaBars, FaLinkedin, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)
import { getExperiences } from '../utils/api'

const Experience = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { 
    isOpen: isModalOpen, 
    onOpen: onModalOpen, 
    onClose: onModalClose 
  } = useDisclosure()
  const [experiences, setExperiences] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedExperience, setSelectedExperience] = useState(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  
  // Filter states
  const [filters, setFilters] = useState({
    company: '',
    positionType: '',
  })
  
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await getExperiences()
        setExperiences(response.data || [])
      } catch (error) {
        console.error('Error fetching experiences:', error)
        setExperiences([]) // Set empty array on error
      }
    }
    fetchExperiences()
  }, [])

  // Update filter function
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      company: '',
      positionType: '',
    })
    setSearchTerm('')
  }

  const filteredExperiences = experiences.filter(exp => {
    // Search term filter
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = searchTerm === '' || 
      (exp.companyName?.toLowerCase().includes(searchLower) || false) ||
      (exp.jobRole?.toLowerCase().includes(searchLower) || false) ||
      (exp.overallExperience?.toLowerCase().includes(searchLower) || false)

    // Individual filters
    const matchesCompany = !filters.company || exp.companyName === filters.company
    const matchesPositionType = !filters.positionType || exp.positionType === filters.positionType

    return matchesSearch && matchesCompany && matchesPositionType
  })

  // Get unique values for dropdowns
  const companies = [...new Set(experiences.map(exp => exp.companyName).filter(Boolean))]

  // Sort experiences by date (newest first)
  const sortedExperiences = [...filteredExperiences].sort((a, b) => {
    const dateA = new Date(a.date || a.createdAt || 0)
    const dateB = new Date(b.date || b.createdAt || 0)
    return dateB - dateA
  })
  
  // Get the latest experience and others
  const latestExperience = sortedExperiences[0]
  const otherExperiences = sortedExperiences.slice(1)

  const handleExperienceClick = (experience) => {
    setSelectedExperience(experience)
    onModalOpen()
  }

  const scrollLeft = () => {
    setScrollPosition(prev => Math.max(0, prev - 300))
  }

  const scrollRight = () => {
    setScrollPosition(prev => prev + 300)
  }

  const bg = 'white'
  const textColor = 'gray.900'
  const borderColor = 'gray.200'

  return (
    <Box minH="100vh" bg="#000000" position="relative" overflow="hidden">
      {/* Integrated Navbar - Apple Style */}
      <Box 
        position="fixed" 
        top={0} 
        left={0} 
        right={0} 
        zIndex={1000}
        bg="rgba(0, 0, 0, 0.8)"
        backdropFilter="blur(20px)"
        borderBottom="1px solid rgba(255,255,255,0.1)"
        px={4}
        py={2}
      >
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'} maxW="container.xl" mx="auto">
          {/* Logo */}
          <MotionBox
            as={RouterLink}
            to="/"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            display="flex"
            alignItems="center"
            gap={2}
          >
            <Text
              fontSize="lg"
              color="white"
              fontWeight="600"
              letterSpacing="tight"
            >
              Placify
            </Text>
          </MotionBox>

          {/* Navigation Menu */}
          <HStack
            as={'nav'}
            spacing={8}
            display={{ base: 'none', md: 'flex' }}
          >
            <Button
              as={RouterLink}
              to="/"
              variant="ghost"
              color="whiteAlpha.800"
              _hover={{ color: 'white', bg: 'transparent' }}
              fontWeight="400"
              fontSize="sm"
              h="auto"
              py={1}
            >
              Home
            </Button>

            <Button
              as={RouterLink}
              to="/preparation"
              variant="ghost"
              color="whiteAlpha.800"
              _hover={{ color: 'white', bg: 'transparent' }}
              fontWeight="400"
              fontSize="sm"
              h="auto"
              py={1}
            >
              Preparation
            </Button>

            <Button
              as={RouterLink}
              to="/experience"
              variant="ghost"
              color="white"
              _hover={{ color: 'white', bg: 'transparent' }}
              fontWeight="400"
              fontSize="sm"
              h="auto"
              py={1}
            >
              Experience
            </Button>

            <Button
              as={RouterLink}
              to="/post-experience"
              variant="ghost"
              color="whiteAlpha.800"
              _hover={{ color: 'white', bg: 'transparent' }}
              fontWeight="400"
              fontSize="sm"
              h="auto"
              py={1}
            >
              Post Experience
            </Button>

            <Button
              as={RouterLink}
              to="/contact"
              variant="ghost"
              color="whiteAlpha.800"
              _hover={{ color: 'white', bg: 'transparent' }}
              fontWeight="400"
              fontSize="sm"
              h="auto"
              py={1}
            >
              Contact
            </Button>
          </HStack>

          {/* Mobile Menu Button */}
          <Button
            as="button"
            display={{ base: 'flex', md: 'none' }}
            variant="ghost"
            color="white"
            _hover={{ bg: 'whiteAlpha.100' }}
            onClick={onOpen}
            p={2}
          >
            <Icon as={FaBars} />
          </Button>
        </Flex>
      </Box>

      {/* Mobile Navigation Drawer */}
      <Drawer isOpen={isOpen} onClose={onClose} placement="right">
        <DrawerOverlay />
        <DrawerContent bg="#1d1d1f">
          <DrawerCloseButton color="white" />
          <DrawerHeader color="white">Menu</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch">
              <Button
                as={RouterLink}
                to="/"
                variant="ghost"
                color="whiteAlpha.800"
                _hover={{ color: 'white' }}
                fontWeight="400"
                justifyContent="flex-start"
                onClick={onClose}
              >
                Home
              </Button>
              <Button
                as={RouterLink}
                to="/preparation"
                variant="ghost"
                color="whiteAlpha.800"
                _hover={{ color: 'white' }}
                fontWeight="400"
                justifyContent="flex-start"
                onClick={onClose}
              >
                Preparation
              </Button>
              <Button
                as={RouterLink}
                to="/experience"
                variant="ghost"
                color="white"
                fontWeight="500"
                justifyContent="flex-start"
                onClick={onClose}
              >
                Experience
              </Button>
              <Button
                as={RouterLink}
                to="/post-experience"
                variant="ghost"
                color="whiteAlpha.800"
                _hover={{ color: 'white' }}
                fontWeight="400"
                justifyContent="flex-start"
                onClick={onClose}
              >
                Post Experience
              </Button>
              <Button
                as={RouterLink}
                to="/contact"
                variant="ghost"
                color="whiteAlpha.800"
                _hover={{ color: 'white' }}
                fontWeight="400"
                justifyContent="flex-start"
                onClick={onClose}
              >
                Contact
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Content */}
      <Box pt={12}>
        {/* Hero Section - Apple Style */}
        <Box textAlign="center" py={{ base: 20, md: 32 }} px={6} minH="100vh" display="flex" alignItems="center" justifyContent="center">
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Heading
              fontSize={{ base: '4xl', md: '6xl', lg: '8xl' }}
              fontWeight="600"
              color="white"
              mb={6}
              lineHeight="1.05"
              letterSpacing="-0.02em"
            >
              Placement Experiences
            </Heading>
            
            <Text 
              fontSize={{ base: 'xl', md: '2xl' }} 
              color="whiteAlpha.700" 
              maxW="800px" 
              mx="auto" 
              fontWeight="400"
              lineHeight="1.5"
            >
              Real experiences shared by students who successfully secured their dream placements.
            </Text>
          </MotionBox>
        </Box>

        <Container maxW="1400px" px={6} pb={32}>
          
          <MotionBox
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            mb={16}
          >
            <VStack spacing={8} mb={16}>
              <VStack spacing={4} textAlign="center">
                <Heading
                  fontSize={{ base: '3xl', md: '5xl' }}
                  fontWeight="600"
                  color="white"
                  letterSpacing="-0.02em"
                >
                  Browse Experiences
                </Heading>
                <Text fontSize="xl" color="whiteAlpha.600" fontWeight="400" maxW="600px">
                  Search and filter through real placement experiences from students.
                </Text>
              </VStack>

              {/* Search and Filter Options */}
              <VStack spacing={4} w="full" maxW="800px">
                {/* Search Bar */}
            <Input
                  placeholder="Search by company, role, or experience..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
                  bg="whiteAlpha.50"
              border="1px solid"
                  borderColor="whiteAlpha.100"
                  color="white"
                  _placeholder={{ color: "whiteAlpha.500" }}
                  _focus={{
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.3)"
                  }}
                  h={12}
                  w="full"
                />
                
                {/* Filter Options */}
                <Stack direction={{ base: 'column', md: 'row' }} spacing={4} w="full">
            <Select
                    placeholder="Filter by Company"
                    value={filters.company}
                    onChange={(e) => updateFilter('company', e.target.value)}
                    bg="whiteAlpha.50"
              border="1px solid"
                    borderColor="whiteAlpha.100"
                    color="white"
                    _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.3)" }}
                    _hover={{ borderColor: "whiteAlpha.300" }}
                    sx={{
                      option: { bg: "#1d1d1f", color: "white", _hover: { bg: "whiteAlpha.100" }, _selected: { bg: "whiteAlpha.200" } }
                    }}
                    h={12}
            >
              {companies.map(company => (
                <option key={company} value={company}>{company}</option>
              ))}
            </Select>

                  <Select
                    placeholder="Internship or Placement"
                    value={filters.positionType}
                    onChange={(e) => updateFilter('positionType', e.target.value)}
                    bg="whiteAlpha.50"
                    border="1px solid"
                    borderColor="whiteAlpha.100"
                    color="white"
                    _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.3)" }}
                    _hover={{ borderColor: "whiteAlpha.300" }}
                    sx={{
                      option: { bg: "#1d1d1f", color: "white", _hover: { bg: "whiteAlpha.100" }, _selected: { bg: "whiteAlpha.200" } }
                    }}
                    h={12}
                  >
                    <option value="Internship">Internship</option>
                    <option value="Placement">Placement</option>
                  </Select>

                  <Button
                    onClick={clearAllFilters}
                    variant="outline"
                    color="whiteAlpha.700"
                    borderColor="whiteAlpha.200"
                    _hover={{ bg: "whiteAlpha.100" }}
                    h={12}
                    px={6}
                  >
                    Clear All
                  </Button>
          </Stack>
              </VStack>
            </VStack>
          </MotionBox>


          {/* Latest Experience - Big Featured Card */}
          {latestExperience && (
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              mb={12}
            >
              <Flex direction={{ base: 'column', lg: 'row' }} gap={8} align="start">
                {/* Big Featured Card */}
                <Box
                  flex="1"
                  p={12}
                  bg="white"
                  borderRadius="2xl"
                  border="1px solid"
                  borderColor="gray.200"
                  cursor="pointer"
                  _hover={{ 
                    transform: "translateY(-4px)",
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s"
                  }}
                  onClick={() => handleExperienceClick(latestExperience)}
                >
                  <VStack align="start" spacing={6}>
                    <HStack spacing={4} w="full" justify="space-between">
                      <VStack align="start" spacing={3}>
                        <HStack spacing={3}>
                          <Text fontSize="3xl" fontWeight="700" color="gray.900">{latestExperience.fullName}</Text>
                          {latestExperience.linkedinUrl && (
                            <Icon 
                              as={FaLinkedin} 
                              color="blue.500" 
                              fontSize="2xl" 
                              cursor="pointer"
                              _hover={{ color: "blue.400", transform: "scale(1.1)" }}
                              transition="all 0.2s"
                              onClick={(e) => {
                                e.stopPropagation()
                                window.open(latestExperience.linkedinUrl, '_blank')
                              }}
                            />
                          )}
                        </HStack>
                        <Text fontSize="2xl" color="blue.500" fontWeight="600">{latestExperience.companyName} - {latestExperience.jobRole}</Text>
                        <Text fontSize="lg" color="gray.600">{latestExperience.positionType}</Text>
                      </VStack>
                      <Text fontSize="lg" color="gray.500" fontWeight="500">
                        {new Date(latestExperience.date).toLocaleDateString()}
                      </Text>
                    </HStack>
                    <Text color="gray.700" lineHeight="1.6" fontSize="lg" noOfLines={3}>
                      {latestExperience.overallExperience}
                    </Text>
                  </VStack>
                </Box>

                {/* Scrollable Small Cards */}
                {otherExperiences.length > 0 && (
                  <Box flex="1" minW="0">
                    <VStack spacing={4} align="stretch">
                      <HStack justify="space-between" align="center">
                        <VStack spacing={1} align="start">
                          <Heading fontSize="2xl" fontWeight="600" color="white">
                            More Experiences
                          </Heading>
                          <Text fontSize="sm" color="whiteAlpha.500">
                            Click any card to view full details
                          </Text>
                        </VStack>
                        <HStack spacing={2}>
                          <Button
                            size="sm"
                            variant="outline"
                            color="whiteAlpha.600"
                            borderColor="whiteAlpha.200"
                            _hover={{ borderColor: "whiteAlpha.400", color: "white" }}
                            onClick={scrollLeft}
                            disabled={scrollPosition === 0}
                          >
                            <Icon as={FaChevronLeft} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            color="whiteAlpha.600"
                            borderColor="whiteAlpha.200"
                            _hover={{ borderColor: "whiteAlpha.400", color: "white" }}
                            onClick={scrollRight}
                          >
                            <Icon as={FaChevronRight} />
                          </Button>
                        </HStack>
                      </HStack>
                      
                      <Box overflow="hidden" borderRadius="xl">
                        <Flex
                          gap={4}
                          transform={`translateX(-${scrollPosition}px)`}
                          transition="transform 0.3s ease"
                          pb={4}
                        >
                          {otherExperiences.map((exp, index) => (
                            <MotionBox
                key={exp._id}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.6, delay: index * 0.1 }}
                              minW="280px"
                p={6}
                              bg="white"
                              borderRadius="xl"
                border="1px solid"
                              borderColor="gray.200"
                              cursor="pointer"
                              _hover={{ 
                                transform: "translateY(-4px)",
                                boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
                                transition: "all 0.3s"
                              }}
                              onClick={() => handleExperienceClick(exp)}
                            >
                              <VStack align="start" spacing={3}>
                                <HStack spacing={2} w="full" justify="space-between">
                                  <HStack spacing={2}>
                                    <Text fontSize="lg" fontWeight="600" color="gray.900">{exp.fullName}</Text>
                                    {exp.linkedinUrl && (
                                      <Icon 
                                        as={FaLinkedin} 
                                        color="blue.500" 
                                        fontSize="sm" 
                                        cursor="pointer"
                                        _hover={{ color: "blue.400", transform: "scale(1.1)" }}
                                        transition="all 0.2s"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          window.open(exp.linkedinUrl, '_blank')
                                        }}
                                      />
                                    )}
                                  </HStack>
                                  <Text fontSize="xs" color="gray.500">
                  {new Date(exp.date).toLocaleDateString()}
                                  </Text>
                                </HStack>
                                <Text fontSize="md" color="blue.500" fontWeight="500">{exp.companyName} - {exp.jobRole}</Text>
                                <Text fontSize="sm" color="gray.600">{exp.positionType}</Text>
                                <Text color="gray.600" lineHeight="1.5" fontSize="sm" noOfLines={2}>
                                  {exp.overallExperience}
                                </Text>
                              </VStack>
                            </MotionBox>
                          ))}
                        </Flex>
                      </Box>
                    </VStack>
                  </Box>
                )}
              </Flex>
            </MotionBox>
          )}

        </Container>

        {/* Footer */}
        <Box borderTop="1px solid" borderColor="whiteAlpha.100" py={12}>
          <Container maxW="1400px">
            <Text textAlign="center" color="whiteAlpha.500" fontSize="sm">
              © 2025 Placify. All rights reserved.
            </Text>
          </Container>
        </Box>
      </Box>

      {/* Experience Details Modal */}
      <Modal isOpen={isModalOpen} onClose={onModalClose} size="4xl" isCentered>
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
        <ModalContent bg="white" borderRadius="2xl" mx={4}>
          <ModalHeader pb={2}>
            <VStack align="start" spacing={2}>
              <HStack spacing={3}>
                <Text fontSize="2xl" fontWeight="600" color="gray.900">
                  {selectedExperience?.fullName}
                </Text>
                {selectedExperience?.linkedinUrl && (
                  <Icon 
                    as={FaLinkedin} 
                    color="blue.500" 
                    fontSize="xl" 
                    cursor="pointer"
                    _hover={{ color: "blue.400", transform: "scale(1.1)" }}
                    transition="all 0.2s"
                    onClick={() => window.open(selectedExperience.linkedinUrl, '_blank')}
                  />
                )}
              </HStack>
              <Text fontSize="lg" color="blue.500" fontWeight="500">
                {selectedExperience?.companyName} - {selectedExperience?.jobRole}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {selectedExperience && new Date(selectedExperience.date).toLocaleDateString()}
              </Text>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pt={0}>
            <VStack align="start" spacing={8}>
              {/* Overall Experience */}
              <Box>
                <Text fontSize="lg" fontWeight="600" color="gray.900" mb={3}>
                  Overall Experience
                </Text>
                <Text color="gray.700" lineHeight="1.7" fontSize="md">
                  {selectedExperience?.overallExperience}
                </Text>
              </Box>

              {/* Personal & Academic Details */}
              <Box>
                <Text fontSize="lg" fontWeight="600" color="gray.900" mb={3}>
                  Personal & Academic Details
                </Text>
                <VStack align="start" spacing={2}>
                  <Text color="gray.700" fontSize="sm"><strong>College:</strong> {selectedExperience?.collegeName}</Text>
                  <Text color="gray.700" fontSize="sm"><strong>Branch:</strong> {selectedExperience?.branch}</Text>
                  <Text color="gray.700" fontSize="sm"><strong>Batch Year:</strong> {selectedExperience?.batchYear}</Text>
                  <Text color="gray.700" fontSize="sm"><strong>Position Type:</strong> {selectedExperience?.positionType}</Text>
                  <Text color="gray.700" fontSize="sm"><strong>Interview Type:</strong> {selectedExperience?.interviewType}</Text>
                  {selectedExperience?.jobLocation && (
                    <Text color="gray.700" fontSize="sm"><strong>Job Location:</strong> {selectedExperience.jobLocation}</Text>
                  )}
                  {selectedExperience?.ctc && (
                    <Text color="gray.700" fontSize="sm"><strong>CTC:</strong> {selectedExperience.ctc}</Text>
                  )}
                </VStack>
              </Box>

              {/* Selection Process Details */}
              <Box>
                <Text fontSize="lg" fontWeight="600" color="gray.900" mb={3}>
                  Selection Process Details
                </Text>
                <VStack align="start" spacing={2}>
                  <Text color="gray.700" fontSize="sm"><strong>Number of Rounds:</strong> {selectedExperience?.numberOfRounds}</Text>
                  <Text color="gray.700" fontSize="sm"><strong>Round Types:</strong> {selectedExperience?.roundTypes?.join(', ')}</Text>
                  <Text color="gray.700" fontSize="sm"><strong>Difficulty Level:</strong> {selectedExperience?.difficultyLevel}</Text>
                </VStack>
              </Box>

              {/* Detailed Rounds */}
              {selectedExperience?.rounds && selectedExperience.rounds.length > 0 && (
                <Box>
                  <Text fontSize="lg" fontWeight="600" color="gray.900" mb={3}>
                    Detailed Rounds
                  </Text>
                  <VStack align="start" spacing={4}>
                    {selectedExperience.rounds.map((round, index) => (
                      <Box key={index} p={4} bg="gray.50" borderRadius="md" w="full">
                        <Text fontWeight="600" color="gray.800" mb={2}>{round.name}</Text>
                        <Text color="gray.700" fontSize="sm" lineHeight="1.6">{round.description}</Text>
              </Box>
            ))}
                  </VStack>
                </Box>
              )}

              {/* Technical & HR Questions */}
              <Box>
                <Text fontSize="lg" fontWeight="600" color="gray.900" mb={3}>
                  Questions Asked
                </Text>
                <VStack align="start" spacing={3}>
                  {selectedExperience?.codingQuestions && (
                    <Box>
                      <Text fontWeight="600" color="gray.800" mb={2}>Coding Questions:</Text>
                      <Text color="gray.700" fontSize="sm" lineHeight="1.6">{selectedExperience.codingQuestions}</Text>
                    </Box>
                  )}
                  {selectedExperience?.technicalQuestions && (
                    <Box>
                      <Text fontWeight="600" color="gray.800" mb={2}>Technical Questions:</Text>
                      <Text color="gray.700" fontSize="sm" lineHeight="1.6">{selectedExperience.technicalQuestions}</Text>
                    </Box>
                  )}
                  {selectedExperience?.hrQuestions && (
                    <Box>
                      <Text fontWeight="600" color="gray.800" mb={2}>HR Questions:</Text>
                      <Text color="gray.700" fontSize="sm" lineHeight="1.6">{selectedExperience.hrQuestions}</Text>
                    </Box>
                  )}
                </VStack>
              </Box>

              {/* Preparation Tips */}
              <Box>
                <Text fontSize="lg" fontWeight="600" color="gray.900" mb={3}>
                  Preparation Tips
                </Text>
                <VStack align="start" spacing={3}>
                  {selectedExperience?.resourcesUsed && (
                    <Box>
                      <Text fontWeight="600" color="gray.800" mb={2}>Resources Used:</Text>
                      <Text color="gray.700" fontSize="sm" lineHeight="1.6">{selectedExperience.resourcesUsed}</Text>
                    </Box>
                  )}
                  {selectedExperience?.tipsForCandidates && (
                    <Box>
                      <Text fontWeight="600" color="gray.800" mb={2}>Tips for Future Candidates:</Text>
                      <Text color="gray.700" fontSize="sm" lineHeight="1.6">{selectedExperience.tipsForCandidates}</Text>
                    </Box>
                  )}
                  {selectedExperience?.mistakesToAvoid && (
                    <Box>
                      <Text fontWeight="600" color="gray.800" mb={2}>Mistakes to Avoid:</Text>
                      <Text color="gray.700" fontSize="sm" lineHeight="1.6">{selectedExperience.mistakesToAvoid}</Text>
          </Box>
                  )}
                </VStack>
      </Box>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default Experience