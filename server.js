const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileUpload = require('express-fileupload');
const error = require('./middleware/error');
const connectDB = require('./config/db');

const bootcamp = require('./routes/bootcamps');
const course = require('./routes/courses');
const auth = require('./routes/auth');

dotenv.config({path: 'config/config.env'});

connectDB();

const app = express();

// parse body
app.use(express.json());

// cookie parser
app.use(cookieParser());

// Add a logger middleware for requests
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// File upload middleware
app.use(fileUpload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/bootcamps', bootcamp);
app.use('/api/v1/courses', course);
app.use('/api/v1/auth', auth);

app.use(error);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log(`server running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold));

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    server.close(() => process.exit(1));
});
