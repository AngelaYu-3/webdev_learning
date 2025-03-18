const { logEvents } = require('./logEvents');

const errorHandler = (err, request, response, next) => {
    logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
    console.error(err.stack);
    response.status(500).send(err.message);
}

module.exports = errorHandler;

