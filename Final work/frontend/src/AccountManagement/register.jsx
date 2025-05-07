import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "./register.css";
import Navbarhome from "../Homepage/navbarhome";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [emailError, setEmailError] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // To display backend error messages
  const [isLoading, setIsLoading] = useState(false); // Correctly defining the loading state

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData({ ...formData, [name]: value });

    // Validate email format
    if (name === "email") {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(value)) {
        setEmailError("Invalid email address");
      } else {
        setEmailError("");
      }
    }
  };
  const navigate = useNavigate(); // Initialize the navigate function
  const handleCompany = () => {
    navigate("/registercompany", {
      state: {
        formData: formData,
      },
    });
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (emailError) {
      alert("Please enter a valid email before submitting.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    navigate("/register2", {
      state: {
        formData: formData,
      },
    });
  };

  return (
    <div className="register-container">
      <Navbarhome />
      <motion.div
        className="register-box"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <button onClick={handleCompany}>Sign up as company</button>
        <h2 className="register-title">Create an Account</h2>
        <form onSubmit={handleSignUp}>
          <div className="name-fields">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {emailError && <p className="error-message">{emailError}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button type="submit" className="register-button">
            Sign Up
          </button>
        </form>
        <p className="login-link">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
