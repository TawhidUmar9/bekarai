const axios = require('axios');
const supabase = require('../db');


//enroll in course

exports.enrollInCourse = async (req, res) => {
    const { user_id, course_id } = req.body;

    try {
        // Check if the user is already enrolled in the course
        const { data: existingEnrollment, error: checkError } = await supabase
            .from('user_course_relation')
            .select('*')
            .eq('user_id', user_id)
            .eq('course_id', course_id)
            .limit(1);

        console.log('Enrollment check result:', existingEnrollment);

        if (checkError && checkError.code !== 'PGRST116') {
            throw checkError;
        }

        // If any row was returned, the user is already enrolled
        if (existingEnrollment && existingEnrollment.length > 0) {
            return res.status(400).json({ message: 'User is already enrolled in this course' });
        }

        // Enroll the user in the course
        const { data: newEnrollment, error: enrollError } = await supabase
            .from('user_course_relation')
            .insert([{ user_id, course_id }])
            .select(); // return inserted row

        if (enrollError) {
            throw enrollError;
        }

        res.status(200).json({ message: 'User enrolled successfully', enrollment: newEnrollment });
    } catch (error) {
        console.error('Error enrolling in course:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};