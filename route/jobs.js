const express = require('express');
const router = express.Router();
const jobController = require('../controller/jobcontroller');

router.get('/all', jobController.fetchJobs);
router.get('/:id', jobController.fetchJobById);

module.exports = router;