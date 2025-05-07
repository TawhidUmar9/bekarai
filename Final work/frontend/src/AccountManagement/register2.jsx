import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "./register.css";
import Navbarhome from "../Homepage/navbarhome";
import { useLocation, useNavigate } from "react-router-dom";

const Register2 = () => {
  const { state } = useLocation();
  const formData = state?.formData;
  console.log(formData);
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get(
          "http://localhost:2000/api/fetchskill"
        );
        setSkills(response.data.skills);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    fetchSkills();
  }, []);
  console.log("Skills:", skills);

  const [additionalData, setAdditionalData] = useState({
    institution: "",
    date_of_birth: "",
    gender: "",
    religion: "",
    contact: "",
    bio: "",
    skill_type_array: [],
  });
  console.log("Form Data:", formData);
  console.log("Additional Data:", additionalData);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "skill_type_array" && type === "checkbox") {
      setAdditionalData((prev) => {
        const updatedSkills = checked
          ? [...prev.skill_type_array, value]
          : prev.skill_type_array.filter((skill) => skill !== value);
        return { ...prev, skill_type_array: updatedSkills };
      });
    } else {
      setAdditionalData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setIsLoading(true); // Show loading spinner

    try {
      const response = await axios.post("http://localhost:2000/api/register", {
        ...formData,
        ...additionalData,
      });

      if (response.status === 201) {
        // Registration success
        alert(
          `Registered Successfully: ${formData.firstName} ${formData.lastName}`
        );
        window.location.href = "/login"; // Redirect to login page
      }
    } catch (error) {
      console.log(error.response?.data?.error || "Something went wrong.");
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
        <h2 className="register-title">Details</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="institution"
              placeholder="Institution"
              value={additionalData.institution}
              onChange={handleChange}
              required
            />

            <input
              type="date"
              name="date_of_birth"
              placeholder="Date of Birth"
              value={additionalData.date_of_birth}
              onChange={handleChange}
              required
            />

            <select
              name="gender"
              value={additionalData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <input
              type="text"
              name="contact"
              placeholder="Contact No"
              value={additionalData.contact}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="religion"
              placeholder="Religion"
              value={additionalData.religion}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="bio"
              placeholder="Bio"
              value={additionalData.bio}
              onChange={handleChange}
              required
            />
          </div>
          <div className="skill-selection">
            <h3>Select Skills:</h3>
            <div className="skill-selection-grid">
              {skills.map((skill) => (
                <div key={skill.id} className="skill-option">
                  <input
                    type="checkbox"
                    id={`skill-${skill.id}`}
                    name="skill_type_array"
                    value={skill.skill_type}
                    checked={additionalData.skill_type_array.includes(
                      skill.skill_type
                    )}
                    onChange={handleChange}
                  />
                  <label htmlFor={`skill-${skill.id}`}>
                    {skill.skill_type}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="register-button">
            Submit
          </button>
        </form>
        <p className="login-link">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </motion.div>
    </div>
  );
};

export default Register2;
