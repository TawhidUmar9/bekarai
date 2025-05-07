const express = require('express');
const router = express.Router();
const fetchskillcontroller = require('../controller/fetchskillcontroller');

router.get('/', fetchskillcontroller.fetchskill);
module.exports = router;
