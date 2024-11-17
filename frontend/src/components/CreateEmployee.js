import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

export default function CreateEmployee() {
  const [employee, setEmployee] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    gender: '',
    courses: [],
    image: null,
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setEmployee((prevEmployee) => {
        const courses = prevEmployee.courses;
        if (checked) {
          return { ...prevEmployee, courses: [...courses, value] };
        } else {
          return { ...prevEmployee, courses: courses.filter((course) => course !== value) };
        }
      });
    } else if (type === 'file') {
      setEmployee((prevEmployee) => ({
        ...prevEmployee,
        image: e.target.files[0],
      }));
    } else {
      setEmployee((prevEmployee) => ({
        ...prevEmployee,
        [name]: value,
      }));
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); 
    if (!validateEmail(employee.email)) {
      setErrorMessage('Invalid email format.');
      return;
    }

    if (employee.image && !['image/png', 'image/jpeg'].includes(employee.image.type)) {
      setErrorMessage('Only PNG and JPG images are allowed.');
      return;
    }

    try {
      const emailCheckResponse = await axios.get('http://localhost:5000/api/employees/check-email', {
        params: { email: employee.email },
      });
      if (emailCheckResponse.data.exists) {
        setErrorMessage('Email already exists.');
        return;
      }

      const formData = new FormData();
      Object.keys(employee).forEach((key) => {
        if (key === 'courses') {
          formData.append(key, JSON.stringify(employee[key]));
        } else {
          formData.append(key, employee[key]);
        }
      });

      await axios.post('http://localhost:5000/api/employees', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Employee created successfully!');
      setEmployee({ name: '', email: '', phone: '', position: '', department: '', gender: '', courses: [], image: null });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('Error creating employee. Please try again.');
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create Employee</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={employee.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={employee.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            Phone
          </label>
          <input
            type="text"
            className="form-control"
            id="phone"
            name="phone"
            value={employee.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="position" className="form-label">
            Position
          </label>
          <select
            className="form-select"
            id="position"
            name="position"
            value={employee.position}
            onChange={handleChange}
            required
          >
            <option value="">Select Position</option>
            <option value="HR">HR</option>
            <option value="Manager">Manager</option>
            <option value="Sales">Sales</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            Upload Image
          </label>
          <input
            type="file"
            className="form-control"
            id="image"
            name="image"
            onChange={handleChange}
            accept="image/png, image/jpeg"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Gender</label>
          <div>
            <input
              type="radio"
              id="male"
              name="gender"
              value="M"
              checked={employee.gender === 'M'}
              onChange={handleChange}
            />
            <label htmlFor="male" className="ms-2 me-4">Male</label>
            <input
              type="radio"
              id="female"
              name="gender"
              value="F"
              checked={employee.gender === 'F'}
              onChange={handleChange}
            />
            <label htmlFor="female" className="ms-2">Female</label>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Courses</label>
          <div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="mca"
                name="courses"
                value="MCA"
                checked={employee.courses.includes('MCA')}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="mca">
                MCA
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="bca"
                name="courses"
                value="BCA"
                checked={employee.courses.includes('BCA')}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="bca">
                BCA
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="bsc"
                name="courses"
                value="BSC"
                checked={employee.courses.includes('BSC')}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="bsc">
                BSC
              </label>
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary" style={{ marginBottom: '20px', marginLeft: '50%' }}>
          Submit
        </button>
      </form>
    </div>
  );
}
