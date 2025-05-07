// import React, { useEffect, useState } from "react";
// import { supabase } from "../supabaseClient";
// import Select from "react-select";
// import "./companydashboard.css";
// import "./createjob.css";

// const CompanyDashboard = () => {
//   const company = JSON.parse(localStorage.getItem("company"));

//   const [skills, setSkills] = useState([]);
//   const [selectedSkills, setSelectedSkills] = useState([]);
//   const [jobData, setJobData] = useState({
//     job_title: "",
//     job_position: "",
//     job_description: "",
//     job_requirements: "",
//     location: "",
//     salary_range: "",
//     deadline: "",
//   });
//   const [jobs, setJobs] = useState([]);
//   const [message, setMessage] = useState("");

//   // Fetch skills and jobs on mount
//   useEffect(() => {
//     fetchSkills();
//     fetchJobs();
//   }, []);

//   const fetchSkills = async () => {
//     const { data, error } = await supabase.from("skill_list").select("*");
//     if (error) console.error("Skill fetch error:", error.message);
//     else {
//       const formatted = data.map(skill => ({ value: skill.id, label: skill.skill_type }));
//       setSkills(formatted);
//     }
//   };

//   const fetchJobs = async () => {
//     const { data, error } = await supabase
//       .from("jobs")
//       .select("*")
//       .eq("company_id", company.id);
//     if (error) console.error("Job fetch error:", error.message);
//     else setJobs(data);
//   };

//   const handleChange = (e) => {
//     setJobData({ ...jobData, [e.target.name]: e.target.value });
//   };

//   const handleSkillSelect = (selected) => {
//     setSelectedSkills(selected || []);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");

//     const {
//       job_title,
//       job_position,
//       job_description,
//       job_requirements,
//       location,
//       salary_range,
//       deadline,
//     } = jobData;

//     // 1. Create the job
//     const { data: newJob, error: jobError } = await supabase.from("jobs").insert([
//       {
//         job_title,
//         job_position,
//         job_description,
//         job_requirements,
//         location,
//         salary_range,
//         deadline,
//         company_id: company.id,
//         company_title: company.name,
//       },
//     ]).select().single();

//     if (jobError) {
//       console.error("Job insert error:", jobError.message);
//       setMessage("Failed to create job.");
//       return;
//     }

//     // 2. Insert skills to job_skill_relation
//     for (const skill of selectedSkills) {
//       const { error: skillError } = await supabase
//         .from("job_skill_relation")
//         .insert([{ job_id: newJob.id, skill_id: skill.value }]);

//       if (skillError) console.error("Skill relation error:", skillError.message);
//     }

//     // 3. Final updates
//     setMessage("Job created successfully!");
//     setJobData({
//       job_title: "",
//       job_position: "",
//       job_description: "",
//       job_requirements: "",
//       location: "",
//       salary_range: "",
//       deadline: "",
//     });
//     setSelectedSkills([]);
//     fetchJobs();
//   };

//   return (
//     <div className="company-dashboard">
//       <h1 className="dashboard-title">Welcome, {company.name}</h1>
//       <p><strong>Email:</strong> {company.email}</p>

//       {/* Job Creation Form */}
//       <div className="createjob-box">
//         <h2>Create a Job</h2>
//         <form onSubmit={handleSubmit}>
//           <input type="text" name="job_title" placeholder="Job Title" value={jobData.job_title} onChange={handleChange} required />
//           <input type="text" name="job_position" placeholder="Job Position" value={jobData.job_position} onChange={handleChange} required />
//           <textarea name="job_description" placeholder="Description" value={jobData.job_description} onChange={handleChange} required />
//           <textarea name="job_requirements" placeholder="Requirements" value={jobData.job_requirements} onChange={handleChange} />
//           <input type="text" name="location" placeholder="Location" value={jobData.location} onChange={handleChange} />
//           <input type="text" name="salary_range" placeholder="Salary Range" value={jobData.salary_range} onChange={handleChange} />
//           <input type="date" name="deadline" value={jobData.deadline} onChange={handleChange} />
//           <label>Select Required Skills</label>
//           <Select
//             isMulti
//             options={skills}
//             value={selectedSkills}
//             onChange={handleSkillSelect}
//             className="react-select"
//             classNamePrefix="select"
//           />
//           <button type="submit" className="submit-btn">Create Job</button>
//         </form>
//         {message && <p className="job-message">{message}</p>}
//       </div>

//       {/* Display Jobs */}
//       <h2>Your Jobs</h2>
//       <div className="job-cards">
//         {jobs.map(job => (
//           <div className="job-card" key={job.id}>
//             <h3>{job.job_position}</h3>
//             <p><strong>Title:</strong> {job.job_title}</p>
//             <p><strong>Location:</strong> {job.location}</p>
//             <p><strong>Salary:</strong> {job.salary_range}</p>
//             <p><strong>Deadline:</strong> {job.deadline}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CompanyDashboard;


import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Select from "react-select";
import "./companydashboard.css";
import "./createjob.css";

const CompanyDashboard = () => {
  const company = JSON.parse(localStorage.getItem("company"));

  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [jobData, setJobData] = useState({
    job_title: "",
    job_position: "",
    job_description: "",
    job_requirements: "",
    location: "",
    salary_range: "",
    deadline: "",
  });

  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applicants, setApplicants] = useState([]);

  // Fetch skills and jobs
  useEffect(() => {
    fetchSkills();
    fetchJobs();
  }, []);

  const fetchSkills = async () => {
    const { data, error } = await supabase.from("skill_list").select("*");
    if (error) console.error("Skill fetch error:", error.message);
    else {
      const formatted = data.map(skill => ({ value: skill.id, label: skill.skill_type }));
      setSkills(formatted);
    }
  };

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("company_id", company.id);
    if (error) console.error("Job fetch error:", error.message);
    else setJobs(data);
  };

  const fetchApplicants = async (jobId) => {
    setSelectedJobId(jobId);
    const { data, error } = await supabase
    .from("job_applications")
    .select(`
      id,
      job_id,
      user_id,
      applied_at,
      status,
      user:user_id (
        name,
        email,
        institution,
        bio
      )
    `)
    .eq("job_id", jobId)
    .eq("status", "pending");
  

    if (error) console.error("Applicant fetch error:", error.message);
    else setApplicants(data);
  };

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleSkillSelect = (selected) => {
    setSelectedSkills(selected || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const {
      job_title,
      job_position,
      job_description,
      job_requirements,
      location,
      salary_range,
      deadline,
    } = jobData;

    // 1. Inline insert to jobs
    const { data: newJob, error: jobError } = await supabase
      .from("jobs")
      .insert([
        {
          job_title,
          job_position,
          job_description,
          job_requirements,
          location,
          salary_range,
          deadline,
          company_id: company.id,
          company_title: company.name,
        },
      ])
      .select()
      .single();

    if (jobError) {
      console.error("Job creation error:", jobError.message);
      setMessage("Job creation failed.");
      return;
    }

    // 2. Inline insert to job_skill_relation
    for (const skill of selectedSkills) {
      const { error: skillError } = await supabase
        .from("job_skill_relation")
        .insert([{ job_id: newJob.id, skill_id: skill.value }]);

      if (skillError) console.error("Skill relation error:", skillError.message);
    }

    // 3. Reset
    setMessage("Job created successfully!");
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
    fetchJobs();
  };

  return (
    <div className="company-dashboard">
      <h1 className="dashboard-title">Welcome, {company.name}</h1>
      <p><strong>Email:</strong> {company.email}</p>

      {/* Create Job Form */}
      <div className="createjob-box">
        <h2>Create a Job</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="job_title" placeholder="Job Title" value={jobData.job_title} onChange={handleChange} required />
          <input type="text" name="job_position" placeholder="Job Position" value={jobData.job_position} onChange={handleChange} required />
          <textarea name="job_description" placeholder="Description" value={jobData.job_description} onChange={handleChange} required />
          <textarea name="job_requirements" placeholder="Requirements" value={jobData.job_requirements} onChange={handleChange} />
          <input type="text" name="location" placeholder="Location" value={jobData.location} onChange={handleChange} />
          <input type="text" name="salary_range" placeholder="Salary Range" value={jobData.salary_range} onChange={handleChange} />
          <input type="date" name="deadline" value={jobData.deadline} onChange={handleChange} />
          <label>Select Required Skills</label>
          <Select
            isMulti
            options={skills}
            value={selectedSkills}
            onChange={handleSkillSelect}
            className="react-select"
            classNamePrefix="select"
          />
          <button type="submit" className="submit-btn">Create Job</button>
        </form>
        {message && <p className="job-message">{message}</p>}
      </div>

      {/* Jobs List */}
      <h2>Your Jobs</h2>
      <div className="job-cards">
        {jobs.map(job => (
          <div className="job-card" key={job.id}>
            <h3>{job.job_position}</h3>
            <p><strong>Title:</strong> {job.job_title}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Salary:</strong> {job.salary_range}</p>
            <p><strong>Deadline:</strong> {job.deadline}</p>
            <button onClick={() => fetchApplicants(job.id)}>View Applicants</button>
          </div>
        ))}
      </div>

      {/* Applicants View */}
      {selectedJobId && (
        <div className="applicant-section">
          <h2>Applicants</h2>
          {applicants.length === 0 ? (
            <p>No applicants yet.</p>
          ) : (
            applicants.map((app) => (
              <div className="applicant-card" key={app.id}>
                <h4>{app.user?.name}</h4>
                <p><strong>Email:</strong> {app.user?.email}</p>
                <p><strong>Institution:</strong> {app.user?.institution}</p>
                <p><strong>Bio:</strong> {app.user?.bio}</p>
                <button className="verdict-button">Make Verdict</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CompanyDashboard;
