// api/auth.js
import { Alert } from 'react-native';

// UPDATED TO YOUR RENDER BACKEND URL
const API_BASE_URL = 'https://talkxpp.onrender.com';

export const signup = async (username, email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }
    return data;
  } catch (error) {
    console.error('Signup API error:', error);
    Alert.alert('Error', error.message || 'Signup failed');
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    return data;
  } catch (error) {
    console.error('Login API error:', error);
    Alert.alert('Error', error.message || 'Login failed');
    throw error;
  }
};

export const logout = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Logout failed');
    }
    return data;
  } catch (error) {
    console.error('Logout API error:', error);
    Alert.alert('Error', error.message || 'Logout failed');
    throw error;
  }
};