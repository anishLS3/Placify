import { 
  Box, Flex, Text, Button, HStack, Icon, 
  Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, VStack
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FaBars } from 'react-icons/fa'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

const HomeNavigation = ({ isOpen, onOpen, onClose }) => {
  return (
    <>
      {/* Integrated Navbar */}
      <Box 
        position="absolute" 
        top={0} 
        left={0} 
        right={0} 
        zIndex={20}
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

          {/* Navigation Menu */}
          <HStack
            as={'nav'}
            spacing={8}
            display={{ base: 'none', md: 'flex' }}
          >
            <Button
              as={RouterLink}
              to="/"
              variant="ghost"
              color="white"
              _hover={{ color: 'white', bg: 'transparent' }}
              fontWeight="400"
              fontSize="sm"
              h="auto"
              py={1}
            >
              Home
            </Button>

            <Button
              as={RouterLink}
              to="/preparation"
              variant="ghost"
              color="whiteAlpha.800"
              _hover={{ color: 'white', bg: 'transparent' }}
              fontWeight="400"
              fontSize="sm"
              h="auto"
              py={1}
            >
              Preparation
            </Button>

            <Button
              as={RouterLink}
              to="/experience"
              variant="ghost"
              color="whiteAlpha.800"
              _hover={{ color: 'white', bg: 'transparent' }}
              fontWeight="400"
              fontSize="sm"
              h="auto"
              py={1}
            >
              Experience
            </Button>

            <Button
              as={RouterLink}
              to="/post-experience"
              variant="ghost"
              color="whiteAlpha.800"
              _hover={{ color: 'white', bg: 'transparent' }}
              fontWeight="400"
              fontSize="sm"
              h="auto"
              py={1}
            >
              Post Experience
            </Button>

            <Button
              as={RouterLink}
              to="/contact"
              variant="ghost"
              color="whiteAlpha.800"
              _hover={{ color: 'white', bg: 'transparent' }}
              fontWeight="400"
              fontSize="sm"
              h="auto"
              py={1}
            >
              Contact
            </Button>

            <Button
              as="button"
              onClick={(e) => {
                e.preventDefault()
                const faqSection = document.getElementById('faq')
                if (faqSection) {
                  faqSection.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              variant="ghost"
              color="whiteAlpha.800"
              _hover={{ color: 'white', bg: 'transparent' }}
              fontWeight="400"
              fontSize="sm"
              h="auto"
              py={1}
              type="button"
            >
              FAQ
            </Button>

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
              <Button
                as={RouterLink}
                to="/"
                variant="ghost"
                color="white"
                _hover={{ color: 'white' }}
                fontWeight="500"
                justifyContent="flex-start"
                onClick={onClose}
              >
                Home
              </Button>
              <Button
                as={RouterLink}
                to="/preparation"
                variant="ghost"
                color="whiteAlpha.800"
                _hover={{ color: 'white' }}
                fontWeight="400"
                justifyContent="flex-start"
                onClick={onClose}
              >
                Preparation
              </Button>
              <Button
                as={RouterLink}
                to="/experience"
                variant="ghost"
                color="whiteAlpha.800"
                _hover={{ color: 'white' }}
                fontWeight="400"
                justifyContent="flex-start"
                onClick={onClose}
              >
                Experience
              </Button>
              <Button
                as={RouterLink}
                to="/post-experience"
                variant="ghost"
                color="whiteAlpha.800"
                _hover={{ color: 'white' }}
                fontWeight="400"
                justifyContent="flex-start"
                onClick={onClose}
              >
                Post Experience
              </Button>
              <Button
                as={RouterLink}
                to="/contact"
                variant="ghost"
                color="whiteAlpha.800"
                _hover={{ color: 'white' }}
                fontWeight="400"
                justifyContent="flex-start"
                onClick={onClose}
              >
                Contact
              </Button>
              <Button
                as="button"
                onClick={(e) => {
                  e.preventDefault()
                  onClose()
                  const faqSection = document.getElementById('faq')
                  if (faqSection) {
                    faqSection.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                variant="ghost"
                color="whiteAlpha.800"
                _hover={{ color: 'white' }}
                fontWeight="400"
                justifyContent="flex-start"
              >
                FAQ
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default HomeNavigation
