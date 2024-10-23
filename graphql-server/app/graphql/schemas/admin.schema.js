const { gql } = require("apollo-server-express");

const adminSchema = gql`
  type Admin {
    id: ID!
    adminEmail: String!
  }

  type Query {
    loginAdmin(adminEmail: String!, password: String!): String
    getAllAdmins: [Admin!]!
  }

  type Mutation {
    createAdmin(adminEmail: String!, password: String!): Admin
  }
`;

module.exports = adminSchema;
