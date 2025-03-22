require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errHandler = require('./middleware/errHandler');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;

// connect to MongoDB
connectDB();

// ***** CUSTOM MIDDLEWARE LOGGER *****
app.use(logger);
app.use(cors(corsOptions));

// ***** MIDDLEWARE *****
// built-in middleware to handle urlencoded data
// in other words, form data: 'content-type: application/x-www-form-urlencoded'
// if put here, this applies to all routes below it
app.use(express.urlencoded({ extended : false }));
// built-in middleware for json
app.use(express.json());


// serve static files (like css, img etc)
app.use(express.static(path.join(__dirname, '/public')));


// ***** ROUTERS *****
// route any request to subdirectly to the subdir router
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/employees', require('./routes/api/employees'));

// catch all 404
app.all('*', (request, response) => {
    response.status(404);
    if (request.accepts('html')) {
        response.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (request.accepts('json')) {
        response.json({ error: "404 Not Found"});
    } else {
        response.type('txt').send("404 Not Found");
    }
});

app.use(errHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})