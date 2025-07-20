// src/components/MessageList.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment'; // For formatting timestamps

function MessageList({ messages, currentUserEmail }) {
  return (
    <View style={styles.messageList}>
      {messages.map((msg, index) => (
        <View
          key={index}
          style={[
            styles.messageItem,
            msg.senderUsername === 'system'
              ? styles.systemMessage
              : msg.senderUsername === currentUserEmail
              ? styles.myMessage
              : styles.otherMessage,
          ]}
        >
          {msg.senderUsername !== 'system' && (
            <Text
              style={[
                styles.senderInfo,
                msg.senderUsername === currentUserEmail ? styles.mySenderInfo : null,
              ]}
            >
              {msg.senderUsername === currentUserEmail ? 'You' : msg.senderUsername}:
            </Text>
          )}
          <Text style={styles.messageText}>{msg.text}</Text>
          <Text style={styles.messageTimestamp}>
            {moment(msg.timestamp).format('h:mm A')}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  messageList: {
    flexGrow: 1,
    padding: 15,
    marginBottom: 20,
    backgroundColor: '#E3E9F3', // --bg-medium
    borderRadius: 10,
  },
  messageItem: {
    marginBottom: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    maxWidth: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2, // For Android shadow
    flexDirection: 'column',
  },
  myMessage: {
    backgroundColor: '#D7F8D0', // Lighter green for my messages
    alignSelf: 'flex-end',
    marginLeft: 'auto',
    borderBottomRightRadius: 5, // Tail effect
  },
  otherMessage: {
    backgroundColor: '#FFFFFF', // White for others' messages
    alignSelf: 'flex-start',
    marginRight: 'auto',
    borderBottomLeftRadius: 5, // Tail effect
  },
  systemMessage: {
    backgroundColor: '#FFF3CD',
    color: '#664d03',
    textAlign: 'center',
    marginVertical: 8,
    alignSelf: 'center',
    fontStyle: 'italic',
    fontSize: 13, // --font-size-sm
    maxWidth: '70%',
    shadowOpacity: 0, // No shadow for system messages
    elevation: 0, // No shadow for system messages
    borderRadius: 8,
    paddingHorizontal: 15, // Ensure padding is consistent with other messages
    paddingVertical: 10,
  },
  senderInfo: {
    fontWeight: '700',
    fontSize: 12, // 0.8em
    marginBottom: 5,
    color: '#4A90E2', // --primary-color
  },
  mySenderInfo: {
    color: '#6DC04A', // --secondary-color
  },
  messageText: {
    fontSize: 16, // --font-size-base
    lineHeight: 22, // Approximate line height
    color: '#333', // --text-color-dark, inherited color
  },
  messageTimestamp: {
    fontSize: 11, // 0.7em
    color: '#999',
    marginTop: 6,
    alignSelf: 'flex-end',
  },
});

export default MessageList;