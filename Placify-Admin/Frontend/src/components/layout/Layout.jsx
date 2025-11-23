import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  return (
    <Flex h="100vh" bg="#000000">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <Flex direction="column" flex={1} overflow="hidden">
        {/* Header */}
        <Header />
        
        {/* Page Content */}
        <Box 
          flex={1} 
          overflow="auto" 
          bg="#000000"
          p={0}
          className="apple-fade-in"
        >
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
};

export default Layout;