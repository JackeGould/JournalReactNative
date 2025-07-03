// app/(auth)/index.tsx

import { StyleSheet, Text, TextInput, View, Button, Alert } from 'react-native';
import { gql, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { router } from 'expo-router';
import { saveToken } from '../../utils/tokenStorage';

const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      username
    }
  }
`;

const ADD_USER = gql`
  mutation AddUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      username
    }
  }
`;

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loginUser, { loading: loginLoading }] = useMutation(LOGIN_USER);
  const [addUser, { loading: signUpLoading }] = useMutation(ADD_USER);

    const handleAuth = async () => {
    if (!email || !password || (!isLogin && !username)) {
        Alert.alert('Missing Fields', 'Please fill out all fields.');
        return;
    }

    try {
        if (isLogin) {
        const { data } = await loginUser({ variables: { email, password } });

        if (!data?.login?.token) {
            Alert.alert('Login Failed', 'No token received.');
            return;
        }

        await saveToken(data.login.token);
        Alert.alert('Success', `Welcome back, ${data.login.username}!`);
        } else {
        const { data } = await addUser({ variables: { username, email, password } });

        if (!data?.addUser?.token) {
            Alert.alert('Sign Up Failed', 'No token received.');
            return;
        }

        await saveToken(data.addUser.token);
        Alert.alert('Success', `Welcome, ${data.addUser.username}!`);
        }

        // ✅ Go to profile page after success
        router.replace('/profile');
    } catch (err: any) {
        console.error('🧨 Auth error:', JSON.stringify(err, null, 2));

        if (err.graphQLErrors?.length > 0) {
        Alert.alert('Error', err.graphQLErrors[0].message);
        } else if (err.networkError) {
        Alert.alert('Network Error', 'Unable to reach the server.');
        } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
        }
    }
};


  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{isLogin ? 'Log In' : 'Sign Up'}</Text>

      {!isLogin && (
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#888"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button
        title={isLogin ? (loginLoading ? 'Logging In...' : 'Log In') : signUpLoading ? 'Signing Up...' : 'Sign Up'}
        onPress={handleAuth}
        disabled={loginLoading || signUpLoading}
      />

      <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
        {isLogin
          ? "Don't have an account? Sign up here"
          : 'Already have an account? Log in here'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  toggleText: {
    marginTop: 20,
    color: 'blue',
    textAlign: 'center',
  },
});
