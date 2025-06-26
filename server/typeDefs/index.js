const { gql } = require('apollo-server-express');

module.exports = gql`
    type User {
    id: ID!
    username: String!
    email: String
    token: String
    }

    type Query {
    users: [User]
    me: User
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
    }
`;

