const Course = require('../models/course.model');
const Student = require('../models/student.model');

const courseResolver = {
  Query: {
    getAllCourses: async () => {
      return await Course.find().populate('students');
    },
    getCourseById: async (_, { id }) => {
      return await Course.findById(id).populate('students');
    }
  },
  Mutation: {
    createCourse: async (_, { courseCode, courseName, section, semester }) => {
      const course = new Course({ courseCode, courseName, section, semester });
      return await course.save();
    },
    updateCourseById: async (_, { id, courseCode, courseName, section, semester }) => {
      return await Course.findByIdAndUpdate(id, { courseCode, courseName, section, semester }, { new: true });
    },
    deleteCourseById: async (_, { id }) => {
      await Course.findByIdAndDelete(id);
      return "Course deleted";
    },
    addStudentToCourse: async (_, { courseId, studentId }) => {
      const course = await Course.findById(courseId);
      const student = await Student.findById(studentId);
      course.students.push(student);
      student.courses.push(course);
      await course.save();
      await student.save();
      return course;
    }
  }
};

module.exports = courseResolver;
