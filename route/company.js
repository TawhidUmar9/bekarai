const express = require('express');
const router = express.Router();
const companyController = require('../controller/companycontroller');

router.post('/job', companyController.postJob);
router.post('/job-skill', companyController.postJobSkill);

module.exports = router;