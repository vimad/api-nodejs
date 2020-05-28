const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @dec      Register user
// @route    GET /api/v1/auth/register
// @access   Public
exports.register = asyncHandler(async (req, res, next) => {

    const {name, email, password, role} = req.body;

    const user = await User.create({
        name, email, password, role
    });

    const token = user.getSignedJwtToken();

    res.status(200).json({success: true, token});
});

// @dec      Login user
// @route    GET /api/v1/auth/login
// @access   Public
exports.login = asyncHandler(async (req, res, next) => {

    const {email, password} = req.body;

    if (!email || !password) {
        return next(new ErrorResponse(`Invalid Credentials`, 401));
    }

    const user = await User.findOne({email}).select('password');

    if (!user) {
        return next(new ErrorResponse(`Invalid Credentials`, 401));
    }

    const match = await user.matchPassword(password);

    if (!match) {
        return next(new ErrorResponse(`Invalid Credentials`, 401));
    }

    const token = user.getSignedJwtToken();

    res.status(200).json({success: true, token});
});
