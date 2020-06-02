const express = require('express');
const advancedResults = require('../middleware/advancedResults');
const {getBootcamp, getBootcamps, createBootcamp, updateBootcamp, deleteBootcamp, getBootcampsInRadius, bootCampPhotoUpload} = require('../controllers/bootcamps');
const BootCamp = require('../models/Bootcamp');
const router = express.Router();
const {protect, authorize} = require('../middleware/auth');

const courseRoutes = require('./courses');

router.use('/:bootcampId/courses', courseRoutes);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), bootCampPhotoUpload);

router.route('/')
    .get(advancedResults(BootCamp, 'courses'), getBootcamps)
    .post(protect, authorize('publisher', 'admin'), createBootcamp);

router.route('/:id')
    .get(getBootcamp)
    .put(protect, authorize('publisher', 'admin'), updateBootcamp)
    .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

module.exports = router;
