const User = require('../model/user');


exports.register = async (req, res) => {
    try {
        const
        {name, email, password, date_of_birth, contact, gender, religion, image, bio, skill_type_array} = req.body;
        console.log(req.body);
        // Validate input data (check for missing fields, etc.)
        if (!name || !email || !password) {
            return res.status(404).json({error: 'All fields are required'});
        }
        // Check if user already exists
        const
        user = await User.findUserByEmail(email);
        console.log(user.length);
        if (user.length != 0) {
            // console.log(user);
            return res.status(400).json({error: 'user already exists'});
        }
        // Create a new user record in the database
        const new_name = await User.createUser({ name, email, password });

        if (!new_name) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        
        return res.status(201).json({
            message: 'User created successfully',
            name: new_name,
        });
    }
    catch (err) {
        console.error('Error in register:', err);
        res.status(500).json({error: 'Internal server error'});
    }
}

