const express = require('express');
const router = express.Router();
const enrollController = require('../controller/enrollcontroller');

router.post('/', enrollController.enrollInCourse);

module.exports = router;