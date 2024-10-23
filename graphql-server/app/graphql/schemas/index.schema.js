const { gql } = require('apollo-server-express');
const adminSchema = require('./admin.schema');
const courseSchema = require('./course.schema');
const studentSchema = require('./student.schema');

const rootSchema = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`;

module.exports = [rootSchema, adminSchema, courseSchema, studentSchema];
