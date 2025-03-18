// imported modules
const { format } = require('date-fns');
const { v4: uuid } = require('uuid');    // ES6 imports
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');


// this is a good demonstration of async / await--understand this
const logEvents = async (message, logName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
    console.log(logItem);

    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
        }
        // testing
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logName), logItem);
    } catch (err) {
        console.log(err);
    }
}

const logger = (request, response, next) => {
    logEvents(`${request.method}\t${request.headers.origin}\t${request.url}`, 'reqLog.txt');
    console.log(`${request.method} ${request.path}`);
    next();
}

module.exports = { logger, logEvents };

/*
console.log(format(new Date(), 'yyyyMMdd\tHH:mm:ss'))
console.log(uuid())*/