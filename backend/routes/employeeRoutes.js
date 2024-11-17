const express = require('express');
const multer = require('multer');
const Employee = require('../models/Employee');
const path = require('path');

const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/admins');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send({ error: 'No token provided' });

  jwt.verify(token, 'yourSecretKey', (err, decoded) => {
    if (err) return res.status(500).send({ error: 'Failed to authenticate token' });

    req.adminId = decoded.id;
    next();
  });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Images Only (jpg/jpeg/png) are allowed'));
    }
  },
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, email, phone, position, department, gender, courses } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';


    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ error: 'Email already exists' });
    }

   
    const lastEmployee = await Employee.findOne().sort({ employeeId: -1 });
    const employeeId = lastEmployee && lastEmployee.employeeId ? lastEmployee.employeeId + 1 : 101;

    const newEmployee = new Employee({
      name,
      email,
      phone,
      position,
      department,
      gender,
      courses: JSON.parse(courses),
      imagePath,
      employeeId,
    });

    await newEmployee.save();
    res.status(201).json({ message: 'Employee created successfully' });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Error fetching employees. Please try again.' });
  }
});


router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, position, department, gender, courses } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

    const existingEmployee = await Employee.findOne({ email, _id: { $ne: id } });
    if (existingEmployee) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phone,
        position,
        department,
        gender,
        courses: JSON.parse(courses),
        ...(imagePath && { imagePath }),
      },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee updated successfully' });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Error updating employee. Please try again.' });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEmployee = await Employee.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Error deleting employee. Please try again.' });
  }
});


router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const regex = new RegExp(query, 'i');
    const employees = await Employee.find({
      $or: [
        { name: regex },
        { email: regex },
        { position: regex },
        { courses: regex },
        { gender: regex },
      ],
    });
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Error searching employees. Please try again.' });
  }
});


router.get('/check-email', async (req, res) => {
  try {
    const { email } = req.query;
    const employee = await Employee.findOne({ email });
    res.json({ exists: !!employee });
  } catch (error) {
    res.status(500).json({ error: 'Error checking email duplicacy.' });
  }
});


router.get('/admin', async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: 'yraj_be21@thapar.edu' }); 
    if (admin) {
      res.json({ name: admin.name });
    } else {
      res.status(404).json({ error: 'Admin not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/api/admin/me', verifyToken, async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId);
    if (!admin) return res.status(404).send({ error: 'Admin not found' });
    
    res.status(200).send({ name: admin.name, email: admin.email });
  } catch (error) {
    res.status(500).send({ error: 'There was a problem finding the admin' });
  }
});


module.exports = router;
