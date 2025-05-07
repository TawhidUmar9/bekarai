import React, { useState } from "react";
import { motion } from "framer-motion";
import NavbarHome from "./navbarhome"; // Import the Navbar component
import "./landingpage.css";

const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    alert(`Searching for: ${searchQuery}`);
  };

  return (
    <div className="landing-container">
      {/* Navbar at the top */}
      <NavbarHome />

      {/* Animated Header */}
      <motion.h1
        className="title"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 1 }}
      >
        Welcome
      </motion.h1>
    </div>
  );
};

export default LandingPage;
