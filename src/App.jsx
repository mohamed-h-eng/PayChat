import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './Auth';
import Dashboard from './Dashboard';
import Transfer from './Transfer';
import Status from './Status';
import 'bootstrap/dist/css/bootstrap.min.css';
export default function App() {
  // Simple Protected Route wrapper
  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/" />;
  };
  
  return (
    <Router>
      <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/transfer" element={
              <ProtectedRoute><Transfer /></ProtectedRoute>
            } />
            <Route path="/status" element={
              <ProtectedRoute><Status /></ProtectedRoute>
            } />
          </Routes>
    </Router>
  );
}