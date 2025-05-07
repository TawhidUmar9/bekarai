const User = require('../model/user');


exports.register = async (req, res) => {
    try {
        const
        {name, email, password,date_of_birth, contact, gender, religion, bio, institution, skill_type_array} = req.body;
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
            return res.status(400).json({error: 'user already exists'});
        }
        // Create a new user record in the database
        const new_name = await User.createUser({ name, email, password, date_of_birth, contact, gender, religion, bio, institution });
        // get the user id
        const user_id = await User.getUserId(email); 
        console.log(user_id[0].user_id);
        //for each skill type in the array, insert into the database
        for (let i = 0; i < skill_type_array.length; i++) {
            const skill_type = skill_type_array[i];
            const skill_type_id = await User.getSkillTypeId(skill_type);
            if (skill_type_id) {
                console.log(skill_type_id[0].id);
                await User.insertUserSkillType(user_id[0].user_id, skill_type_id[0].id);
            }
        }
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

