import { 
  VStack, FormControl, FormLabel, Textarea 
} from '@chakra-ui/react'

const TipsStep = ({ formData, handleChange }) => {
  return (
    <VStack spacing={6} align="start" w="full">
      <h2 style={{ 
        fontSize: '1.5rem', 
        fontWeight: 600, 
        color: 'white',
        margin: 0 
      }}>
        Preparation Tips
      </h2>
    
      <FormControl>
        <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
          Resources Used
        </FormLabel>
        <Textarea
          name="resourcesUsed"
          value={formData.resourcesUsed}
          onChange={handleChange}
          placeholder="LeetCode, Striver's Sheet, GFG, Codeforces, YouTube channels..."
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

      <FormControl>
        <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
          Tips for Future Candidates
        </FormLabel>
        <Textarea
          name="tipsForCandidates"
          value={formData.tipsForCandidates}
          onChange={handleChange}
          placeholder="Practice arrays & DP. Focus on basics. Be confident in interviews. Prepare your projects well..."
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

      <FormControl>
        <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
          Mistakes to Avoid
        </FormLabel>
        <Textarea
          name="mistakesToAvoid"
          value={formData.mistakesToAvoid}
          onChange={handleChange}
          placeholder="Not revising fundamentals before the test. Being nervous during interviews. Not preparing for HR questions..."
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

export default TipsStep
