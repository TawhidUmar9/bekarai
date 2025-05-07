const express = require('express');
const router = express.Router();
const applyController = require('../controller/applycontroller');

router.post('/', applyController.applyForJob);

module.exports = router;