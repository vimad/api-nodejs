const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');
const BootCamp = require('../models/Bootcamp');

// @dec      Get courses
// @route    GET /api/v1/courses
// @route    GET /api/v1/:bootcampId/courses
// @access   Public
exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;
    if (req.params.bootcampId) {
        query = Course.find({bootcamp: req.params.bootcampId});
    } else {
        query = Course.find().populate({
            path: 'bootcamp',
            select: 'name description'
        });
    }

    const courses = await query;

    res.status(200).json({success: true, count: courses.length, data: courses});
});

// @dec      Get course
// @route    GET /api/v1/courses/:id
// @access   Public
exports.getCourse = asyncHandler(async (req, res, next) => {
    let query = Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: "name description"
    });

    const course = await query;
    if (!course) {
        next(new ErrorResponse(`can not find course with id ${req.params.id}`), 404)
    }

    res.status(200).json({success: true, data: course});
});

// @dec      Get courses
// @route    POST /api/v1/:bootcampId/courses
// @access   Private
exports.addCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;

    const bootCamp = BootCamp.findById(req.params.bootcampId);

    if (!bootCamp) {
        next(new ErrorResponse(`can not find bootcamp with id ${req.params.id}`), 404)
    }

    const course = await Course.create(req.body);

    res.status(200).json({success: true, data: course});
});


