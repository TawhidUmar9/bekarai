const axios = require('axios');
const supabase = require('../db');


//add job

exports.postJob = async (req, res) => {
    // const {
    //     job_title,
    //     job_position,
    //     job_description,
    //     job_requirements,
    //     location,
    //     salary_range,
    //     company_id
    // } = req.body;

    // if (!job_title || !job_position || !job_description || !job_requirements || !job_type || !job_salary || !company_id) {
    //     return res.status(404).json({ error: 'All fields are required' });
    // }

    // // Fetch the company
    // const { data: existingCompany, error: existingCompanyError } = await supabase
    //     .from('companies')
    //     .select('*')
    //     .eq('company_id', company_id)
    //     .single();

    // if (existingCompanyError && existingCompanyError.code !== 'PGRST116') {
    //     console.error('Error checking existing company:', existingCompanyError);
    //     return res.status(500).json({ error: 'Internal server error' });
    // }

    // if (!existingCompany) {
    //     return res.status(400).json({ error: 'Company does not exist' });
    // }

    // const company_name = existingCompany.company_name;

    // // Check if job already exists
    // const { data: existingJob, error: existingJobError } = await supabase
    //     .from('job')
    //     .select('*')
    //     .eq('job_title', job_title)
    //     .eq('company_id', company_id)
    //     .single();

    // if (existingJobError && existingJobError.code !== 'PGRST116') {
    //     console.error('Error checking existing job:', existingJobError);
    //     return res.status(500).json({ error: 'Internal server error' });
    // }

    // if (existingJob) {
    //     return res.status(400).json({ error: 'Job already exists' });
    // }

    // // Insert new job with company name
    // const { data: newJob, error: newJobError } = await supabase
    //     .from('job')
    //     .insert([
    //         {
    //             job_title,
    //             job_position,
    //             job_description,
    //             job_requirements,
    //             job_type,
    //             job_salary,
    //             company_id,
    //             company_title: company_name // make sure this column exists in your 'job' table
    //         }
    //     ])
    //     .select('*')
    //     .single();

    // if (newJobError) {
    //     console.error('Error creating job:', newJobError);
    //     return res.status(500).json({ error: 'Internal server error' });
    // }

    // return res.status(201).json({
    //     message: 'Job created successfully',
    //     job: newJob,
    // });
};

exports.postJobSkill = async (req, res) => {
    const { job_id, skill_id } = req.body;

    if (!job_id || !skill_id) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Check if the relation already exists
        const { data: existingRelation, error: checkError } = await supabase
            .from('job_skill_relation')
            .select('*')
            .eq('job_id', job_id)
            .eq('skill_id', skill_id)
            .single();

        if (checkError && checkError.code !== 'PGRST116') {
            console.error('Error checking relation:', checkError);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (existingRelation) {
            return res.status(400).json({ error: 'Relation already exists' });
        }

        // Insert new relation
        const { data, error } = await supabase
            .from('job_skill_relation')
            .insert([{ job_id, skill_id }])
            .select();

        if (error) {
            console.error('Error inserting relation:', error);
            return res.status(500).json({ error: 'Failed to add relation' });
        }

        return res.status(201).json({ message: 'Relation added successfully', relation: data });
    } catch (err) {
        console.error('Unexpected error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
