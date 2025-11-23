import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const toast = useToast();
  const { user, token } = useAuth();

  useEffect(() => {
    if (user && token) {
      // Initialize socket connection
      const newSocket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001', {
        auth: {
          token: token
        }
      });

      setSocket(newSocket);

      // Listen for new experience submissions
      newSocket.on('newExperienceSubmitted', (data) => {
        const notification = {
          id: Date.now(),
          type: 'experience_submitted',
          title: 'New Experience Submitted',
          message: `${data.studentName} submitted an experience for review`,
          experienceId: data.experienceId,
          timestamp: new Date(),
          read: false
        };

        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);

        // Show toast notification
        toast({
          title: 'New Experience Submitted',
          description: notification.message,
          status: 'info',
          duration: 5000,
          isClosable: true,
          position: 'top-right'
        });
      });

      // Listen for other notification types
      newSocket.on('experienceUpdated', (data) => {
        const notification = {
          id: Date.now(),
          type: 'experience_updated',
          title: 'Experience Updated',
          message: `Experience ${data.experienceId} has been updated`,
          experienceId: data.experienceId,
          timestamp: new Date(),
          read: false
        };

        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      });

      // Cleanup on component unmount
      return () => {
        newSocket.close();
      };
    }
  }, [user, token, toast]);

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const clearNotification = (notificationId) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    socket
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};