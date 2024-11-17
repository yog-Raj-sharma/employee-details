import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Table, Modal, Button, Form, Dropdown } from 'react-bootstrap';
import Pagination from 'react-js-pagination';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: 'employeeId', direction: 'asc' });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageToView, setImageToView] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const sortedEmployees = () => {
    let sortableEmployees = [...employees];
    if (sortConfig !== null) {
      sortableEmployees.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableEmployees;
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleEditClick = (employee) => {
    setEditEmployee(employee);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setEditEmployee((prevEmployee) => {
        if (checked) {
          return { ...prevEmployee, courses: [value] };
        } else {
          return { ...prevEmployee, courses: [] };
        }
      });
    } else if (type === 'file') {
      setEditEmployee((prevEmployee) => ({
        ...prevEmployee,
        image: files.length > 0 ? files[0] : prevEmployee.image,
      }));
    } else {
      setEditEmployee((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditSave = async () => {
    try {
      if (editEmployee.image && !['image/png', 'image/jpeg'].includes(editEmployee.image.type)) {
        setErrorMessage('Only PNG and JPG images are allowed.');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editEmployee.email)) {
        setErrorMessage('Invalid email format.');
        return;
      }
     
      const duplicateEmail = employees.some((emp) => emp.email === editEmployee.email && emp._id !== editEmployee._id);
      if (duplicateEmail) {
        setErrorMessage('Email already exists.');
        return;
      }
      
      const formData = new FormData();
      Object.keys(editEmployee).forEach((key) => {
        if (key === 'courses') {
          formData.append(key, JSON.stringify(editEmployee[key]));
        } else if (key === 'image' && editEmployee.image instanceof File) {
          formData.append(key, editEmployee[key]);
        } else if (key !== 'image') {
          formData.append(key, editEmployee[key]);
        }
      });

      await axios.put(`http://localhost:5000/api/employees/${editEmployee._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setShowEditModal(false);
      fetchEmployees();
    } catch (error) {
      console.error('Error updating employee:', error);
      setErrorMessage('Error updating employee. Please try again.');
    }
  };

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/employees/${employeeToDelete._id}`);
      setShowDeleteConfirm(false);
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleImageClick = (imagePath) => {
    setImageToView(`http://localhost:5000${imagePath}`);
    setShowImageModal(true);
  };

  const paginatedEmployees = sortedEmployees().slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  );

  return (
    <div className="container mt-4">
      <h2>Employee List</h2>
      <div className="d-flex justify-content-end mb-3">
        <Dropdown>
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
            Sort By
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => requestSort('employeeId')}>ID</Dropdown.Item>
            <Dropdown.Item onClick={() => requestSort('name')}>Name</Dropdown.Item>
            <Dropdown.Item onClick={() => requestSort('email')}>Email</Dropdown.Item>
            <Dropdown.Item onClick={() => requestSort('createdAt')}>Creation Date</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th onClick={() => requestSort('employeeId')} style={{ cursor: 'pointer' }}>Unique ID</th>
            <th>Image</th>
            <th onClick={() => requestSort('name')} style={{ cursor: 'pointer' }}>Name</th>
            <th onClick={() => requestSort('email')} style={{ cursor: 'pointer' }}>Email</th>
            <th>Mobile No</th>
            <th>Designation</th>
            <th>Gender</th>
            <th>Course</th>
            <th onClick={() => requestSort('createdAt')} style={{ cursor: 'pointer' }}>Create Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedEmployees.map((employee) => (
            <tr key={employee.employeeId}>
              <td>{employee.employeeId}</td>
              <td>
                <img
                  src={`http://localhost:5000${employee.imagePath}`}
                  alt=""
                  width="50"
                  height="50"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleImageClick(employee.imagePath)}
                />
              </td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.phone}</td>
              <td>{employee.position}</td>
              <td>{employee.gender === 'M' ? 'Male' : 'Female'}</td>
              <td>{employee.courses.join(', ')}</td>
              <td>{new Date(employee.createdAt).toLocaleDateString()}</td>
              <td>
                <button className="btn btn-primary btn-sm me-2" onClick={() => handleEditClick(employee)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(employee)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination
        activePage={activePage}
        itemsCountPerPage={itemsPerPage}
        totalItemsCount={employees.length}
        pageRangeDisplayed={5}
        onChange={handlePageChange}
        itemClass="page-item"
        linkClass="page-link"
      />

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editEmployee && (
            <Form>
              {errorMessage && <p className="text-danger">{errorMessage}</p>}
              <Form.Group className="mb-3">
                <Form.Label style={{ color: 'black' }}>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={editEmployee.name}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: 'black' }}>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={editEmployee.email}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: 'black' }}>Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={editEmployee.phone}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: 'black' }}>Designation</Form.Label>
                <Form.Control
                  as="select"
                  name="position"
                  value={editEmployee.position}
                  onChange={handleEditChange}
                >
                  <option value="HR">HR</option>
                  <option value="Manager">Manager</option>
                  <option value="Sales">Sales</option>
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: 'black' }}>Gender</Form.Label>
                <Form.Check
                  type="radio"
                  label={<span style={{ color: 'black' }}>Male</span>}
                  name="gender"
                  value="M"
                  checked={editEmployee.gender === 'M'}
                  onChange={handleEditChange}
                />
                <Form.Check
                  type="radio"
                  label={<span style={{ color: 'black' }}>Female</span>}
                  name="gender"
                  value="F"
                  checked={editEmployee.gender === 'F'}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: 'black' }}>Courses</Form.Label>
                <div>
                  <Form.Check
                    type="checkbox"
                    label={<span style={{ color: 'black' }}>MCA</span>}
                    name="courses"
                    value="MCA"
                    checked={editEmployee.courses.includes('MCA')}
                    onChange={handleEditChange}
                  />
                  <Form.Check
                    type="checkbox"
                    label={<span style={{ color: 'black' }}>BCA</span>}
                    name="courses"
                    value="BCA"
                    checked={editEmployee.courses.includes('BCA')}
                    onChange={handleEditChange}
                  />
                  <Form.Check
                    type="checkbox"
                    label={<span style={{ color: 'black' }}>BSC</span>}
                    name="courses"
                    value="BSC"
                    checked={editEmployee.courses.includes('BSC')}
                    onChange={handleEditChange}
                  />
                </div>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: 'black' }}>Upload Image</Form.Label>
                <Form.Control
                  type="file"
                  name="image"
                  onChange={handleEditChange}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title style={{color: 'black'}}>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{color: 'black'}}>
          Are you sure you want to delete this employee?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showImageModal} onHide={() => setShowImageModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>View Image</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {imageToView && <img src={imageToView} alt="Employee" style={{ width: '100%', height: 'auto' }} />}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImageModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
