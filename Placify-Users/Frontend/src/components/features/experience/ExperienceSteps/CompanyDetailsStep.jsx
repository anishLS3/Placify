import { 
  VStack, HStack, FormControl, FormLabel, Input, Select 
} from '@chakra-ui/react'

const CompanyDetailsStep = ({ formData, handleChange }) => {
  return (
    <VStack spacing={6} align="start" w="full">
      <h2 style={{ 
        fontSize: '1.5rem', 
        fontWeight: 600, 
        color: 'white',
        margin: 0 
      }}>
        Company & Role Details
      </h2>
    
      <FormControl isRequired>
        <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
          Company Name
        </FormLabel>
        <Input
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          placeholder="Company name"
          minLength={2}
          maxLength={100}
          required
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

      <HStack spacing={4} w="full">
        <FormControl isRequired>
          <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
            Job Role
          </FormLabel>
          <Input
            name="jobRole"
            value={formData.jobRole}
            onChange={handleChange}
            placeholder="Software Engineer"
            minLength={2}
            maxLength={100}
            required
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

        <FormControl isRequired>
          <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
            Position Type
          </FormLabel>
          <Select
            name="positionType"
            value={formData.positionType}
            onChange={handleChange}
            placeholder="Select position type"
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
            <option value="Placement" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Placement</option>
            <option value="Internship" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Internship</option>
          </Select>
        </FormControl>
      </HStack>

      <FormControl>
        <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
          Interview Type
        </FormLabel>
        <Select
          name="interviewType"
          value={formData.interviewType}
          onChange={handleChange}
          placeholder="Select type"
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
          <option value="On-Campus">On-Campus</option>
          <option value="Off-Campus">Off-Campus</option>
          <option value="Referral">Referral</option>
          <option value="Internship">Internship</option>
        </Select>
      </FormControl>

      <HStack spacing={4} w="full">
        <FormControl>
          <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
            Job Location
          </FormLabel>
          <Input
            name="jobLocation"
            value={formData.jobLocation}
            onChange={handleChange}
            placeholder="Bangalore"
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
            CTC (Optional)
          </FormLabel>
          <Input
            name="ctc"
            value={formData.ctc}
            onChange={handleChange}
            placeholder="6 LPA"
            pattern="^\d+(\.\d+)?\s*LPA$"
            title="Please enter CTC in format like '6 LPA' or '6.5 LPA'"
            maxLength={20}
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
      </HStack>
    </VStack>
  )
}

export default CompanyDetailsStep
