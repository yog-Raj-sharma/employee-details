import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import EmployeeList from './employeeList'; 
import axios from 'axios';

export default function NavBar() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeComponent, setActiveComponent] = useState(null);
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    if (darkMode) {
      document.body.style.backgroundColor = '#4a4d53';
      document.body.style.color = '#ffffff';
    } else {
      document.body.style.backgroundColor = '#f8f9fa';
      document.body.style.color = '#000000';
    }
  }, [darkMode]);

   useEffect(() => {
    fetchAdminDetails();
  }, []);

  const fetchAdminDetails = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://localhost:5000/api/admin', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setAdminName(response.data.name);
    } catch (error) {
      console.error('Error fetching admin details:', error);
    }
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/LoginPage';
  };

  const navbarStyle = {
    backgroundColor: darkMode ? '#2c2f33' : '#F2F2F2',
    color: darkMode ? '#ffffff' : '#000000',
    position: 'fixed',
    top: '0',
    width: '100%',
    zIndex: '1000',
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg" style={navbarStyle}>
        <div className="container-fluid">
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <button
                  className="nav-link"
                  onClick={() => setActiveComponent('home')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '0 10px',
                    color: navbarStyle.color,
                    textDecoration: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Home
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link"
                  onClick={() => setActiveComponent('employeeList')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '0 10px',
                    color: navbarStyle.color,
                    textDecoration: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Employee List
                </button>
              </li>
            </ul>

            <div className="d-flex align-items-center">
              <span
                className="navbar-text me-3"
                style={{ color: darkMode ? '#ffffff' : '#000000' }}
              >

               {adminName || 'Admin'}
                
              </span>
              <button className="btn btn-outline-danger me-3" onClick={handleSignOut}>
                Logout
              </button>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="darkModeToggle"
                  checked={darkMode}
                  onChange={handleToggleDarkMode}
                  style={{ cursor: 'pointer' }}
                />
                <label
                  className="form-check-label"
                  htmlFor="darkModeToggle"
                  style={{ color: navbarStyle.color }}
                >
                  {darkMode ? 'Dark Mode' : 'Light Mode'}
                </label>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div style={{ marginTop: '60px' }}>
        
        {activeComponent === 'employeeList' && <EmployeeList />}
        {activeComponent === 'home' && (
          <div className="container mt-4">
            <h2>Home</h2>
            <p>Welcome to the Home page of the Dashboard.</p>
          </div>
        )}
      </div>
    </>
  );
}
