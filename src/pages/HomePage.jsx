// pages/HomePage.jsx
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView, // <-- Import KeyboardAvoidingView
  Platform,             // <-- Import Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAllRooms, createRoom } from '../api/rooms';
import { useSocket } from '../contexts/SocketContext.jsx';
import RoomList from '../components/RoomList.jsx';
import { UserContext } from '../../App.jsx';
import { logout as apiLogout } from '../api/auth';

const { width } = Dimensions.get('window');

function HomePage() {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { socket, isConnected } = useSocket();
  const { user, token, updateUserAndToken } = useContext(UserContext);
  const navigation = useNavigation();

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const fetchedRooms = await getAllRooms();
      setRooms(fetchedRooms);
    } catch (err) {
      setError(err.message || 'Failed to fetch rooms.');
      Alert.alert('Error', err.message || 'Failed to fetch rooms.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();

    if (socket) {
      const handleNewRoomCreated = (room) => {
        console.log("New room created via socket:", room);
        setRooms((prevRooms) => {
          if (!prevRooms.some(r => r._id === room._id || r.name === room.name)) {
            return [...prevRooms, room];
          }
          return prevRooms;
        });
      };

      socket.on('newRoomCreated', handleNewRoomCreated);

      return () => {
        socket.off('newRoomCreated', handleNewRoomCreated);
      };
    }
  }, [socket, isConnected]);

  const handleCreateRoom = async () => {
    setError('');
    if (!newRoomName.trim()) {
      setError('Room name cannot be empty.');
      return;
    }
    try {
      const createdRoom = await createRoom(newRoomName.trim(), token);
      console.log('Room created:', createdRoom);
      setNewRoomName('');
    } catch (err) {
      setError(err.message || 'Failed to create room.');
      Alert.alert('Error', err.message || 'Failed to create room.');
    }
  };

  const handleJoinRoom = (roomId) => {
    navigation.navigate('ChatRoom', { roomId });
  };

  const handleLogout = async () => {
    setError('');
    if (user && user.isGuest) {
      updateUserAndToken(null, null);
      navigation.replace('Auth');
      return;
    }
    try {
      await apiLogout(token);
      updateUserAndToken(null, null);
      navigation.replace('Auth');
    } catch (err) {
      setError(err.message || 'Logout failed.');
      Alert.alert('Error', err.message || 'Logout failed.');
    }
  };

  const isSmallScreen = width < 768;

  return (
    // Wrap the entire screen content that might be affected by the keyboard
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} // Adjust this offset if a fixed header is present
    >
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <View style={[styles.header, isSmallScreen && styles.headerSmall]}>
          <Text style={styles.welcomeText}>Welcome, {user?.email || 'Guest'}!</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>
              {user?.isGuest ? 'Exit Guest Mode' : 'Logout'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Available Chat Rooms</Text>
        {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
        {loading ? (
          <ActivityIndicator size="large" color="#4A90E2" style={styles.loadingIndicator} />
        ) : rooms.length === 0 ? (
          <Text style={styles.noRoomsText}>No rooms available. Be the first to create one!</Text>
        ) : (
          <RoomList rooms={rooms} onJoinRoom={handleJoinRoom} />
        )}

        <View style={styles.createRoom}>
          <Text style={styles.createRoomTitle}>Create New Room</Text>
          <View style={[styles.createRoomForm, isSmallScreen && styles.createRoomFormSmall]}>
            <TextInput
              style={[styles.createRoomInput, isSmallScreen && styles.createRoomInputSmall]}
              placeholder="Enter room name"
              placeholderTextColor="#999"
              value={newRoomName}
              onChangeText={setNewRoomName}
            />
            <TouchableOpacity style={[styles.createRoomButton, isSmallScreen && styles.createRoomButtonSmall]} onPress={handleCreateRoom}>
              <Text style={styles.createRoomButtonText}>Create Room</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1, // Crucial for KeyboardAvoidingView to take full height
    backgroundColor: '#F7F9FC',
  },
  scrollContentContainer: {
    flexGrow: 1, // Allows ScrollView content to grow and push elements up
    paddingBottom: 30, // Add some bottom padding
  },
  header: {
    backgroundColor: '#4A90E2',
    paddingVertical: 18,
    paddingHorizontal: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  headerSmall: {
    flexDirection: 'column',
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  welcomeText: {
    margin: 0,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#fff',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    color: '#4A90E2',
    marginTop: 30,
    marginBottom: 30,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
  },
  errorMessage: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    marginHorizontal: 20,
    textAlign: 'center',
    color: '#dc3545',
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#dc3545',
    fontWeight: '500',
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  noRoomsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginVertical: 20,
  },
  createRoom: {
    marginTop: 40,
    paddingTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#DDE5EE',
    alignItems: 'center',
  },
  createRoomTitle: {
    marginBottom: 20,
    color: '#333',
    fontSize: 18,
    fontWeight: '600',
  },
  createRoomForm: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
  },
  createRoomFormSmall: {
    flexDirection: 'column',
    width: '90%',
  },
  createRoomInput: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DDE5EE',
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
    marginRight: 10,
  },
  createRoomInputSmall: {
    width: '100%',
    marginBottom: 15,
    marginRight: 0,
  },
  createRoomButton: {
    backgroundColor: '#6DC04A',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  createRoomButtonSmall: {
    width: '100%',
    paddingVertical: 12,
  },
  createRoomButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default HomePage;