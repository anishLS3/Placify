import { 
  VStack, HStack, FormControl, FormLabel, Input, Textarea, 
  Button, Box, Text, Icon 
} from '@chakra-ui/react'
import { FaPlus } from 'react-icons/fa'

const RoundDetailsStep = ({ 
  formData, 
  addRound, 
  removeRound, 
  updateRound 
}) => {
  return (
    <VStack spacing={6} align="start" w="full">
      <h2 style={{ 
        fontSize: '1.5rem', 
        fontWeight: 600, 
        color: 'white',
        margin: 0 
      }}>
        Detailed Round Descriptions
      </h2>
      
      {!formData.numberOfRounds ? (
        <Box p={6} bg="whiteAlpha.100" borderRadius="lg" border="1px solid" borderColor="whiteAlpha.200">
          <Text color="whiteAlpha.600" textAlign="center">
            Please enter the number of rounds in the previous step to add detailed round descriptions.
          </Text>
        </Box>
      ) : (
        <>
          <Text color="whiteAlpha.600" fontSize="sm">
            Add detailed descriptions for each round (based on {formData.numberOfRounds} rounds entered)
          </Text>
          
          {formData.rounds.map((round, index) => (
            <VStack key={index} spacing={4} align="start" w="full" p={4} bg="whiteAlpha.50" borderRadius="lg">
              <HStack justify="space-between" w="full">
                <Text color="white" fontWeight="600">Round {index + 1}</Text>
                {formData.rounds.length > 1 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    color="red.400"
                    onClick={() => removeRound(index)}
                  >
                    Remove
                  </Button>
                )}
              </HStack>
              
              <FormControl>
                <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
                  Round Name
                </FormLabel>
                <Input
                  value={round.name}
                  onChange={(e) => updateRound(index, 'name', e.target.value)}
                  placeholder="Aptitude Test"
                  bg="whiteAlpha.100"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                  color="white"
                  _placeholder={{ color: "whiteAlpha.500" }}
                  _focus={{
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.3)"
                  }}
                  h={12}
                />
              </FormControl>

              <FormControl>
                <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
                  Round Description
                </FormLabel>
                <Textarea
                  value={round.description}
                  onChange={(e) => updateRound(index, 'description', e.target.value)}
                  placeholder="MCQs on logical reasoning and quants. Time limit was 60 minutes..."
                  minH="100px"
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
          ))}
          
          <Button
            onClick={addRound}
            variant="outline"
            color="blue.400"
            borderColor="blue.400"
            _hover={{ bg: "blue.50", color: "blue.600" }}
            leftIcon={<Icon as={FaPlus} />}
          >
            Add Round
          </Button>
        </>
      )}
    </VStack>
  )
}

export default RoundDetailsStep
