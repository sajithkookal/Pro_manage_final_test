import React from 'react';
import './App.css';
import { Route, Routes, Navigate, useNavigate, BrowserRouter as Router, BrowserRouter } from "react-router-dom";
import LoginSignup from './pages/LoginSignup/LoginSignUp';
import TaskSharePage from './pages/TaskSharePage/TaskSharePage';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Setting from './pages/Setting';
import { isAuthenticated } from "./config/auth";

function PrivateRoute({ element, redirectTo }) {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("userToken");

  if (!isAuthenticated) {
    navigate(redirectTo || "/");
    return null;
  }
  return element;
}

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route path="/taskShared/:taskId" element={<TaskSharePage/>}/>
          <Route path="/dashboard" element={
            <PrivateRoute element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
          } />
          <Route path="/analytics" element={
            <PrivateRoute element={isAuthenticated ? <Analytics /> : <Navigate to="/" />} />
          } />
          <Route path="/setting" element={
            <PrivateRoute element={isAuthenticated ? <Setting /> : <Navigate to="/" />} />
          } />
        </Routes>
      </div>
    </BrowserRouter>

  );
}

export default App;
