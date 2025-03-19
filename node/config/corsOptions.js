// cross origin resource sharing--sites able to access backend
// place front end domains that can access these routes to backend files
// development urls (not yoursite.com) and "!origin" should be removed after development
const whitelist = [
    'https://www.yoursite.com',
    'http://127.0.0.1:5500',
    'http://localhost:3500'
];
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

module.exports = corsOptions;