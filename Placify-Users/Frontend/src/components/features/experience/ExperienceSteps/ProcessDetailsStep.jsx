import { 
  VStack, HStack, FormControl, FormLabel, Input, Select, 
  Textarea, Text, HStack as ChakraHStack 
} from '@chakra-ui/react'

const ProcessDetailsStep = ({ formData, handleChange }) => {
  return (
    <VStack spacing={6} align="start" w="full">
      <h2 style={{ 
        fontSize: '1.5rem', 
        fontWeight: 600, 
        color: 'white',
        margin: 0 
      }}>
        Selection Process Details
      </h2>
    
      <HStack spacing={4} w="full">
        <FormControl isRequired>
          <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
            Number of Rounds
          </FormLabel>
          <Select
            name="numberOfRounds"
            value={formData.numberOfRounds}
            onChange={handleChange}
            placeholder="Select number of rounds"
            bg="whiteAlpha.100"
            border="1px solid"
            borderColor="whiteAlpha.200"
            color="white"
            _focus={{
              borderColor: "blue.400",
              boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.3)"
            }}
            h={12}
          >
            <option value="1" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>1 Round</option>
            <option value="2" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>2 Rounds</option>
            <option value="3" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>3 Rounds</option>
            <option value="4" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>4 Rounds</option>
            <option value="5" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>5 Rounds</option>
            <option value="6" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>6 Rounds</option>
            <option value="7" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>7 Rounds</option>
            <option value="8" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>8 Rounds</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
            Difficulty Level
          </FormLabel>
          <Select
            name="difficultyLevel"
            value={formData.difficultyLevel}
            onChange={handleChange}
            placeholder="Select difficulty"
            bg="whiteAlpha.100"
            border="1px solid"
            borderColor="whiteAlpha.200"
            color="white"
            _focus={{
              borderColor: "blue.400",
              boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.3)"
            }}
            h={12}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </Select>
        </FormControl>
      </HStack>

      <FormControl>
        <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
          Round Types
        </FormLabel>
        <ChakraHStack spacing={4} wrap="wrap">
          {['Aptitude', 'Coding', 'Technical', 'HR', 'Group Discussion', 'Presentation'].map((type) => (
            <ChakraHStack key={type}>
              <input
                type="checkbox"
                name="roundTypes"
                value={type}
                checked={formData.roundTypes.includes(type)}
                onChange={handleChange}
                style={{ accentColor: '#3182ce' }}
              />
              <Text color="whiteAlpha.600" fontSize="sm">{type}</Text>
            </ChakraHStack>
          ))}
        </ChakraHStack>
      </FormControl>

      <FormControl isRequired>
        <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
          Overall Experience Summary
        </FormLabel>
        <Text fontSize="xs" color="whiteAlpha.500" mb={2}>
          {formData.overallExperience.length}/2000 characters (minimum 50)
        </Text>
        <Textarea
          name="overallExperience"
          value={formData.overallExperience}
          onChange={handleChange}
          placeholder="The process was challenging but fair. The interviewers were friendly and asked relevant questions..."
          minLength={50}
          maxLength={2000}
          minH="120px"
          bg="whiteAlpha.100"
          border="1px solid"
          borderColor="whiteAlpha.200"
          color="white"
          _placeholder={{ color: "whiteAlpha.500" }}
          _focus={{
            borderColor: "blue.400",
            boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.3)"
          }}
          rows={4}
          resize="vertical"
        />
      </FormControl>
    </VStack>
  )
}

export default ProcessDetailsStep
