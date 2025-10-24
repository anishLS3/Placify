import { 
  Box, Button, Flex, HStack, Icon, Text, VStack, useDisclosure, 
  Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, 
  DrawerCloseButton
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FaBars } from 'react-icons/fa'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

const AppNavigation = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/preparation', label: 'Preparation' },
    { path: '/experience', label: 'Experience' },
    { path: '/post-experience', label: 'Post Experience' },
    { path: '/contact', label: 'Contact' }
  ]

  return (
    <>
      {/* Integrated Navbar - Apple Style */}
      <Box 
        position="fixed" 
        top={0} 
        left={0} 
        right={0} 
        zIndex={1000}
        bg="rgba(0, 0, 0, 0.8)"
        backdropFilter="blur(20px)"
        borderBottom="1px solid rgba(255,255,255,0.1)"
        px={4}
        py={2}
      >
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'} maxW="container.xl" mx="auto">
          {/* Logo */}
          <MotionBox
            as={RouterLink}
            to="/"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            display="flex"
            alignItems="center"
            gap={2}
          >
            <Text
              fontSize="lg"
              color="white"
              fontWeight="600"
              letterSpacing="tight"
            >
              Placify
            </Text>
          </MotionBox>

          {/* Desktop Navigation Menu */}
          <HStack
            as={'nav'}
            spacing={8}
            display={{ base: 'none', md: 'flex' }}
          >
            {navItems.map((item) => (
              <Button
                key={item.path}
                as={RouterLink}
                to={item.path}
                variant="ghost"
                color={item.path === '/contact' ? 'white' : 'whiteAlpha.800'}
                _hover={{ color: 'white', bg: 'transparent' }}
                fontWeight={item.path === '/contact' ? '500' : '400'}
                fontSize="sm"
                h="auto"
                py={1}
              >
                {item.label}
              </Button>
            ))}
          </HStack>

          {/* Mobile Menu Button */}
          <Button
            as="button"
            display={{ base: 'flex', md: 'none' }}
            variant="ghost"
            color="white"
            _hover={{ bg: 'whiteAlpha.100' }}
            onClick={onOpen}
            p={2}
          >
            <Icon as={FaBars} />
          </Button>
        </Flex>
      </Box>

      {/* Mobile Navigation Drawer */}
      <Drawer isOpen={isOpen} onClose={onClose} placement="right">
        <DrawerOverlay />
        <DrawerContent bg="#1d1d1f">
          <DrawerCloseButton color="white" />
          <DrawerHeader color="white">Menu</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  as={RouterLink}
                  to={item.path}
                  variant="ghost"
                  color={item.path === '/contact' ? 'white' : 'whiteAlpha.800'}
                  _hover={{ color: 'white' }}
                  fontWeight={item.path === '/contact' ? '500' : '400'}
                  justifyContent="flex-start"
                  onClick={onClose}
                >
                  {item.label}
                </Button>
              ))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default AppNavigation
