const axios = require('axios');
const supabase = require('../db');

exports.fetchskill = async (req, res) => {
    try {
        const { data, error } = await supabase.from('skill_list').select('*');
        if (error) {
            throw error;
        }
        res.status(200).json({ skills: data });
    } catch (err) {
        console.error('Error fetching skills:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}