import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NavbarCourse from "./navbarCourse";
import "./CourseDetails.css"; // ⬅️ make sure to create this CSS file

const CourseDetails = () => {
  const { courseId } = useParams(); // get course ID from URL
  //console.log("Course ID:", courseId); // log the course ID for debugging
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:2000/api/course/${courseId}`)
      .then((res) => {
        const courseData = res.data.course?.[0]; // Get the first course object
        setCourse(courseData);
        setLoading(false);
        console.log("Course Data:", courseData);
      })
      .catch((err) => {
        console.error("Error fetching course:", err);
        setLoading(false);
      });
  }, [courseId]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < rating ? "star filled" : "star"}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!course) {
    return <div className="error-message">Course not found</div>;
  }

  return (
    <div>
      <NavbarCourse />
      <div className="course-details-container">
        <div className="course-card">
          <h1 className="course-title">{course.title}</h1>
          <div className="course-rating">{renderStars(course.rating)}</div>
          <p className="course-description">{course.description}</p>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
