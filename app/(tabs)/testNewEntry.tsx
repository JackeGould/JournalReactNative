import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client'

const CREATE_POST = gql`
  mutation Mutation($title: String!, $message: String!) {
    createPost(title: $title, message: $message) {
      _id
      message
      title
    }
  }
`;

// Define the mutation result type
interface CreatePostData {
  createPost: {
    id: string;
    title: string;
    message: string;
    // Add other fields that your mutation returns
  };
}

// Define the mutation variables type
interface CreatePostVariables {
  title: string;
  message: string;
}

const TestNewEntry: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [createPost] = useMutation<CreatePostData, CreatePostVariables>(CREATE_POST);

  const handleSubmit = async (): Promise<void> => {
    
    if (title.trim() === '' || message.trim() === '') {
      Alert.alert('Error', 'Please fill in both title and message fields');
      return;
    }
    
    // Handle the post submission here
    try {
      await createPost({
        variables: {
          title,
          message
        }
      });
    } catch (error: any) {
      console.error("Error creating post:", error.message);
    }
    
    // Clear the form
    setTitle('');
    setMessage('');
  };

  return (
    <View>
      <View>
        <Text>Title:</Text>
        <TextInput 
          placeholder="Enter post title here"
          value={title}
          onChangeText={setTitle}
          maxLength={100}
        />
      </View>

      <View>
        <Text>Message:</Text>
        <TextInput 
          placeholder="Enter post message here"
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={8}
          textAlignVertical="top"
        />
      </View>

      <TouchableOpacity onPress={handleSubmit}>
        <Text>Post</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TestNewEntry;

const styles = StyleSheet.create({});