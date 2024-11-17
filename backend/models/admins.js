const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: false
  },
  password: {
    type: String,
    required: false
  }
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
