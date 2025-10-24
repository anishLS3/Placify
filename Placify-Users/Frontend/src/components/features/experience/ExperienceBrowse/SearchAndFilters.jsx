import { 
  VStack, HStack, Input, Select, Button, Stack 
} from '@chakra-ui/react'

const SearchAndFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  filters, 
  updateFilter, 
  clearAllFilters, 
  companies 
}) => {
  return (
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
  )
}

export default SearchAndFilters
