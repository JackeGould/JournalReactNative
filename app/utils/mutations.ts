import { gql } from '@apollo/client';

export const CREATE_POST = gql`
  mutation Mutation($title: String!, $message: String!) {
    createPost(title: $title, message: $message) {
      _id
      message
      title
    }
  }
`;