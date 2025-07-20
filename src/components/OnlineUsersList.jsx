// components/OnlineUsersList.jsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView }  from 'react-native';// <-- Import ScrollView

function OnlineUsersList({ users }) {
  return (
    <View style={styles.onlineUsersList}>
      <Text style={styles.title}>Online Users ({users.length})</Text>
      {users.length === 0 ? (
        <Text style={styles.noUsersText}>No users online.</Text>
      ) : (
        // Wrap the user list in a ScrollView
        <ScrollView style={styles.userListScroll}>
          {users.map((user, index) => (
            <View key={index} style={styles.userItem}>
              <Text style={styles.userDot}>•</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  onlineUsersList: {
    padding: 25,
    flex: 1, // Allow this component to fill available space within its parent
             // This is important because the ScrollView inside needs a constrained height.
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginTop: 0,
    marginBottom: 20,
    fontSize: 18,
    fontWeight: '600',
  },
  noUsersText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
  userListScroll: {
    // No specific height here; it will take the height provided by its parent (onlineUsersList's flex)
    // and its grand-parent (onlineUsersSidebar's height in ChatRoomPage)
  },
  userItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 8,
    backgroundColor: '#EBF5FE',
    borderWidth: 1,
    borderColor: '#C6E0F8',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDot: {
    color: '#6DC04A',
    fontSize: 22,
    marginRight: 8,
    lineHeight: 22,
  },
  userEmail: {
    fontSize: 14,
    color: '#2F69A6',
    fontWeight: '500',
  },
});

export default OnlineUsersList;