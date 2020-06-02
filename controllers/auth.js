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

    sendTokenResponce(user, 200, res);
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

    sendTokenResponce(user, 200, res);
});

const sendTokenResponce = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.security = true;
    }

    res.status(statusCode)
        .cookie('token', token, options)
        .json({success: true, token});
};

// @dec      Get logged in user
// @route    GET /api/v1/auth/me
// @access   private
exports.getMe = asyncHandler(async (req, res, next) => {
   const user = req.user;

   res.status(200).json({
       success: true,
       data: user
   });
});

