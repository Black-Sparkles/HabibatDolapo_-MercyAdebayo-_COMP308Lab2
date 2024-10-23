const { gql } = require('apollo-server-express');

const studentSchema = gql`
  type Student {
    id: ID!
    studentNumber: String!
    password: String!
    firstName: String!
    lastName: String!
    address: String!
    city: String!
    phoneNumber: String!
    email: String!
    program: String!
    favoriteTopic: String
    strongestSkill: String
    courses: [Course]
  }

  type Query {
    getAllStudents: [Student]
    getStudentById(id: ID!): Student
    loginStudent(studentNumber: String!, password: String!): String
    getEnrolledCourses(studentId: ID!): [Course]
  }

  type Mutation {
    createStudent(studentNumber: String!, password: String!, firstName: String!, lastName: String!, address: String!, city: String!, phoneNumber: String!, email: String!, program: String!): Student
    updateStudentById(id: ID!, studentNumber: String, password: String, firstName: String, lastName: String, address: String, city: String, phoneNumber: String, email: String, program: String, favoriteTopic: String, strongestSkill: String): Student
    deleteStudentById(id: ID!): String
    addCourseToStudent(studentId: ID!, courseId: ID!): Student
    dropCourseFromStudent(studentId: ID!, courseId: ID!): Student
  }
`;

module.exports = studentSchema;
