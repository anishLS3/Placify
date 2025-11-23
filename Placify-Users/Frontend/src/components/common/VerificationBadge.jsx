import { 
  Box, 
  Icon, 
  Tooltip
} from '@chakra-ui/react'
import { FaCheckCircle } from 'react-icons/fa'

const VerificationBadge = ({ 
  size = 'md', 
  position = 'absolute', 
  top = 2, 
  right = 2,
  showTooltip = true,
  variant = 'default'
}) => {
  const sizeMap = {
    sm: {
      iconSize: 'md',
      bgSize: 6,
      fontSize: 'xs'
    },
    md: {
      iconSize: 'lg',
      bgSize: 8,
      fontSize: 'sm'
    },
    lg: {
      iconSize: 'xl',
      bgSize: 10,
      fontSize: 'md'
    }
  }

  const currentSize = sizeMap[size] || sizeMap.md

  const badgeElement = (
    <Box
      position={position}
      top={top}
      right={right}
      zIndex={2}
      bg="green.500"
      borderRadius="full"
      p={1}
      border="2px solid"
      borderColor="white"
      boxShadow="0 2px 8px rgba(0, 0, 0, 0.15), 0 0 0 2px rgba(72, 187, 120, 0.2)"
      transition="all 0.3s ease"
      _hover={{
        transform: 'scale(1.1)',
        transition: 'all 0.2s',
        bg: 'green.600'
      }}
      cursor="default"
      w={currentSize.bgSize}
      h={currentSize.bgSize}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Icon 
        as={FaCheckCircle} 
        color="white" 
        fontSize={currentSize.iconSize}
      />
    </Box>
  )

  if (showTooltip) {
    return (
      <Tooltip
        label="Verified by Admin - Quality Guaranteed"
        hasArrow
        bg="green.600"
        color="white"
        fontSize={currentSize.fontSize}
        fontWeight="500"
        borderRadius="md"
        px={3}
        py={2}
        placement="left"
      >
        {badgeElement}
      </Tooltip>
    )
  }

  return badgeElement
}

export default VerificationBadge