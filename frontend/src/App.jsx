import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./ProfileManagement/Dashboard";
import Home from "./Homepage/landingpage";
import Register from "./AccountManagement/register";
import Login from "./AccountManagement/login";
import AddProject from "./ProjectManagement/createProject";
import EditProject from "./ProjectManagement/editProject";
import Course from "./CourseManagement/course";
import Video from "./CourseManagement/video";
import Pdf from "./CourseManagement/pdf";
import Exam from "./CourseManagement/exam";
import Register2 from "./AccountManagement/register2";
import Register3 from "./AccountManagement/register3";
import Profile from "./ProfileManagement/Profile";
import Chat from "./Chat/chat";

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  console.log("Token:", token, "Role:", role);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/register2" element={<Register2 />} />
        <Route path="/registercompany" element={<Register3 />} />
        <Route path="/login" element={<Login />} />


        {/* Protected Routes */}
        {token && role== "user"? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/addproject" element={<AddProject />} />
            <Route path="view-project/:projectId" element={<EditProject />} />
            <Route path="/courses/:courseId" element={<Course />} />
            <Route path="/video/" element={<Video />} />
            <Route path="/pdf/" element={<Pdf />} />
            <Route path="/exam/" element={<Exam />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/chat" element={<Chat />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}

        {/* Catch-All Route (404 Page) */}
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />

      </Routes>
    </Router>
  );
}

export default App;
