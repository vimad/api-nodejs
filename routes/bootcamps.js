const express = require('express');
const advancedResults = require('../middleware/advancedResults');
const {getBootcamp, getBootcamps, createBootcamp, updateBootcamp, deleteBootcamp, getBootcampsInRadius, bootCampPhotoUpload} = require('../controllers/bootcamps');
const BootCamp = require('../models/Bootcamp');
const router = express.Router();
const {protect} = require('../middleware/auth');

const courseRoutes = require('./courses');

router.use('/:bootcampId/courses', courseRoutes);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/:id/photo').put(protect, bootCampPhotoUpload);

router.route('/')
    .get(advancedResults(BootCamp, 'courses'), getBootcamps)
    .post(protect, createBootcamp);

router.route('/:id')
    .get(getBootcamp)
    .put(protect, updateBootcamp)
    .delete(protect, deleteBootcamp);

module.exports = router;
