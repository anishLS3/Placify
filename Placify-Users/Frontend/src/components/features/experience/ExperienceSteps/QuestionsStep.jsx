import { 
  VStack, FormControl, FormLabel, Textarea 
} from '@chakra-ui/react'

const QuestionsStep = ({ formData, handleChange }) => {
  return (
    <VStack spacing={6} align="start" w="full">
      <h2 style={{ 
        fontSize: '1.5rem', 
        fontWeight: 600, 
        color: 'white',
        margin: 0 
      }}>
        Technical & HR Questions
      </h2>
    
      <FormControl>
        <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
          Coding Questions Asked
        </FormLabel>
        <Textarea
          name="codingQuestions"
          value={formData.codingQuestions}
          onChange={handleChange}
          placeholder="1. Reverse a linked list&#10;2. Two-sum problem&#10;3. Find the longest common subsequence..."
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

      <FormControl>
        <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
          Technical Questions
        </FormLabel>
        <Textarea
          name="technicalQuestions"
          value={formData.technicalQuestions}
          onChange={handleChange}
          placeholder="OOPs concepts, DBMS queries, OS scheduling algorithms, project-related questions..."
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

      <FormControl>
        <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
          HR Questions
        </FormLabel>
        <Textarea
          name="hrQuestions"
          value={formData.hrQuestions}
          onChange={handleChange}
          placeholder="Tell me about yourself, strengths, weaknesses, why this company, future goals..."
          minH="90px"
          bg="whiteAlpha.100"
          border="1px solid"
          borderColor="whiteAlpha.200"
          color="white"
          _placeholder={{ color: "whiteAlpha.500" }}
          _focus={{
            borderColor: "blue.400",
            boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.3)"
          }}
          rows={3}
          resize="vertical"
        />
      </FormControl>
    </VStack>
  )
}

export default QuestionsStep
