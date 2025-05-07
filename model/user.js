const { text } = require('express');
const supabase = require('../db');
const bcrypt = require('bcryptjs');
//const { use } = require('../route/projectviewUser');

// create user
//check if user exists with supabase



async function
findUserByEmail(email) {
    const { data, error } = await supabase
    .from('user')
    .select('*')
    .eq('email', email)
    if (error) {
        console.error(error)
        return null
    }
    
  return data;
}
async function createUser({ name, email, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const { data, error } = await supabase
      .from('user')
      .insert([
        {
          name,
          email,
          password: hashedPassword
        }
      ])
      .single(); // This ensures that it returns a single row if the insertion is successful
  
    if (error) {
      console.error('Supabase insert error:', error.message);
      throw new Error('Could not create user');
    }
  
    return name; // Return the inserted user data
}

// find user info by id joining user and survey designer table
async function findDesignerByid(id) {
    const { data, error } = await supabase.rpc('find_designer_by_id', {
        u_id: id
    });
    return { data, error };
}

async function updateProfileImage(userId, imageUrl) {
    // console.log(imageUrl, userId)
    const { data, error } = await supabase
    .from('user')
    .update({
        image: imageUrl
    })
    .eq('user_id', userId , {
        upsert: true
    }
    )
    // console.log(data)
    return {  error };
}
// update user joining user and survey designer table with user_id

async function updateSurveyDesigner(userId, data) {
    console.log(userId);
    // console.log(data);
    const { error } = await supabase.rpc('update_survey_designer', {
        u_id: userId,
        u_name: data.name,
        u_email: data.email,
        u_secret_question: data.secret_question,
        u_secret_answer: data.secret_answer,
        u_address: data.address,
        u_date_of_birth: data.date_of_birth,
        u_contact: data.contact,
        u_gender: data.gender,
        u_religion: data.religion,
        u_affiliation: data.affiliation,
        u_research_field: data.research_field,
        u_profession: data.profession,
        u_years_of_experience: data.years_of_experience,
        u_profile_link: data.profile_link
        
    });
    return { error };
}
// delete user
async function deleteUser(userId) {
    const { data, error } = await supabase
    .from('user')
    .delete()
    .eq('user_id', userId)
    return { error };
}
// update password
async function updatePassword(userId, password) {
    const { data, error } = await supabase
    .from('user')
    .update({ password })
    .eq('user_id', userId)
    return { error };
}




module.exports = {
    findUserByEmail,
    createUser, findDesignerByid, updateProfileImage, updateSurveyDesigner,
    deleteUser, updatePassword};