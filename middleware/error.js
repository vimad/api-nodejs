const ErrorResponse = require('../utils/ErrorResponse')

const errorHandler = (err, req, res, next) => {
    console.log(err.stack.red);

    let error = {...err};

    //Mongoose not found error
    if(err.name === 'CastError') {
        error = new ErrorResponse(`Bootcamp not found for id ${err.value}`, 404)
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message
    })
};

module.exports = errorHandler;
