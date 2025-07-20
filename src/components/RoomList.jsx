// components/RoomList.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

function RoomList({ rooms, onJoinRoom }) {
  if (!rooms || rooms.length === 0) {
    return null;
  }

  return (
    <View style={styles.roomListContainer}>
      <Text style={styles.title}>Join an Existing Room</Text>
      <View style={styles.roomList}>
        {rooms.map((room, index) => (
          <View
            key={room._id}
            style={[
              styles.roomItem,
              index === rooms.length - 1 && styles.lastRoomItem,
            ]}
          >
            <Text style={styles.roomName}>{room.name}</Text>
            <TouchableOpacity
              style={styles.joinButton}
              onPress={() => onJoinRoom(room._id)}
            >
              <Text style={styles.joinButtonText}>Join</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  roomListContainer: {
    width: '100%',
    maxWidth: 700,
    alignSelf: 'center',
    marginBottom: 30,
  },
  title: {
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  roomList: {
    borderWidth: 1,
    borderColor: '#DDE5EE',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  roomItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#DDE5EE',
    backgroundColor: '#FFFFFF',
  },
  lastRoomItem: {
    borderBottomWidth: 0,
  },
  roomName: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  joinButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RoomList;