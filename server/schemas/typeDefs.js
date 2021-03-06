const { gql } = require('@apollo/client');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    password: String
    bookCount: Int
    savedBooks: [Book]
  }
  type Book {
    # _id: ID
    bookId: ID
    authors: [Author]
    description: String
    image: String
    link: String
    title: String
  }
  type Author {
    _id: ID
    name: String
  }
  type Auth {
    token: ID!
    user: User
  }
  input BookInput {
    bookId: String
    authors: String
    description: String
    image: String
    link: String
    title: String
  }
  type Query {
    me: User
  }
  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    loginUser(email: String!, password: String!): Auth
    saveBook(bookData: BookInput!): User
    removeBook(bookId: ID!): User
    removeUser(username: String!)
  }
`;

module.exports = typeDefs;