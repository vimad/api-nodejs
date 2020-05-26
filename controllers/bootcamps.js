const path = require('path');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const BootCamp = require('../models/Bootcamp');

// @dec      Get all bootcamps
// @route    GET /api/v1/bootcamps
// @access   Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
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
    const bootCamp = await BootCamp.findById(req.params.id);
    if (!bootCamp) {
        return next(new ErrorResponse(`Bootcamp not found for id ${req.params.id}`, 404));
    }
    bootCamp.remove();
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

// @dec      upload a file
// @route    PUT /api/v1/bootcamps/:id/photo
// @access   private
exports.bootCampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootCamp = await BootCamp.findById(req.params.id);
    if (!bootCamp) {
        return next(new ErrorResponse(`Bootcamp not found for id ${req.params.id}`, 404));
    }

    if (!req.files) {
        return next(new ErrorResponse('Please upload a file', 400));
    }

    const file = req.files.file;

    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse('Please upload a image file', 400));
    }

    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please upload a image size less than ${process.env.MAX_FILE_UPLOAD}`, 400));
    }

    file.name = `photo_${bootCamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            return next(new ErrorResponse('Problem saving image'), 500);
        }

        await BootCamp.findByIdAndUpdate(req.params.id, {photo: file.name});

        res.status(200).json({success: true, data: file.name});
    });
});
