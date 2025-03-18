const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const logEvents = require('./logEvents');    // custom module
const EventEmitter = require('events');

class Emitter extends EventEmitter {};
const myEmitter = new Emitter();            // initialize object

// creating web server
const PORT = process.env.PORT || 3500;
myEmitter.on('log', (msg, fileName) => logEvents(msg, fileName));    // add listener for the log event
const serveFile = async (filePath, contentType, response) => {
    try {
        const rawData = await fsPromises.readFile(
            filePath,
            !contentType.includes('image') ? 'utf8' : ''
        );
        const data = contentType === 'application/json' ? JSON.parse(rawData) : rawData;
        response.writeHead(
            filePath.includes('404.html') ? 404 : 200,
            {'Content-Type': contentType}
        );
        response.end( 
            contentType === 'application/json' ? JSON.stringify(data) : data
        );
    } catch (err) {
        console.log(err);
        myEmitter.emit('log', `${err.name}: ${err.message}`, 'errLog.txt');
        response.statusCode = 500;
        response.end();
    }
}

const server = http.createServer((request, response) => {
    console.log(request.url, request.method);
    myEmitter.emit('log', `${request.url}\t${request.method}`, 'reqLog.txt');

    // ***** GETTING REQUESTED FILE PATH *****
    const extension = path.extname(request.url);

    // all different file types we expect web server to serve
    let contentType;
    switch (extension) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html';
    }

    let filePath;
    if (contentType === 'text/html' && request.url === '/') {
        // main directory
        filePath = path.join(__dirname, 'views', 'index.html');
    } else if (contentType === 'text/html' && request.url.slice(-1) === '/') {
        // sub directory
        filePath = path.join(__dirname, 'views', request.url, 'index.html');
    } else if (contentType === 'text/html') {
        // look at whatever was requested in the views folder, because where html should be
        filePath = path.join(__dirname, 'views', request.url)
    } else {
        // something in one of the other folders
        filePath = path.join(__dirname, request.url);
    }

    // makes .html extension not required in the browser
    if (!extension && request.url.slice(-1) !== '/') filePath += '.html';


    // ***** SERVING REQUESTED FILE *****
    // check to see if want to serve the file
    const fileExists = fs.existsSync(filePath);
    if (fileExists) {
        // serve the file
        serveFile(filePath, contentType, response);
    } else {
        // 404
        // 301 redirect
        switch(path.parse(filePath).base) {
            case 'old-page.html':
                response.writeHead(301, {'Location': '/new-page.html'});    // handling redirect
                response.end();
                break;
            case 'www-page.html':
                response.writeHead(301, {'Location': '/'});
                response.end()
                break;
            default:
                // serve a 404 request response
                serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', response);
        }
    }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
