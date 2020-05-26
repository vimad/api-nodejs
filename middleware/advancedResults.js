
const advancedResults = (model, populate) => async (req, res, next) => {
    const reqQuery = {...req.query};

    const removeFields = ['select', 'sort', 'page', 'limit'];

    removeFields.forEach(field => delete reqQuery[field]);

    let queryString = JSON.stringify(reqQuery);
    queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    let query = model.find(JSON.parse(queryString));

    if (populate) {
        query = query.populate(populate);
    }

    if (req.query.select) {
        const select = req.query.select.split(',').join(' ');
        query = query.select(select);
    }

    if (req.query.sort) {
        const sort = req.query.sort.split(',').join(' ');
        query = query.sort(sort);
    } else {
        query = query.sort('-createdAt');
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);

    let pagination = {};

    if (endIndex < total) {
        pagination.next ={
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.prev ={
            page: page - 1,
            limit
        }
    }

    const results = await query;

    res.advancedResults = {
        success: true,
        count: results.length,
        pagination,
        data: results
    };

    next();
};

module.exports = advancedResults;
