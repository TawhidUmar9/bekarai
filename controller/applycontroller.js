const axios = require('axios');
const supabase = require('../db');

// Apply for a job
exports.applyForJob = async (req, res) => {
    const { user_id, job_id } = req.body;

    try {
        // Check if the user already applied for the job
        const { data: existingApplication, error: checkError } = await supabase
            .from('job_applications')
            .select('*')
            .eq('user_id', user_id)
            .eq('job_id', job_id)
            .limit(1);

        console.log('Existing Application check result:', existingApplication);

        if (checkError && checkError.code !== 'PGRST116') {
            throw checkError;
        }

        if (existingApplication && existingApplication.length > 0) {
            return res.status(400).json({ message: 'User has already applied for this job' });
        }

        // Insert new job application
        const { data: newApplication, error: applyError } = await supabase
            .from('job_applications')
            .insert([{ job_id, user_id, applied_at: new Date(), status: 'applied' }])
            .select();

        if (applyError) {
            throw applyError;
        }

        res.status(200).json({ message: 'Job applied successfully', application: newApplication });
    } catch (error) {
        console.error('Error applying for job:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
