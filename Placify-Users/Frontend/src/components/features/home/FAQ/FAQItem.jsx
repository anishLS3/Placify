import { Box, Text, Flex, Icon } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FaChevronDown } from 'react-icons/fa'

const MotionBox = motion(Box)

const FAQItem = ({ question, answer, isExpanded, onClick }) => {
  return (
    <MotionBox
      p={6}
      borderRadius="xl"
      bg="transparent"
      cursor="pointer"
      whileHover={{ bg: 'whiteAlpha.50' }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      <Flex align="start" justify="space-between" mb={isExpanded ? 4 : 0}>
        <Text
          fontSize="lg"
          fontWeight="600"
          color="white"
          flex={1}
        >
          {question}
        </Text>
        <Icon 
          as={FaChevronDown} 
          color="whiteAlpha.600" 
          fontSize="sm"
          transform={isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'}
          transition="transform 0.2s ease"
        />
      </Flex>
      {isExpanded && (
        <MotionBox
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          overflow="hidden"
        >
          <Text fontSize="md" color="whiteAlpha.700" lineHeight="1.7">
            {answer}
          </Text>
        </MotionBox>
      )}
    </MotionBox>
  )
}

export default FAQItem
