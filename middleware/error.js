const ErrorResponse = require('../utils/ErrorResponse')

const errorHandler = (err, req, res, next) => {
    console.log(err.stack.red);

    let error = {...err};

    //Mongoose not found error
    if(err.name === 'CastError') {
        error = new ErrorResponse(`Resource not found for id ${err.value}`, 404)
    }

    //Mongoose duplicate key error
    if (err.code === 11000) {
        error = new ErrorResponse('Duplicate key found', 400);
    }

    // Mongoose validation errors
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(err => err.message);
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message
    })
};

module.exports = errorHandler;
