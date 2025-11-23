import React, { useState } from 'react';
import { Box, Flex, useBreakpointValue, IconButton, Drawer, DrawerContent, DrawerOverlay } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { RiMenuLine } from 'react-icons/ri';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarDisplay = useBreakpointValue({ base: 'none', lg: 'block' });
  const showMobileMenu = useBreakpointValue({ base: true, lg: false });

  return (
    <Flex h="100vh" bg="#000000">
      {/* Desktop Sidebar */}
      <Box display={sidebarDisplay}>
        <Sidebar />
      </Box>
      
      {/* Mobile Sidebar Drawer */}
      <Drawer isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} placement="left" size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </DrawerContent>
      </Drawer>
      
      {/* Main Content Area */}
      <Flex direction="column" flex={1} overflow="hidden">
        {/* Mobile Menu + Header */}
        <Flex align="center" bg="rgba(0, 0, 0, 0.85)" px={{ base: 4, md: 6 }} py={4}>
          {showMobileMenu && (
            <IconButton
              icon={<RiMenuLine />}
              variant="ghost"
              color="white"
              onClick={() => setIsSidebarOpen(true)}
              mr={4}
              aria-label="Open menu"
              _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
            />
          )}
          <Box flex={1}>
            <Header />
          </Box>
        </Flex>
        
        {/* Page Content */}
        <Box 
          flex={1} 
          overflow="auto" 
          bg="#000000"
          p={{ base: 4, md: 6 }}
          className="apple-fade-in"
        >
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
};

export default Layout;