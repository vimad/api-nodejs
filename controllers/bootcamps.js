const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async');
const BootCamp = require('../models/Bootcamp');

// @dec      Get all bootcamps
// @route    GET /api/v1/bootcamps
// @access   Public
exports.getBootcamps = async (req, res, next) => {
    try {
        const bootCamps = await BootCamp.find();
        res.status(200).json({success: true, count: bootCamps.length, data: bootCamps});
    } catch (e) {
        next(e);
    }
};

// @dec      Get single bootcamps
// @route    GET /api/v1/bootcamps/:id
// @access   Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootCamp = await BootCamp.findById(req.params.id);

    if (!bootCamp) {
        next(new ErrorResponse(`Bootcamp not found for id ${req.params.id}`, 404));
    }
    res.status(200).json({success: true, data: bootCamp});
});

// @dec      Create a  bootcamp
// @route    POST /api/v1/bootcamps
// @access   Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootCamp = await BootCamp.create(req.body);
    res.status(200).json({success: true, data: bootCamp});
});

// @dec      Get all bootcamps
// @route    PUT /api/v1/bootcamps/:id
// @access   private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootCamp = await BootCamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!bootCamp) {
        next(new ErrorResponse(`Bootcamp not found for id ${req.params.id}`, 404));
    }
    res.status(200).json({success: true, data: bootCamp});
});

// @dec      Get all bootcamps
// @route    DELETE /api/v1/bootcamps/:id
// @access   private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootCamp = await BootCamp.findByIdAndDelete(req.params.id);
    if (!bootCamp) {
        next(new ErrorResponse(`Bootcamp not found for id ${req.params.id}`, 404));
    }
    res.status(200).json({success: true, data: {}});
});
