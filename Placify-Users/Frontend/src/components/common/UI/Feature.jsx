import { Box, Heading, Text, Stack, Flex, Icon } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const MotionBox = motion(Box)
const MotionStack = motion(Stack)
const MotionFlex = motion(Flex)
const MotionHeading = motion(Heading)
const MotionText = motion(Text)

const Feature = ({ icon, title, text, index }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: index * 0.2
      }
    }
  }

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        delay: index * 0.2 + 0.3
      }
    }
  }

  return (
    <MotionBox
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover={{ y: -12, scale: 1.02 }}
    >
      <MotionStack
        bg="white"
        borderRadius="xl"
        p={8}
        textAlign="center"
        boxShadow="lg"
        position="relative"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: "xl",
          background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
          opacity: 0,
          transition: "opacity 0.3s"
        }}
        _hover={{
          _before: {
            opacity: 1
          }
        }}
        whileHover={{ 
          y: -12,
          rotateX: 10,
          rotateY: -10,
          boxShadow: "2xl"
        }}
        transition={{ 
          duration: 0.4,
          type: "spring",
          stiffness: 300
        }}
      >
        <MotionFlex
          w={16}
          h={16}
          align={'center'}
          justify={'center'}
          color={'white'}
          rounded={'full'}
          bg={'purple.500'}
          mb={4}
          mx="auto"
          variants={iconVariants}
          whileHover={{ 
            scale: 1.2,
            rotate: 360,
            boxShadow: "0 0 20px rgba(49, 130, 206, 0.4)"
          }}
          animate={{
            boxShadow: ["0 0 0px rgba(49, 130, 206, 0)", "0 0 20px rgba(49, 130, 206, 0.4)", "0 0 0px rgba(49, 130, 206, 0)"],
          }}
          transition={{ 
            duration: 0.5,
            type: "spring",
            stiffness: 200,
            boxShadow: {
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }
          }}
        >
          <Icon as={icon} w={8} h={8} />
        </MotionFlex>
        <MotionHeading
          size="md"
          mb={2}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
        >
          {title}
        </MotionHeading>
        <MotionText
          color={'gray.600'}
          fontSize={'sm'}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
        >
          {text}
        </MotionText>
      </MotionStack>
    </MotionBox>
  )
}

export default Feature
