import { Box, Text, Flex, Icon } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FaChevronDown } from 'react-icons/fa'

const MotionBox = motion(Box)

const FAQCategory = ({ category, isActive, onClick }) => {
  return (
    <MotionBox
      p={4}
      borderRadius="xl"
      bg={isActive ? 'whiteAlpha.100' : 'transparent'}
      cursor="pointer"
      whileHover={{ bg: 'whiteAlpha.50' }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      <Flex align="center" justify="space-between">
        <Text
          fontSize="md"
          fontWeight={isActive ? '500' : '400'}
          color={isActive ? 'white' : 'whiteAlpha.700'}
        >
          {category.name}
        </Text>
        <Icon as={FaChevronDown} color={isActive ? 'white' : 'whiteAlpha.500'} fontSize="sm" />
      </Flex>
    </MotionBox>
  )
}

export default FAQCategory
