const express = require('express');
const router = express.Router();
const {listSchools, addSchool} = require('../controllers/schoolController');

router.post('/addSchool', addSchool);
router.get('/listSchools', listSchools);

module.exports = router;
