const express = require('express');
const advancedResults = require('../middleware/advancedResults');
const {getBootcamp, getBootcamps, createBootcamp, updateBootcamp, deleteBootcamp, getBootcampsInRadius, bootCampPhotoUpload} = require('../controllers/bootcamps');
const BootCamp = require('../models/Bootcamp');
const router = express.Router();

const courseRoutes = require('./courses');

router.use('/:bootcampId/courses', courseRoutes);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/:id/photo').put(bootCampPhotoUpload);

router.route('/')
    .get(advancedResults(BootCamp, 'courses'), getBootcamps)
    .post(createBootcamp);

router.route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);

module.exports = router;
