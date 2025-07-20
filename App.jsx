// App.jsx (at project root)
import React, { useState, useEffect, useCallback, createContext } from 'react';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthPage from './src/pages/AuthPage.jsx';
import HomePage from './src/pages/HomePage.jsx';
import ChatRoomPage from './src/pages/ChatRoomPage.jsx';
import { SocketProvider } from './src/contexts/SocketContext.jsx';

// Create a UserContext to manage user state globally
export const UserContext = createContext(null);

const Stack = createNativeStackNavigator();

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const updateUserAndToken = useCallback(async (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    try {
      if (userData) {
        await AsyncStorage.setItem('user', JSON.stringify(userData));
      } else {
        await AsyncStorage.removeItem('user');
      }
      if (userToken) {
        await AsyncStorage.setItem('token', userToken);
      } else {
        await AsyncStorage.removeItem('token');
      }
    } catch (error) {
      console.error("Failed to save/remove data from AsyncStorage:", error);
    }
  }, []);

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const storedToken = await AsyncStorage.getItem('token');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        setToken(storedToken);
      } catch (error) {
        console.error("Failed to load user/token from AsyncStorage:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadStoredData();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading application...</Text>
      </View>
    );
  }

  // UPDATED TO YOUR RENDER BACKEND URL
  const backendUrl = 'https://talkxpp.onrender.com';

  if (!backendUrl) {
    return (
      <View style={styles.errorScreen}>
        <Text style={styles.errorText}>Configuration Error: Backend URL missing.</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <UserContext.Provider value={{ user, token, updateUserAndToken }}>
        <SocketProvider backendUrl={backendUrl}>
          <Stack.Navigator initialRouteName={user ? 'Home' : 'Auth'} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Auth" component={AuthPage} />
            <Stack.Screen name="Home" component={HomePage} />
            <Stack.Screen name="ChatRoom" component={ChatRoomPage} />
          </Stack.Navigator>
        </SocketProvider>
      </UserContext.Provider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#4A90E2',
  },
  errorScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
  },
  errorText: {
    fontSize: 18,
    color: '#dc3545',
    textAlign: 'center',
    padding: 20,
  },
});

export default App;