import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./navbarCourse.css";
import logo_buet from "../assets/logos/buet.png";

import { FaHome, FaUserPlus, FaSignInAlt, FaInfoCircle, FaQuestionCircle, FaSearch } from "react-icons/fa";

const NavbarCourse = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); 

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
    }
  };

  return (
    <motion.nav className="navbar">
      {/* Logo Section */}
      <div className="logo-container">
        <img src={logo_buet} alt="BUET Logo" className="logo" />
      </div>

      {/* Always Visible Search Box */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search ..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <FaSearch className="search-icon" onClick={handleSearch} />
      </div>

      {/* Navigation Links */}
      {/* <ul className="nav-links">
        <li><a href="home"><FaHome className="nav-icon" /><span>Home</span></a></li>
        <li><a href="signup"><FaUserPlus className="nav-icon" /><span>Sign Up</span></a></li>
        
        <li onClick={handleLoginClick} style={{ cursor: "pointer" }}>
          <FaSignInAlt className="nav-icon" /><span>Log in</span>
        </li>
      </ul> */}

    </motion.nav>
  );
};

export default NavbarCourse;
