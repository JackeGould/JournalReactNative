import { StyleSheet, Text, TextInput, View, Button, Alert } from 'react-native';
import { gql, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { saveToken } from '../../utils/tokenStorage';
import { router } from 'expo-router';
import Constants from 'expo-constants';

const ADD_USER = gql`
  mutation AddUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      username
    }
  }
`;

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [addUser, { loading, error }] = useMutation(ADD_USER);

  const handleSignUp = async () => {
    try {
      const { data } = await addUser({ variables: { username, email, password } });
      const token = data.addUser.token;
      await saveToken(token);
      router.replace('/');
      console.log('Token:', token);
      Alert.alert('Success', `Welcome, ${data.addUser.username}!`);
    } catch (err: any) {
      if (err.graphQLErrors && err.graphQLErrors.length > 0) {
        Alert.alert('Error', err.graphQLErrors[0].message);
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#888"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />

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

      <Button title={loading ? 'Signing Up...' : 'Sign Up'} onPress={handleSignUp} disabled={loading} />

      {error && <Text style={styles.error}>Error: {error.message}</Text>}
    </View>
  );
};

export default SignUp;

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
  error: {
    marginTop: 12,
    color: 'red',
    textAlign: 'center',
  },
});
