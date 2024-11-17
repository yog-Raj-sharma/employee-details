import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import CreateEmployee from './CreateEmployee'; 
import List from './List';
import Search from './Search';

export default function EmployeeList() {
  const [activeComponent, setActiveComponent] = useState('');

  const handleCreateEmployeeClick = () => {
    setActiveComponent('create');
  };

  const handleListClick = () => {
    setActiveComponent('list');
  };

  const handleSearchClick = () => {
    setActiveComponent('search');
  };

  return (
    <div>
      
      <nav className="navbar navbar-expand-lg navbar-dark bg-secondary fixed-top" style={{ opacity: 0.95, width: '100%', marginTop: '60px' }}>
        <div className="container-fluid">
          <div className="collapse navbar-collapse d-flex justify-content-between" id="subNavbarNav">
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item">
                <button className="nav-link text-white bg-dark px-3 py-2 rounded" aria-current="page" 
                   onClick={handleListClick}
                >
                  List
                </button>
              </li>
            </ul>
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item">
                <button
                  className="nav-link text-white bg-primary px-3 me-3 py-2 rounded"
                  onClick={handleSearchClick}
                  style={{ border: 'none', cursor: 'pointer' }}
                >
                  <div className="d-flex align-items-center">
                    <i className="bi bi-search me-2"></i>
                    <span>Search Employee</span>
                  </div>
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link text-white bg-success px-3 py-2 rounded"
                  onClick={handleCreateEmployeeClick}
                  style={{ border: 'none', cursor: 'pointer' }}
                >
                  Create Employee
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      
      <div className="container mt-5 pt-5">
        {activeComponent === '' && (
          <div className="container mt-4">
            <h2>Employee List</h2>
            <p>Welcome to the Employee List page. You can view, search, or create new employees using the options above.</p>
          </div>
        )}

        {activeComponent === 'create' && (
          <div className="container mt-4">
            <CreateEmployee />
          </div>
        )}

        {activeComponent === 'list' && (
          <div className="container mt-4">
            <List />
          </div>
        )}

        {activeComponent === 'search' && (
          <div className="container mt-4">
            <Search />
          </div>
        )}
      </div>
    </div>
  );
}
