const express = require('express');
const router = express.Router();
const courseController = require('../controller/coursecontroller');

router.get('/all', courseController.fetchCourses);
router.get('/:id', courseController.fetchCoursById);
module.exports = router;