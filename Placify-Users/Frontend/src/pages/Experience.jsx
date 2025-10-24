import { useState, useEffect } from 'react'
import { Box, Container, Heading, Text, VStack, Spinner, Center } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { AppNavigation, AppFooter } from '@/components/common/Layout'
import { PageHero } from '@/components/common/UI'
import { SearchAndFilters, ExperienceList, ExperienceDetailsModal } from '@/components/features/experience'
import { getExperiences } from '@/utils/api'

const MotionBox = motion(Box)

const Experience = () => {
  const [experiences, setExperiences] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  
  // Handle search term change with scroll reset
  const handleSearchChange = (value) => {
    setSearchTerm(value)
    setScrollPosition(0) // Reset scroll when search changes
  }
  const [selectedExperience, setSelectedExperience] = useState(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // Filter states
  const [filters, setFilters] = useState({
    company: '',
    positionType: '',
  })
  
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setIsLoading(true)
        const response = await getExperiences()
        // Handle nested data structure: response.data.data
        const experiencesData = response.data?.data || response.data || response || []
        setExperiences(Array.isArray(experiencesData) ? experiencesData : [])
        // Reset scroll position when experiences change
        setScrollPosition(0)
      } catch (error) {
        console.error('Error fetching experiences:', error)
        setExperiences([]) // Set empty array on error
        setScrollPosition(0)
      } finally {
        setIsLoading(false)
      }
    }
    fetchExperiences()
  }, [])

  // Update filter function
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setScrollPosition(0) // Reset scroll when filters change
  }

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      company: '',
      positionType: '',
    })
    setSearchTerm('')
    setScrollPosition(0) // Reset scroll when clearing filters
  }

  const filteredExperiences = Array.isArray(experiences) ? experiences.filter(exp => {
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
  }) : []

  // Get unique values for dropdowns
  const companies = Array.isArray(experiences) ? [...new Set(experiences.map(exp => exp.companyName).filter(Boolean))] : []

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
    setIsModalOpen(true)
  }

  const scrollLeft = () => {
    setScrollPosition(prev => Math.max(0, prev - 300))
  }

  const scrollRight = () => {
    // Calculate if there are more items to scroll to
    const containerWidth = 800 // Approximate container width
    const cardWidth = 320 // Approximate card width + gap
    const maxScroll = Math.max(0, (otherExperiences.length * cardWidth) - containerWidth)
    
    setScrollPosition(prev => Math.min(maxScroll, prev + 300))
  }

  return (
    <Box minH="100vh" bg="#000000" position="relative" overflow="hidden">
      <AppNavigation />

      {/* Main Content */}
      <Box pt={20}>
        <PageHero 
          title="Placement Experiences"
          subtitle="Real experiences shared by students who successfully secured their dream placements."
        />

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
              <SearchAndFilters
                searchTerm={searchTerm}
                setSearchTerm={handleSearchChange}
                filters={filters}
                updateFilter={updateFilter}
                clearAllFilters={clearAllFilters}
                companies={companies}
              />
            </VStack>
          </MotionBox>

          {/* Experience List */}
          {isLoading ? (
            <Center py={16}>
              <VStack spacing={4}>
                <Spinner size="xl" color="blue.500" />
                <Text color="whiteAlpha.600">Loading experiences...</Text>
                      </VStack>
            </Center>
          ) : (
            <ExperienceList
              latestExperience={latestExperience}
              otherExperiences={otherExperiences}
              onExperienceClick={handleExperienceClick}
              scrollPosition={scrollPosition}
              scrollLeft={scrollLeft}
              scrollRight={scrollRight}
            />
          )}
        </Container>

        <AppFooter />
      </Box>

      {/* Experience Details Modal */}
      <ExperienceDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedExperience={selectedExperience}
      />
    </Box>
  )
}

export default Experience