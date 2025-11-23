import React from 'react';
import {
  Box,
  Flex,
  HStack,
  Text,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Badge,
  Button,
  Avatar,
} from '@chakra-ui/react';
import { RiBellLine, RiSettingsLine, RiUserLine, RiLogoutBoxLine } from 'react-icons/ri';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Box
      bg="rgba(0, 0, 0, 0.85)"
      backdropFilter="blur(20px)"
      sx={{
        WebkitBackdropFilter: "blur(20px)",
      }}
      borderBottom="1px solid rgba(255, 255, 255, 0.1)"
      px={6}
      py={4}
      className="apple-glass"
    >
      <Flex justify="space-between" align="center">
        {/* Page Title or Breadcrumb could go here */}
        <Box>
          <Text fontSize="lg" fontWeight="semibold" color="white">
            Welcome back, {user?.name || 'Admin'}
          </Text>
        </Box>

        {/* Right Side - Notifications & User Menu */}
        <HStack spacing={4}>
          {/* Notifications */}
          <Menu>
            <MenuButton
              as={IconButton}
              icon={
                <Box position="relative">
                  <RiBellLine size={20} />
                  {unreadCount > 0 && (
                    <Badge
                      colorScheme="red"
                      variant="solid"
                      borderRadius="full"
                      position="absolute"
                      top="-8px"
                      right="-8px"
                      minW="18px"
                      h="18px"
                      fontSize="xs"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                  )}
                </Box>
              }
              variant="ghost"
              size="lg"
              aria-label="Notifications"
              color="white"
              _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
            />
            <MenuList 
              maxH="400px" 
              overflowY="auto" 
              w="320px"
              bg="rgba(0, 0, 0, 0.9)"
              border="1px solid rgba(255, 255, 255, 0.1)"
              color="white"
            >
              <Flex justify="space-between" align="center" px={3} py={2}>
                <Text fontWeight="semibold">Notifications</Text>
                {unreadCount > 0 && (
                  <Button size="xs" variant="ghost" onClick={markAllAsRead}>
                    Mark all read
                  </Button>
                )}
              </Flex>
              <MenuDivider />
              {notifications.length === 0 ? (
                <MenuItem isDisabled>
                  <Text color="gray.500">No notifications</Text>
                </MenuItem>
              ) : (
                notifications.slice(0, 10).map((notification) => (
                  <MenuItem key={notification.id} py={3} _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}>
                    <Box w="full">
                      <Flex justify="space-between" align="flex-start">
                        <Box flex={1}>
                          <Text fontWeight={notification.read ? 'normal' : 'semibold'} fontSize="sm" color="white">
                            {notification.title}
                          </Text>
                          <Text color="gray.400" fontSize="xs" mt={1}>
                            {notification.message}
                          </Text>
                          <Text color="gray.500" fontSize="xs" mt={1}>
                            {new Date(notification.timestamp).toLocaleString()}
                          </Text>
                        </Box>
                        {!notification.read && (
                          <Badge colorScheme="blue" variant="solid" size="sm" ml={2}>
                            New
                          </Badge>
                        )}
                      </Flex>
                    </Box>
                  </MenuItem>
                ))
              )}
            </MenuList>
          </Menu>

          {/* User Menu */}
          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              size="sm"
              color="white"
              _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
              leftIcon={
                <Avatar
                  size="sm"
                  name={user?.name || 'Admin'}
                  src={user?.avatar}
                  bg="brand.500"
                />
              }
            >
              <Text color="white">{user?.name || 'Admin'}</Text>
            </MenuButton>
            <MenuList
              bg="rgba(0, 0, 0, 0.9)"
              border="1px solid rgba(255, 255, 255, 0.1)"
              color="white"
            >
              <MenuItem icon={<RiUserLine />} _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}>
                Profile
              </MenuItem>
              <MenuItem icon={<RiSettingsLine />} _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}>
                Settings
              </MenuItem>
              <MenuDivider borderColor="rgba(255, 255, 255, 0.1)" />
              <MenuItem icon={<RiLogoutBoxLine />} onClick={handleLogout} _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header;