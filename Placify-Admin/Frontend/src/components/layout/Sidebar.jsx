import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Button,
  Divider,
  Badge,
} from '@chakra-ui/react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  RiDashboardLine,
  RiFileTextLine,
  RiContactsLine,
  RiBarChartLine,
  RiUserLine,
  RiLogoutBoxLine
} from 'react-icons/ri';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ onClose }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  const navItems = [
    {
      label: 'Dashboard',
      icon: RiDashboardLine,
      path: '/'
    },
    {
      label: 'Experiences',
      icon: RiFileTextLine,
      path: '/experiences'
    },
    {
      label: 'Contacts',
      icon: RiContactsLine,
      path: '/contacts'
    },
    {
      label: 'Analytics',
      icon: RiBarChartLine,
      path: '/analytics'
    },
    {
      label: 'Profile',
      icon: RiUserLine,
      path: '/profile'
    }
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Box
      w={{ base: "100%", lg: "260px" }}
      bg="#1c1c1e"
      borderRight="1px"
      borderColor="rgba(255, 255, 255, 0.1)"
      p={{ base: 4, lg: 6 }}
      display="flex"
      flexDirection="column"
      h="full"
      className="glass-effect"
      backdropFilter="blur(20px)"
    >
      {/* Logo */}
      <Box mb={8}>
        <Text
          fontSize="2xl"
          fontWeight="bold"
          bgGradient="linear(to-r, brand.500, accent.500)"
          bgClip="text"
          fontFamily="heading"
          color="white"
        >
          Placify Admin
        </Text>
      </Box>

      {/* Navigation */}
      <VStack spacing={2} align="stretch" flex={1}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Button
              key={item.path}
              as={NavLink}
              to={item.path}
              variant={isActive ? 'solid' : 'ghost'}
              colorScheme={isActive ? 'brand' : undefined}
              justifyContent="flex-start"
              size="md"
              h="48px"
              px={4}
              bg={isActive ? 'brand.500' : 'transparent'}
              color={isActive ? 'white' : 'white'}
              className="apple-button"
              onClick={handleNavClick}
              _hover={{
                bg: isActive ? 'brand.500' : 'whiteAlpha.100',
                transform: 'translateX(4px)',
              }}
              transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
            >
              <HStack spacing={3} w="full">
                <Icon as={item.icon} boxSize={5} />
                <Text fontWeight="medium">{item.label}</Text>
                {item.badge && (
                  <Badge
                    colorScheme="red"
                    variant="solid"
                    borderRadius="full"
                    minW="20px"
                    h="20px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="xs"
                    ml="auto"
                  >
                    {item.badge}
                  </Badge>
                )}
              </HStack>
            </Button>
          );
        })}
      </VStack>

      {/* Logout */}
      <Box mt={6}>
        <Divider mb={4} />
        <Button
          variant="ghost"
          colorScheme="red"
          justifyContent="flex-start"
          size="md"
          h="48px"
          px={4}
          w="full"
          onClick={handleLogout}
        >
          <HStack spacing={3}>
            <Icon as={RiLogoutBoxLine} boxSize={5} />
            <Text fontWeight="medium">Logout</Text>
          </HStack>
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;