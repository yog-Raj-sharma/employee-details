import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/dashboard';
import EmployeeList from './components/employeeList'; // Import your EmployeeList component

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/dashboard" element={<Dashboard />}/>
                <Route path="/employeeList" element={<EmployeeList />}/>
              
            </Routes>
        </Router>
    );
}

export default App;
