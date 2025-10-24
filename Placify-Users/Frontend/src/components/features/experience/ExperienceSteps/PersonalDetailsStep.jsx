import { 
  VStack, HStack, FormControl, FormLabel, Input, Select, 
  Checkbox, Text 
} from '@chakra-ui/react'

const PersonalDetailsStep = ({ formData, handleChange }) => {
  return (
    <VStack spacing={6} align="start" w="full">
      <h2 style={{ 
        fontSize: '1.5rem', 
        fontWeight: 600, 
        color: 'white',
        margin: 0 
      }}>
        Personal & Academic Details
      </h2>
    
      <FormControl isRequired={!formData.isAnonymous}>
        <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
          Full Name
        </FormLabel>
        <Input
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Your full name"
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
          Email (Optional)
        </FormLabel>
        <Input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your.email@example.com"
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          title="Please enter a valid email address"
          maxLength={100}
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

      <FormControl isRequired={!formData.isAnonymous}>
        <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
          LinkedIn URL
        </FormLabel>
        <Input
          name="linkedinUrl"
          type="url"
          value={formData.linkedinUrl}
          onChange={handleChange}
          placeholder={formData.isAnonymous ? "Not required for anonymous posts" : "https://linkedin.com/in/yourprofile"}
          pattern="https://www\.linkedin\.com/.*"
          title="LinkedIn URL must start with https://www.linkedin.com/"
          maxLength={200}
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
          isDisabled={formData.isAnonymous}
        />
        {formData.isAnonymous && (
          <Text fontSize="xs" color="whiteAlpha.500" mt={1}>
            LinkedIn URL is not required for anonymous posts
          </Text>
        )}
      </FormControl>

      <HStack spacing={4} w="full">
        <FormControl>
          <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
            College Name
          </FormLabel>
          <Input
            name="collegeName"
            value={formData.collegeName}
            onChange={handleChange}
            placeholder="Your college name"
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
            Branch
          </FormLabel>
          <Select
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            placeholder="Select branch"
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
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="MECH">MECH</option>
            <option value="CIVIL">CIVIL</option>
            <option value="Other">Other</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500">
            Batch Year
          </FormLabel>
          <Input
            name="batchYear"
            type="number"
            value={formData.batchYear}
            onChange={handleChange}
            placeholder="2025"
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

      <FormControl>
        <HStack>
          <input
            type="checkbox"
            name="isAnonymous"
            checked={formData.isAnonymous}
            onChange={handleChange}
            style={{ accentColor: '#3182ce' }}
          />
          <FormLabel color="whiteAlpha.600" fontSize="sm" fontWeight="500" mb={0}>
            Post as Anonymous
          </FormLabel>
        </HStack>
      </FormControl>
    </VStack>
  )
}

export default PersonalDetailsStep
