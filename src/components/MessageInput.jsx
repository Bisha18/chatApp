// components/MessageInput.jsx
import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

function MessageInput({ onSendMessage, onTyping }) {
  const [message, setMessage] = useState('');
  const typingTimerRef = useRef(null);
  const isTypingRef = useRef(false);

  const handleInputChange = (text) => {
    setMessage(text);

    if (!isTypingRef.current) {
      onTyping(true);
      isTypingRef.current = true;
    }

    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }

    typingTimerRef.current = setTimeout(() => {
      onTyping(false);
      isTypingRef.current = false;
    }, 1500);
  };

  const handleSubmit = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      if (isTypingRef.current) {
        onTyping(false);
        isTypingRef.current = false;
        if (typingTimerRef.current) {
          clearTimeout(typingTimerRef.current);
        }
      }
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
      if (isTypingRef.current) {
        onTyping(false);
      }
    };
  }, [onTyping]);

  return (
    <View style={styles.messageInput}>
      <TextInput
        style={styles.textInput}
        value={message}
        onChangeText={handleInputChange}
        placeholder="Type a message..."
        placeholderTextColor="#999"
        multiline={false}
      />
      <TouchableOpacity style={styles.sendButton} onPress={handleSubmit}>
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  messageInput: {
    flexDirection: 'row',
    marginTop: 'auto',
  },
  textInput: {
    flexGrow: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#DDE5EE',
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 25,
    paddingHorizontal: 25,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MessageInput;