// components/TypingIndicator.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function TypingIndicator({ typingUsers }) {
  if (typingUsers.length === 0) {
    return <View style={styles.typingIndicator} />;
  }

  const message = typingUsers.length === 1
    ? `${typingUsers[0]} is typing...`
    : `${typingUsers.join(', ')} are typing...`;

  return (
    <View style={styles.typingIndicator}>
      <Text style={styles.typingText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  typingIndicator: {
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  typingText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default TypingIndicator;