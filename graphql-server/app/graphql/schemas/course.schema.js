const { gql } = require('apollo-server-express');

const courseSchema = gql`
  type Course {
    id: ID!
    courseCode: String!
    courseName: String!
    section: String!
    semester: String!
    students: [Student]
  }

  type Query {
    getAllCourses: [Course]
    getCourseById(id: ID!): Course
  }

  type Mutation {
    createCourse(courseCode: String!, courseName: String!, section: String!, semester: String!): Course
    updateCourseById(id: ID!, courseCode: String, courseName: String, section: String, semester: String): Course
    deleteCourseById(id: ID!): String
    addStudentToCourse(courseId: ID!, studentId: ID!): Course
  }
`;

module.exports = courseSchema;
