const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const errHandler = require('./middleware/errHandler');
const PORT = process.env.PORT || 3500;



// ***** CUSTOM MIDDLEWARE LOGGER *****
app.use(logger);

// cross origin resource sharing--sites able to access backend
// place front end domains that can access these routes to backend files
// development urls (not yoursite.com) and "!origin" should be removed after development
const whitelist = ['https://www.yoursite.com', 'http://127.0.0.1:5500', 'http://localhost:3500']
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));



// ***** MIDDLEWARE *****
// built-in middleware to handle urlencoded data
// in other words, form data: 'content-type: application/x-www-form-urlencoded'
// if put here, this applies to all routes below it
app.use(express.urlencoded({ extended : false }));

// built-in middleware for json
app.use(express.json());

// serve static files
app.use(express.static(path.join(__dirname, '/public')));



// ***** ROUTE HANDLERS *****
app.get('^/$|/index(.html)?', (request, response) => {
    // response.sendFile('./views/index.html', { root: __dirname });
    response.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/new-page(.html)?', (request, response) => {
    response.sendFile(path.join(__dirname, 'views', 'new-page.html'));
});

app.get('/old-page(.html)?', (request, response) => {
    response.redirect(301, '/new-page.html');  // 302 by default but want a 301
});


/*app.get('/hello(.html)?', (request, resopnse, next) => {
    console.log('attempted to load hello.html');
    next()
}, (request, response) => {
    response.send('hello world!');
});*/

// chaining route handlers
const one = (request, response, next) => {
    console.log('one');
    next();
};
const two = (request, response) => {
    console.log('two');
    response.send('finished!');
}
app.get('/chain(.html)?', [one, two]);

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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
