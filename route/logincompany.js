const express = require('express');
const router = express.Router();
const loginCompanyController = require('../controller/logincompanycontroller');

router.post('/', loginCompanyController.loginCompany);

module.exports = router;