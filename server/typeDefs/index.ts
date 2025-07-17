import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    profileImage: String
    bio: String
    mood: String
    moodDate: String
  }

  type MoodResponse {
    mood: String
    moodDate: String
  }

  type Post {
    _id: String!
    title: String!
    message: String!
    createdAt: String!
    author: User!
  }

  type Query {
    users: [User]
    me: User
    postsByMe: [Post]
  }

  type AuthPayload { 
    id: ID!
    username: String!
    email: String!
    token: String!
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    createPost(title: String!, message: String!): Post
    updateProfileImage(imageUrl: String!): User
    updateBio(bio: String!): User
    updateMood(mood: String!, moodDate: String!): MoodResponse
  }
`;

export default typeDefs;
