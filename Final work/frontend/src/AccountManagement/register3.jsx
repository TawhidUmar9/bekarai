import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "./register.css";
import Navbarhome from "../Homepage/navbarhome";
import { useNavigate } from "react-router-dom";

const RegisterCompany = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    password: "",
    description: "",
    website: "",
  });

  const [emailError, setEmailError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    if (name === "email") {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      setEmailError(!emailPattern.test(value) ? "Invalid email address" : "");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (emailError) {
      alert("Please enter a valid email.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post("http://localhost:2000/api/registercompany", formData);

      if (response.status === 201) {
        alert(`Company Registered Successfully: ${formData.companyName}`);
        navigate("/login");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
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
        <h2 className="register-title">Register Your Company</h2>
        <form onSubmit={handleSignUp}>
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
            required
          />
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
            type="text"
            name="description"
            placeholder="Company Description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <input
            type="url"
            name="website"
            placeholder="Company Website"
            value={formData.website}
            onChange={handleChange}
            required
          />

          <button type="submit" className="register-button" disabled={isLoading}>
            {isLoading ? "Registering..." : "Sign Up"}
          </button>
        </form>
        <p className="login-link">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterCompany;
