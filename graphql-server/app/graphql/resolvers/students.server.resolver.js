const Student = require('../models/student.model');
const Course = require('../models/course.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const studentResolver = {
  Query: {
    getAllStudents: async () => {
      return await Student.find().populate("courses");
    },
    getStudentById: async (_, { id }) => {
      return await Student.findById(id).populate("courses");
    },
    loginStudent: async (_, { studentNumber, password }) => {
      const student = await Student.findOne({ studentNumber });
      if (!student || !bcrypt.compareSync(password, student.password)) {
        throw new Error("Invalid credentials");
      }
      return jwt.sign(
        { id: student._id, studentNumber: student.studentNumber },
        process.env.SESSION_SECRET,
        { expiresIn: "1h" }
      );
    },
    getEnrolledCourses: async (_, { studentId }) => {
      const student = await Student.findById(studentId).populate("courses");
      return student.courses;
    },
  },
  Mutation: {
    createStudent: async (
      _,
      {
        studentNumber,
        password,
        firstName,
        lastName,
        address,
        city,
        phoneNumber,
        email,
        program,
        favoriteTopic,
        strongestSkill,
      }
    ) => {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const student = new Student({
        studentNumber,
        password: hashedPassword,
        firstName,
        lastName,
        address,
        city,
        phoneNumber,
        email,
        program,
        favoriteTopic,
        strongestSkill,
      });
      return await student.save();
    },
    updateStudentById: async (
      _,
      {
        id,
        studentNumber,
        password,
        firstName,
        lastName,
        address,
        city,
        phoneNumber,
        email,
        program,
        favoriteTopic,
        strongestSkill,
      }
    ) => {
      const updates = {
        studentNumber,
        firstName,
        lastName,
        address,
        city,
        phoneNumber,
        email,
        program,
        favoriteTopic,
        strongestSkill,
      };
      if (password) {
        updates.password = bcrypt.hashSync(password, 10);
      }
      return await Student.findByIdAndUpdate(id, updates, { new: true });
    },
    deleteStudentById: async (_, { id }) => {
      await Student.findByIdAndDelete(id);
      return "Student deleted";
    },
    addCourseToStudent: async (_, { studentId, courseId }) => {
      const student = await Student.findById(studentId);
      const course = await Course.findById(courseId);
      student.courses.push(course);
      course.students.push(student);
      await student.save();
      await course.save();
      return student;
    },
    dropCourseFromStudent: async (_, { studentId, courseId }) => {
      const student = await Student.findById(studentId);
      const course = await Course.findById(courseId);
      student.courses.pull(course);
      course.students.pull(student);
      await student.save();
      await course.save();
      return student;
    },
  },
};

module.exports = studentResolver;
