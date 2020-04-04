const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

const bootcamp = require('./routes/bootcamps')

dotenv.config({path: 'config/config.env'});

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use('/api/v1/bootcamps', bootcamp);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server running in ${process.env.NODE_ENV} on port ${PORT}`));
