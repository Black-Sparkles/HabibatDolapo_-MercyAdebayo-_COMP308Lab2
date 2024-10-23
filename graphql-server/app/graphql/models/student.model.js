const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  program: { type: String, required: true },
  favoriteTopic: { type: String },
  strongestSkill: { type: String },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }] // Add this line to reference courses
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
