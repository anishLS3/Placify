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
  Button,
  Avatar,
} from '@chakra-ui/react';
import { RiSettingsLine, RiUserLine, RiLogoutBoxLine } from 'react-icons/ri';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Box
      bg="transparent"
      w="full"
    >
      <Flex justify="space-between" align="center" w="full">
        {/* Page Title or Breadcrumb could go here */}
        <Box>
          <Text fontSize={{ base: "md", md: "lg" }} fontWeight="semibold" color="white" isTruncated>
            Welcome back, {user?.name || 'Admin'}
          </Text>
        </Box>

        {/* Right Side - User Menu */}
        <HStack spacing={{ base: 2, md: 4 }}>
          {/* User Menu */}
          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              size={{ base: "xs", md: "sm" }}
              color="white"
              _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
              leftIcon={
                <Avatar
                  size={{ base: "xs", md: "sm" }}
                  name={user?.name || 'Admin'}
                  src={user?.avatar}
                  bg="brand.500"
                />
              }
            >
              <Text color="white" display={{ base: "none", sm: "block" }} isTruncated maxW="100px">
                {user?.name || 'Admin'}
              </Text>
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