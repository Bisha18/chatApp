// api/rooms.js
import { Alert } from 'react-native';

// UPDATED TO YOUR RENDER BACKEND URL
const API_BASE_URL = 'https://talkxpp.onrender.com';

export const getAllRooms = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/rooms/all`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch rooms');
    }
    return data;
  } catch (error) {
    console.error('Get all rooms API error:', error);
    Alert.alert('Error', error.message || 'Failed to fetch rooms');
    throw error;
  }
};

export const createRoom = async (name, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/rooms/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'x-auth-token': token, // Backend room creation doesn't seem to require auth
      },
      body: JSON.stringify({ name }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create room');
    }
    return data;
  } catch (error) {
    console.error('Create room API error:', error);
    Alert.alert('Error', error.message || 'Failed to create room');
    throw error;
  }
};