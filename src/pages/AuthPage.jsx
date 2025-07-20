// pages/AuthPage.jsx
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView, // <-- Import KeyboardAvoidingView
  Platform,             // <-- Import Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { login, signup } from '../api/auth';
import { UserContext } from '../../App.jsx';

const { width } = Dimensions.get('window');

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigation = useNavigation();
  const { updateUserAndToken } = useContext(UserContext);

  const handleSubmit = async () => {
    setError('');
    setSuccessMessage('');

    if (!email || !password || (!isLogin && !username)) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      if (isLogin) {
        const data = await login(email, password);
        updateUserAndToken({ id: data.userId, email: data.email }, data.token);
        navigation.replace('Home');
      } else {
        const data = await signup(username, email, password);
        setSuccessMessage('Registration successful! Please log in.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    }
  };

  const handleGuestLogin = () => {
    if (!email.trim()) {
      setError('Please enter an email/username to proceed as guest.');
      return;
    }
    updateUserAndToken({ id: `guest-${Date.now()}`, email: email.trim(), isGuest: true }, null);
    navigation.replace('Home');
  };

  const formWidth = width > 550 ? 550 : '90%';

  return (
    // Wrap the entire screen content that might be affected by the keyboard
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} // Adjust this offset if a fixed header is present
    >
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <View style={[styles.authForm, { maxWidth: formWidth }]}>
          <Text style={styles.title}>{isLogin ? 'Login' : 'Sign Up'}</Text>
          {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
          {successMessage ? <Text style={styles.successMessage}>{successMessage}</Text> : null}
          <View style={styles.formContent}>
            {!isLogin && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Username:</Text>
                <TextInput
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                  required={!isLogin}
                  autoCapitalize="none"
                />
              </View>
            )}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email:</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                required
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password:</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                required
              />
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.switchText}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <Text style={styles.switchButton} onPress={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Sign Up' : 'Login'}
            </Text>
          </Text>
          <Text style={styles.switchText}>
            Or{' '}
            <Text style={styles.switchButton} onPress={handleGuestLogin}>
              Continue as Guest
            </Text>
          </Text>
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
    flexGrow: 1, // Allows ScrollView content to grow
    justifyContent: 'center', // Centers content vertically
    alignItems: 'center', // Centers content horizontally
    paddingVertical: 30, // Add vertical padding for small screens
  },
  authForm: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 5,
    padding: 40,
    alignItems: 'center',
  },
  title: {
    color: '#4A90E2',
    marginBottom: 30,
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
  },
  formContent: {
    width: '100%',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
    color: '#555',
    fontSize: 16,
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#DDE5EE',
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#4A90E2',
    width: '100%',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  switchText: {
    textAlign: 'center',
    marginTop: 25,
    fontSize: 14,
    color: '#666',
  },
  switchButton: {
    color: '#4A90E2',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  errorMessage: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    textAlign: 'center',
    width: '100%',
    color: '#dc3545',
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#dc3545',
    fontWeight: '500',
  },
  successMessage: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    textAlign: 'center',
    width: '100%',
    color: '#28a745',
    backgroundColor: '#DFFFEA',
    borderWidth: 1,
    borderColor: '#28a745',
    fontWeight: '500',
  },
});

export default AuthPage;