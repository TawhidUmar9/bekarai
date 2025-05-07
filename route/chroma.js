const express = require('express');
const router = express.Router();

const chromacontroller = require('../controller/chromacontroller');

router.get('/', chromacontroller.printToTerm);

module.exports = router;