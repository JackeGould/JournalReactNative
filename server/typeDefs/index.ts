// typeDefs/index.ts
import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String
    token: String
    posts: [Post]
  }

  type Post {
    _id: String!
    title: String!
    message: String!
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
  }
`;

export default typeDefs;