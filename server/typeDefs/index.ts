// typeDefs/index.ts
import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String
    token: String
  }

  type Post {
    _id: string;
    title: string;
    content: string;
    author: User
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
    createPost(title: String!, content: String!, author: String!): Post
  }
`;

export default typeDefs;
