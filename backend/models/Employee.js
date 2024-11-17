const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  position: String,
  department: String,
  gender: String,
  courses: [String],
  imagePath: String,
  employeeId: { type: Number, unique: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Employee', employeeSchema);