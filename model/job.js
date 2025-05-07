const { text } = require('express');
const supabase = require('../db');

async function createJob(job) {