import { 
  Box, Heading, Text, VStack, HStack, Icon
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FaBriefcase, FaCode, FaTrophy, FaRocket } from 'react-icons/fa'

const MotionBox = motion(Box)

const CompanyCards = ({ isCardsHovered, setIsCardsHovered }) => {
  return (
    <MotionBox
      display={{ base: 'none', lg: 'block' }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.3 }}
      position="relative"
      h="550px"
      onHoverStart={() => setIsCardsHovered(true)}
      onHoverEnd={() => setIsCardsHovered(false)}
      cursor="pointer"
    >
      {/* Google Card - Position 1 (Top-Right) */}
      <MotionBox
        position="absolute"
        top={isCardsHovered ? "0%" : "8%"}
        right={isCardsHovered ? "-5%" : "2%"}
        w="320px"
        h="200px"
        borderRadius="20px"
        bg="white"
        boxShadow="0 30px 60px rgba(66, 133, 244, 0.4)"
        transform={isCardsHovered ? "perspective(1500px) rotateY(-15deg) rotateX(8deg) rotateZ(-5deg)" : "perspective(1500px) rotateY(-15deg) rotateX(8deg) rotateZ(-8deg)"}
        p={6}
        zIndex={isCardsHovered ? 5 : 4}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        animate={isCardsHovered ? {
          scale: 1.1
        } : {
          y: [0, -15, 0]
        }}
        transition={{
          duration: isCardsHovered ? 0.5 : 6,
          repeat: isCardsHovered ? 0 : Infinity,
          ease: "easeInOut"
        }}
      >
        <VStack align="flex-start" spacing={4}>
          <Heading fontSize="4xl" fontWeight="bold" color="#4285f4">
            Google
          </Heading>
          <Text fontSize="sm" color="gray.600" fontWeight="medium">
            Software Engineer
          </Text>
        </VStack>
        <HStack justify="space-between" align="center">
          <VStack align="flex-start" spacing={0}>
            <Text fontSize="2xl" fontWeight="bold" color="gray.800">
              ₹18L
            </Text>
            <Text fontSize="xs" color="gray.500">
              avg package
            </Text>
          </VStack>
          <Icon as={FaBriefcase} fontSize="3xl" color="#4285f4" opacity={0.3} />
        </HStack>
      </MotionBox>

      {/* Microsoft Card - Position 2 (Middle-Right) */}
      <MotionBox
        position="absolute"
        top={isCardsHovered ? "18%" : "22%"}
        right={isCardsHovered ? "-10%" : "8%"}
        w="320px"
        h="200px"
        borderRadius="20px"
        bg="linear-gradient(135deg, #00a4ef 0%, #0078d4 100%)"
        boxShadow="0 30px 60px rgba(0, 120, 212, 0.4)"
        transform={isCardsHovered ? "perspective(1500px) rotateY(-12deg) rotateX(6deg) rotateZ(-2deg)" : "perspective(1500px) rotateY(-12deg) rotateX(6deg) rotateZ(-4deg)"}
        p={6}
        zIndex={isCardsHovered ? 5 : 3}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        animate={isCardsHovered ? {
          scale: 1.1
        } : {
          y: [0, -18, 0]
        }}
        transition={{
          duration: isCardsHovered ? 0.5 : 7,
          repeat: isCardsHovered ? 0 : Infinity,
          ease: "easeInOut",
          delay: isCardsHovered ? 0 : 0.5
        }}
      >
        <VStack align="flex-start" spacing={4}>
          <Heading fontSize="4xl" fontWeight="bold" color="white">
            Microsoft
          </Heading>
          <Text fontSize="sm" color="whiteAlpha.900" fontWeight="medium">
            SDE Intern
          </Text>
        </VStack>
        <HStack justify="space-between" align="center">
          <VStack align="flex-start" spacing={0}>
            <Text fontSize="2xl" fontWeight="bold" color="white">
              ₹15L
            </Text>
            <Text fontSize="xs" color="whiteAlpha.800">
              avg package
            </Text>
          </VStack>
          <Icon as={FaCode} fontSize="3xl" color="white" opacity={0.3} />
        </HStack>
      </MotionBox>

      {/* Amazon Card - Position 3 (Center) */}
      <MotionBox
        position="absolute"
        top={isCardsHovered ? "38%" : "36%"}
        right={isCardsHovered ? "-15%" : "14%"}
        w="320px"
        h="200px"
        borderRadius="20px"
        bg="linear-gradient(135deg, #ff9900 0%, #ff6600 100%)"
        boxShadow="0 30px 60px rgba(255, 153, 0, 0.4)"
        transform={isCardsHovered ? "perspective(1500px) rotateY(-10deg) rotateX(5deg) rotateZ(2deg)" : "perspective(1500px) rotateY(-10deg) rotateX(5deg) rotateZ(0deg)"}
        p={6}
        zIndex={isCardsHovered ? 5 : 2}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        animate={isCardsHovered ? {
          scale: 1.1
        } : {
          y: [0, -16, 0]
        }}
        transition={{
          duration: isCardsHovered ? 0.5 : 8,
          repeat: isCardsHovered ? 0 : Infinity,
          ease: "easeInOut",
          delay: isCardsHovered ? 0 : 1
        }}
      >
        <VStack align="flex-start" spacing={4}>
          <Heading fontSize="4xl" fontWeight="bold" color="white">
            Amazon
          </Heading>
          <Text fontSize="sm" color="whiteAlpha.900" fontWeight="medium">
            SDE - I
          </Text>
        </VStack>
        <HStack justify="space-between" align="center">
          <VStack align="flex-start" spacing={0}>
            <Text fontSize="2xl" fontWeight="bold" color="white">
              ₹20L
            </Text>
            <Text fontSize="xs" color="whiteAlpha.800">
              avg package
            </Text>
          </VStack>
          <Icon as={FaTrophy} fontSize="3xl" color="white" opacity={0.3} />
        </HStack>
      </MotionBox>

      {/* Meta Card - Position 4 (Bottom-Right) */}
      <MotionBox
        position="absolute"
        top={isCardsHovered ? "58%" : "50%"}
        right={isCardsHovered ? "-20%" : "20%"}
        w="320px"
        h="200px"
        borderRadius="20px"
        bg="linear-gradient(135deg, #0084ff 0%, #0066cc 100%)"
        boxShadow="0 30px 60px rgba(0, 132, 255, 0.4)"
        transform={isCardsHovered ? "perspective(1500px) rotateY(-8deg) rotateX(4deg) rotateZ(5deg)" : "perspective(1500px) rotateY(-8deg) rotateX(4deg) rotateZ(4deg)"}
        p={6}
        zIndex={isCardsHovered ? 5 : 1}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        animate={isCardsHovered ? {
          scale: 1.1
        } : {
          y: [0, -14, 0]
        }}
        transition={{
          duration: isCardsHovered ? 0.5 : 9,
          repeat: isCardsHovered ? 0 : Infinity,
          ease: "easeInOut",
          delay: isCardsHovered ? 0 : 1.5
        }}
      >
        <VStack align="flex-start" spacing={4}>
          <Heading fontSize="4xl" fontWeight="bold" color="white">
            Meta
          </Heading>
          <Text fontSize="sm" color="whiteAlpha.900" fontWeight="medium">
            Software Engineer
          </Text>
        </VStack>
        <HStack justify="space-between" align="center">
          <VStack align="flex-start" spacing={0}>
            <Text fontSize="2xl" fontWeight="bold" color="white">
              ₹22L
            </Text>
            <Text fontSize="xs" color="whiteAlpha.800">
              avg package
            </Text>
          </VStack>
          <Icon as={FaRocket} fontSize="3xl" color="white" opacity={0.3} />
        </HStack>
      </MotionBox>
    </MotionBox>
  )
}

export default CompanyCards
