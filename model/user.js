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
async function createUser({ name, email, password, date_of_birth, contact, gender, religion, bio, institution }) {
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const { data, error } = await supabase
      .from('user')
      .insert([
        {
          name,
          email,
          password: hashedPassword,
          date_of_birth: date_of_birth,
          contact: contact,
          gender: gender, 
          religion: religion,
          bio: bio,
          institution: institution
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
// getUserId;
async function getUserId(email) {
    const { data, error } = await supabase
    .from('user')
    .select('user_id')
    .eq('email', email)
    if (error) {
        console.error(error)
        return null
    }
    
  return data;
}

// get skill type id
async function getSkillTypeId(skill_type) {
    const { data, error } = await supabase
    .from('skill_list')
    .select('id')
    .eq('skill_type', skill_type)
    if (error) {
        console.error(error)
        return null
    }
    
  return data;
}

// insert user_skilll_id and user_id to user_skill_relation table

async function insertUserSkillType(user_id, skill_type_id) {
    const { data, error } = await supabase
    .from('user_skill_relation')
    .insert([
        {
            user_id: user_id,
            skill_id: skill_type_id
        }
    ])
    if (error) {
        console.error(error)
        return null
    }
    
  return data;
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
    findUserByEmail, getSkillTypeId, insertUserSkillType,
    createUser, findDesignerByid, updateProfileImage,
    deleteUser, updatePassword, getUserId};