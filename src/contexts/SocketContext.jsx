// contexts/SocketContext.jsx
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Alert } from 'react-native';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children, backendUrl }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectAttempts = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_INTERVAL = 2000;

  useEffect(() => {
    if (!backendUrl) {
      console.error("Backend URL is not provided for Socket.io connection.");
      Alert.alert("Configuration Error", "Backend URL is not defined for Socket.io.");
      return;
    }

    let currentSocket = io(backendUrl, {
      reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
      reconnectionDelay: RECONNECT_INTERVAL,
      transports: ['websocket', 'polling'],
    });

    currentSocket.on('connect', () => {
      console.log('Socket.io connected:', currentSocket.id);
      setIsConnected(true);
      reconnectAttempts.current = 0;
    });

    currentSocket.on('disconnect', (reason) => {
      console.log('Socket.io disconnected:', reason);
      setIsConnected(false);
      if (reason === 'io server disconnect') {
        console.log("Server intentionally disconnected.");
      } else {
        console.log("Socket client will attempt to reconnect.");
      }
    });

    currentSocket.on('connect_error', (error) => {
      console.error('Socket.io connection error:', error.message);
      if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts.current++;
        console.log(`Attempting to reconnect (${reconnectAttempts.current}/${MAX_RECONNECT_ATTEMPTS})...`);
      } else {
        console.error("Max reconnect attempts reached. Please check server status.");
        Alert.alert("Connection Error", "Could not connect to the chat server. Please check your internet connection or try again later.");
      }
    });

    currentSocket.on('error', (errorMessage) => {
      console.error("Socket error from server:", errorMessage);
      Alert.alert(`Server Error: ${errorMessage}`);
    });

    setSocket(currentSocket);

    return () => {
      if (currentSocket) {
        currentSocket.disconnect();
        console.log('Socket.io client disconnected on component unmount.');
      }
    };
  }, [backendUrl]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};