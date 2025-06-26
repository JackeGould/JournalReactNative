import { StyleSheet, Text, TextInput, View, Button, Alert } from 'react-native';
import { gql, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { router } from "expo-router";
import { saveToken } from '../../utils/tokenStorage'; // adjust path as needed


const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      username
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loginUser, { loading, error }] = useMutation(LOGIN_USER);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please fill out all fields.");
      return;
    }

    try {
      const { data } = await loginUser({ variables: { email, password } });

      if (!data || !data.login || !data.login.token) {
        Alert.alert("Login Failed", "No token received.");
        return;
      }

      const token = data.login.token;
      await saveToken(token);

      Alert.alert("Success", `Welcome back, ${data.login.username}!`);
      router.replace("/profile");
      } catch (err: any) {
        console.error("🧨 Login error:", JSON.stringify(err, null, 2));

        if (err.graphQLErrors?.length > 0) {
          Alert.alert("Login Failed", err.graphQLErrors[0].message);
        } else if (err.networkError) {
          Alert.alert("Network Error", "Unable to reach the server.");
        } else {
          Alert.alert("Login Failed", "Something went wrong. Please try again.");
        }
      }
    };
    


  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Log In</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title={loading ? 'Logging In...' : 'Log In'} onPress={handleLogin} disabled={loading} />

      {error && <Text style={styles.error}>Login failed. Please try again.</Text>}
    </View>
  );
};

export default Login;



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
