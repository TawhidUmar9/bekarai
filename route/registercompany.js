const express = require('express');
const router = express.Router();
const registerCompanyController = require('../controller/registercompanycontroller');

router.post('/', registerCompanyController.registercompany);
module.exports = router;
