require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');

const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Custom middleware logger
app.use(logger);

// Cross-Origin Resource Sharing (CORS)
app.use(cors(corsOptions));

// Built-in middleware to handle urlencoded data
// In other words, form data:
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// Built-in middleware for json
app.use(express.json());

// Custom middleware to route to files in subdir
app.use('/', require('./routes/root.js'));
app.use('/states', require('./routes/api/states.js'));

// Could use app.use('/'), did not accept regex and used usually for middleware in older versions. It now does.
// Instead use app.all. It accepts regex and catches left over requests
app.all('*', (req, res) => {
    // res.sendFile(path.join(__dirname, 'views', '404.html')); // Sends 200 by default
    res.status(404);
    if(req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html')); // Sends 404
    } else if(req.accepts('json')) {
        res.json({ error: '404 Not Found'});
    } else {
        res.type('txt').send('404 Not Found');
    }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
