const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const BootCamp = require('../models/Bootcamp');

// @dec      Get all bootcamps
// @route    GET /api/v1/bootcamps
// @access   Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    let queryString = JSON.stringify(req.query);
    queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    let query = BootCamp.find(JSON.parse(queryString));

    const bootCamps = await query;
    res.status(200).json({success: true, count: bootCamps.length, data: bootCamps});
});

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

// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // Divide dist by radius of Earth
    // Earth Radius = 3,963 mi / 6,378 km
    const radius = distance / 3963;

    const bootcamps = await BootCamp.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });
});