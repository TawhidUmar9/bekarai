import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import "./createjob.css";
import Navbarhome from "../Homepage/navbarhome";

const CreateJob = () => {
  const [jobData, setJobData] = useState({
    job_title: "",
    job_position: "",
    job_description: "",
    job_requirements: "",
    location: "",
    salary_range: "",
    deadline: "",
  });

  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch skills on mount
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get("http://localhost:2000/api/fetchskill");
        const formatted = res.data.skills.map((skill) => ({
          value: skill.id,
          label: skill.skill_type,
        }));
        setSkills(formatted);
      } catch (err) {
        console.error("Failed to fetch skills", err);
      }
    };
    fetchSkills();
  }, []);

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleSkillSelect = (selectedOptions) => {
    setSelectedSkills(selectedOptions || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const {
        job_title,
        job_position,
        job_description,
        job_requirements,
        location,
        salary_range,
        deadline,
      } = jobData;

      // Create the job
      const jobRes = await axios.post(
        "http://localhost:2000/api/company/job",
        {
          job_title,
          job_position,
          job_description,
          job_requirements,
          location,
          salary_range,
          deadline,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const jobId = jobRes.data.job.id;

      // Insert selected skills into job_skills table
      await Promise.all(
        selectedSkills.map((skill) =>
          axios.post(
            "http://localhost:2000/api/company/job-skill",
            {
              job_id: jobId,
              skill_id: skill.value,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
        )
      );

      setMessage("Job created and skills linked successfully!");
      setJobData({
        job_title: "",
        job_position: "",
        job_description: "",
        job_requirements: "",
        location: "",
        salary_range: "",
        deadline: "",
      });
      setSelectedSkills([]);
    } catch (err) {
      console.error("Job creation failed:", err);
      setMessage("Job creation failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="createjob-container">
      <Navbarhome />
      <div className="createjob-box">
        <h2>Create a Job</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="job_title"
            placeholder="Job Title"
            value={jobData.job_title}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="job_position"
            placeholder="Job Position"
            value={jobData.job_position}
            onChange={handleChange}
            required
          />
          <textarea
            name="job_description"
            placeholder="Job Description"
            value={jobData.job_description}
            onChange={handleChange}
            required
          />
          <textarea
            name="job_requirements"
            placeholder="Job Requirements"
            value={jobData.job_requirements}
            onChange={handleChange}
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={jobData.location}
            onChange={handleChange}
          />
          <input
            type="text"
            name="salary_range"
            placeholder="Salary Range"
            value={jobData.salary_range}
            onChange={handleChange}
          />
          <input
            type="date"
            name="deadline"
            value={jobData.deadline}
            onChange={handleChange}
          />

          <label>Select Required Skills</label>
          <Select
            isMulti
            name="skills"
            options={skills}
            value={selectedSkills}
            onChange={handleSkillSelect}
            className="react-select"
            classNamePrefix="select"
          />

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Job"}
          </button>
        </form>
        {message && <p className="job-message">{message}</p>}
      </div>
    </div>
  );
};

export default CreateJob;
