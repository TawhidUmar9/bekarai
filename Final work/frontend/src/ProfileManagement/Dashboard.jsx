import React, { useEffect, useState } from "react";
import axios from "axios";
import NavbarAcholder from "./navbarAccountholder";
import "./Dashboard.css";

const ITEMS_PER_PAGE = 4;

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [courseSearch, setCourseSearch] = useState("");
  const [jobSearch, setJobSearch] = useState("");

  const [coursePage, setCoursePage] = useState(1);
  const [jobPage, setJobPage] = useState(1);

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await axios.get("http://localhost:2000/api/courses");
      setCourses(response.data || []);
    };

    const fetchJobs = async () => {
      const response = await axios.get("http://localhost:2000/api/jobs");
      setJobs(response.data || []);
    };

    fetchCourses();
    fetchJobs();
  }, []);

  // Filtered and paginated data
  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(courseSearch.toLowerCase())
  );

  const filteredJobs = jobs.filter(j =>
    j.job_position.toLowerCase().includes(jobSearch.toLowerCase())
  );

  const paginatedCourses = filteredCourses.slice(
    (coursePage - 1) * ITEMS_PER_PAGE,
    coursePage * ITEMS_PER_PAGE
  );

  const paginatedJobs = filteredJobs.slice(
    (jobPage - 1) * ITEMS_PER_PAGE,
    jobPage * ITEMS_PER_PAGE
  );

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "star filled" : "star"}>★</span>
      );
    }
    return stars;
  };

  return (
    <div>
      <NavbarAcholder />
      <div className="dashboard-container">

        {/* Courses */}
        <section className="card-section">
          <div className="section-header">
            <h2>Courses</h2>
            <input
              type="text"
              placeholder="Search courses..."
              value={courseSearch}
              onChange={(e) => {
                setCourseSearch(e.target.value);
                setCoursePage(1);
              }}
            />
          </div>

          <div className="card-gallery">
            {paginatedCourses.map((course, index) => (
              <div className="card" key={index}>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <div className="stars">{renderStars(course.rating)}</div>
                <button className="action-button">Enroll</button>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button
              disabled={coursePage === 1}
              onClick={() => setCoursePage(coursePage - 1)}
            >
              Previous
            </button>
            <span>Page {coursePage}</span>
            <button
              disabled={coursePage * ITEMS_PER_PAGE >= filteredCourses.length}
              onClick={() => setCoursePage(coursePage + 1)}
            >
              Next
            </button>
          </div>
        </section>

        {/* Jobs */}
        <section className="card-section">
          <div className="section-header">
            <h2>Jobs</h2>
            <input
              type="text"
              placeholder="Search jobs..."
              value={jobSearch}
              onChange={(e) => {
                setJobSearch(e.target.value);
                setJobPage(1);
              }}
            />
          </div>

          <div className="card-gallery">
            {paginatedJobs.map((job, index) => (
              <div className="card" key={index}>
                <h3>{job.job_position} at {job.company_title}</h3>
                <p><strong>Description:</strong> {job.job_description}</p>
                <p><strong>Requirements:</strong> {job.job_requirements}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Salary:</strong> {job.salary_range}</p>
                <p><strong>Deadline:</strong> {job.deadline}</p>
                <button className="action-button">Apply Now</button>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button
              disabled={jobPage === 1}
              onClick={() => setJobPage(jobPage - 1)}
            >
              Previous
            </button>
            <span>Page {jobPage}</span>
            <button
              disabled={jobPage * ITEMS_PER_PAGE >= filteredJobs.length}
              onClick={() => setJobPage(jobPage + 1)}
            >
              Next
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;
