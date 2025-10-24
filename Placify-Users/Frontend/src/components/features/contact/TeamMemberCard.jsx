import { Box, Button, Icon, Text, VStack } from '@chakra-ui/react'
import { FaUser, FaLinkedin } from 'react-icons/fa'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

const ContactTeamMember = ({ 
  name, 
  role, 
  email, 
  linkedinUrl, 
  color = "blue", 
  delay = 0.1 
}) => {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      p={8}
      bg="whiteAlpha.50"
      borderRadius="2xl"
      border="1px solid"
      borderColor="whiteAlpha.100"
      textAlign="center"
      _hover={{ 
        transform: "translateY(-4px)",
        boxShadow: "0 8px 30px rgba(255, 255, 255, 0.1)",
        transition: "all 0.3s"
      }}
    >
      <VStack spacing={6}>
        <Box
          w={16}
          h={16}
          bg={`${color}.500`}
          borderRadius="xl"
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow={`0 4px 20px rgba(${color === 'blue' ? '59, 130, 246' : '34, 197, 94'}, 0.3)`}
        >
          <Icon as={FaUser} color="white" fontSize="2xl" />
        </Box>
        
        <VStack spacing={3}>
          <Text fontSize="xl" fontWeight="600" color="white">
            {name}
          </Text>
          <Text color="whiteAlpha.700" fontSize="md" lineHeight="1.6">
            {role}
          </Text>
          <Text color={`${color}.400`} fontSize="md" fontWeight="500">
            {email}
          </Text>
          <Button
            as="a"
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            leftIcon={<Icon as={FaLinkedin} />}
            bg={`${color}.600`}
            color="white"
            _hover={{ 
              bg: `${color}.700`,
              transform: "translateY(-2px)",
              boxShadow: `0 4px 15px rgba(${color === 'blue' ? '59, 130, 246' : '34, 197, 94'}, 0.4)`
            }}
            size="sm"
            borderRadius="xl"
          >
            LinkedIn Profile
          </Button>
        </VStack>
      </VStack>
    </MotionBox>
  )
}

export default ContactTeamMember
