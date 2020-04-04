// @dec      Get all bootcamps
// @route    GET /api/v1/bootcamps
// @access   Public
exports.getBootcamps = (req, res, next) => {
    res.status(200).json({message: `received`})
};

// @dec      Get single bootcamps
// @route    GET /api/v1/bootcamps/:id
// @access   Public
exports.getBootcamp = (req, res, next) => {
    res.status(200).json({message: `received`})
};

// @dec      Create a  bootcamp
// @route    POST /api/v1/bootcamps
// @access   Private
exports.createBootcamp = (req, res, next) => {
    res.status(200).json({message: `received`})
};

// @dec      Get all bootcamps
// @route    PUT /api/v1/bootcamps/:id
// @access   private
exports.updateBootcamp = (req, res, next) => {
    res.status(200).json({message: `received`})
};

// @dec      Get all bootcamps
// @route    DELETE /api/v1/bootcamps/:id
// @access   private
exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({message: `received`})
};
