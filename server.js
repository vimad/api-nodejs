const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');

const bootcamp = require('./routes/bootcamps')

dotenv.config({path: 'config/config.env'});

connectDB();

const app = express();

// parse body
app.use(express.json());

// Add a logger middleware for requests
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use('/api/v1/bootcamps', bootcamp);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log(`server running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold));

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    server.close(() => process.exit(1));
});
