const express = require('express');
const router = express.Router();
const summarycontroller = require('../controller/summarycontroller');

router.post('/', summarycontroller.summarize);
module.exports = router;
