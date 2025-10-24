import { Box } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

const NavigationDot = ({ active, onClick }) => (
  <MotionBox
    width="12px"
    height="12px"
    borderRadius="full"
    bg={active ? "purple.500" : "gray.300"}
    cursor="pointer"
    onClick={onClick}
    whileHover={{ scale: 1.2 }}
    whileTap={{ scale: 0.9 }}
    animate={{
      scale: active ? 1.2 : 1,
      backgroundColor: active ? "#805ad5" : "#a0aec0"
    }}
  />
)

export default NavigationDot
