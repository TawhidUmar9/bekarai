import React, { useState } from "react";
import { motion } from "framer-motion";
import "./navbarAccountholder.css";
import logo_buet from "../assets/logos/buet.png";
import { FaHome,   FaUser, FaSignOutAlt, FaInfoCircle, FaQuestionCircle, FaSearch } from "react-icons/fa";

const logOut = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userType');
  localStorage.removeItem('role');
  localStorage.removeItem('userId');
  window.location.href = '/';
};
const NavbarAcholder = () => {
  const [searchQuery, setSearchQuery] = useState("");

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
      <ul className="nav-links">
        <li>
          <a href="dashboard">
            <FaHome className="nav-icon" />
            <span>Home</span>
          </a>
        </li>
        <li>
          <a href="chat">
            <FaQuestionCircle className="nav-icon" />
            <span>Chat</span>
          </a>
        </li>
        <li>
          <a href="profile">
            <FaUser className="nav-icon" />
            <span>Profile</span>
          </a>
        </li>
        <li>
          <a href="#" onClick={logOut}>
            <FaSignOutAlt className="nav-icon" />
            <span>Log Out</span>
          </a>
        </li>
      </ul>
    </motion.nav>
  );
};

export default NavbarAcholder;
