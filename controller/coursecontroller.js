const axios = require('axios');
const supabase = require('../db');

exports.fetchCourses = async (req, res) => {
    console.log('Fetching all courses');
    try {
        const { data, error } = await supabase.from('course').select('*');
        if (error) {
            throw error;
        }
        res.status(200).json({ courses: data });
    } catch (err) {
        console.error('Error fetching courses:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.fetchCoursById = async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase.from('course').select('*').eq('id', id);
        if (error) {
            throw error;
        }
        res.status(200).json({ course: data });
    } catch (err) {
        console.error('Error fetching course:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
