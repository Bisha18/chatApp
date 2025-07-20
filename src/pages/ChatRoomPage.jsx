// pages/ChatRoomPage.jsx
import React, { useEffect, useState, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSocket } from '../contexts/SocketContext.jsx';
import { UserContext } from '../../App.jsx';
import MessageList from '../components/MessageList.jsx';
import MessageInput from '../components/MessageInput.jsx';
import OnlineUsersList from '../components/OnlineUsersList.jsx';
import TypingIndicator from '../components/TypingIndicator.jsx';

const { width, height } = Dimensions.get('window'); // <-- Get height here

function ChatRoomPage() {
  const route = useRoute();
  const navigation = useNavigation();
  const { roomId } = route.params;

  const { socket, isConnected } = useSocket();
  const { user } = useContext(UserContext);

  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const typingTimeoutRef = useRef({});
  const [currentRoomName, setCurrentRoomName] = useState('Loading...');

  const scrollViewRef = useRef(null);

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    if (!user) {
      console.log('User not logged in, redirecting to auth.');
      const timeout = setTimeout(() => {
        navigation.replace('Auth');
      }, 1000);
      return () => clearTimeout(timeout);
    }

    if (!isConnected || !socket) {
      console.log('Socket not connected, waiting...');
      return;
    }

    socket.emit('joinRoom', { email: user.email, roomId: roomId, userId: user.id });
    console.log(`Attempting to join room ${roomId} as ${user.email}`);

    const handleChatHistory = (history) => {
      console.log('Received chat history:', history);
      setMessages(history);
      scrollToBottom();
    };

    const handleMessage = (msg) => {
      console.log('Received new message:', msg);
      if (msg.senderUsername === 'system' && msg.text.includes('Welcome to')) {
        const roomNameMatch = msg.text.match(/Welcome to (.*?)!,/);
        if (roomNameMatch && roomNameMatch[1]) {
          setCurrentRoomName(roomNameMatch[1]);
        }
        setMessages((prev) => [...prev, msg]);
      } else {
        setMessages((prevMessages) => [...prevMessages, msg]);
      }
      scrollToBottom();
    };

    const handleRoomUsers = (users) => {
      console.log('Received online users:', users);
      setOnlineUsers(users);
    };

    const handleTypingStatus = ({ email: typingEmail, isTyping }) => {
        setTypingUsers(prev => {
            const newState = { ...prev };
            if (typingEmail !== user.email) {
                if (isTyping) {
                    newState[typingEmail] = true;
                    if (typingTimeoutRef.current[typingEmail]) {
                        clearTimeout(typingTimeoutRef.current[typingEmail]);
                    }
                    typingTimeoutRef.current[typingEmail] = setTimeout(() => {
                        setTypingUsers(prevTimeout => {
                            const newTimeoutState = { ...prevTimeout };
                            delete newTimeoutState[typingEmail];
                            return newTimeoutState;
                        });
                    }, 2000);
                } else {
                    delete newState[typingEmail];
                    if (typingTimeoutRef.current[typingEmail]) {
                        clearTimeout(typingTimeoutRef.current[typingEmail]);
                        delete typingTimeoutRef.current[typingEmail];
                    }
                }
            }
            return newState;
        });
    };

    socket.on('chatHistory', handleChatHistory);
    socket.on('message', handleMessage);
    socket.on('roomUsers', handleRoomUsers);
    socket.on('typingStatus', handleTypingStatus);

    return () => {
      socket.off('chatHistory', handleChatHistory);
      socket.off('message', handleMessage);
      socket.off('roomUsers', handleRoomUsers);
      socket.off('typingStatus', handleTypingStatus);

      Object.values(typingTimeoutRef.current).forEach(clearTimeout);
      typingTimeoutRef.current = {};
    };
  }, [roomId, socket, isConnected, user, navigation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (text) => {
    if (socket && text.trim()) {
      socket.emit('chatMessage', text.trim());
    }
  };

  const handleTyping = (isTyping) => {
    if (socket) {
      socket.emit('typing', isTyping);
    }
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Redirecting to Login...</Text>
      </View>
    );
  }

  const isLargeScreen = width >= 992;

  return (
    <View style={styles.outerContainer}> {/* Added outer container for overall flex:1 */}
      <View style={[styles.chatRoomPage, !isLargeScreen && styles.chatRoomPageSmall]}>
        <KeyboardAvoidingView
          style={[styles.chatMain, !isLargeScreen && styles.chatMainSmall]}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <Text style={styles.roomTitle}>Room: {currentRoomName}</Text>
          <ScrollView style={styles.messageListContainer} ref={scrollViewRef}>
            <MessageList messages={messages} currentUserEmail={user?.email} />
          </ScrollView>
          <TypingIndicator typingUsers={Object.keys(typingUsers)} />
          <MessageInput onSendMessage={handleSendMessage} onTyping={handleTyping} />
        </KeyboardAvoidingView>

        <View style={[styles.onlineUsersSidebar, !isLargeScreen && styles.onlineUsersSidebarSmall]}>
          <OnlineUsersList users={onlineUsers} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: { // Ensures the entire screen space is managed by flex
    flex: 1,
    backgroundColor: '#F7F9FC', // Global background color
  },
  chatRoomPage: {
    flex: 1, // Takes full height of outerContainer
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 20,
    // background color on outer container already
  },
  chatRoomPageSmall: {
    flexDirection: 'column',
    padding: 15,
  },
  chatMain: {
    flex: 3, // In row layout, takes 3 parts of horizontal space
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 5,
    padding: 25,
    flexDirection: 'column',
    marginRight: 10,
  },
  chatMainSmall: {
    flex: 1, // In column layout, chat takes most of the vertical space
    width: '100%',
    marginRight: 0,
    marginBottom: 25,
  },
  onlineUsersSidebar: {
    flex: 1, // In row layout, takes 1 part of horizontal space
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 5,
    padding: 25,
    flexDirection: 'column',
    marginLeft: 10,
  },
  onlineUsersSidebarSmall: {
    flex: 0, // Disable flex in column mode to use fixed height
    width: '100%',
    height: height * 0.3, // Take 30% of screen height (adjustable percentage)
                           // Make sure this height is enough to show some users and scroll
    marginTop: 0,
    marginLeft: 0,
  },
  roomTitle: {
    textAlign: 'center',
    color: '#4A90E2',
    marginTop: 0,
    marginBottom: 20,
    fontSize: 22,
    fontWeight: '700',
  },
  messageListContainer: {
    flex: 1, // Crucial for ScrollView to take available space
    borderWidth: 1,
    borderColor: '#DDE5EE',
    borderRadius: 10,
    backgroundColor: '#E3E9F3',
    padding: 0,
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4A90E2',
  },
});

export default ChatRoomPage;