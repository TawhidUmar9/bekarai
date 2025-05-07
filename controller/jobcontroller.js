const axios = require('axios');
const supabase = require('../db');

// Fetch all jobs

exports.fetchJobs = async (req, res) => {
    console.log('Fetching all jobs');
    try {
        const { data, error } = await supabase.from('jobs').select('*');
        if (error) {
            throw error;
        }
        res.status(200).json({ jobs: data });
    } catch (err) {
        console.error('Error fetching jobs:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Fetch job by ID
exports.fetchJobById = async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase.from('jobs').select('*').eq('id', id);
        if (error) {
            throw error;
        }
        res.status(200).json({ job: data });
    } catch (err) {
        console.error('Error fetching job:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}