const axios = require('axios');
const supabase = require('../db');
const bcrypt = require('bcryptjs');

exports.registercompany = async (req, res) => {
    const { companyName, email, password, description, website } = req.body;

    if (!companyName || !email || !password) {
        return res.status(404).json({ error: 'All fields are required' });
    }

    // Check if company already exists
    const { data: existingCompany, error: existingCompanyError } = await supabase
        .from('companies') // <-- fixed table name
        .select('*')
        .eq('email', email)
        .single();

    if (existingCompanyError && existingCompanyError.code !== 'PGRST116') {
        console.error('Error checking existing company:', existingCompanyError);
        return res.status(500).json({ error: 'Internal server error' });
    }

    if (existingCompany) {
        return res.status(400).json({ error: 'Company already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: newCompany, error: newCompanyError } = await supabase
        .from('companies')
        .insert([
            {
                name: companyName,
                email,
                password: hashedPassword,
                description,
                website
            }
        ])
        .select('*')
        .single();

    if (newCompanyError) {
        console.error('Error creating company:', newCompanyError);
        return res.status(500).json({ error: 'Internal server error' });
    }

    return res.status(201).json({
        message: 'Company created successfully',
        company: newCompany,
    });
};
