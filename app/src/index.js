const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const socketIO = require('socket.io');
const http =require('http');


// initialization
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
// settings
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));


// routes
app.use(require('./routes/'));

// sockets
require('./sockets')(io);


// stactic files
app.use(express.static(path.join(__dirname,'public')));

// starting the server
server.listen(3000, () => {
    console.log('Server on port 3000');
})



/*
app.get('/test', (req, res) => {    
    let coords = {coordinates: [4.8148, 45.7758]};

    const childPython = spawn('python', ['src/app.py', JSON.stringify(coords)]);
    resultString = '';

    childPython.stdout.on('data', (data) => {
        resultString += data.toString();
    });

    childPython.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    childPython.stderr.on('end', () => {
        let resultData = JSON.parse(resultString);
        console.log(resultData);
        res.json(resultData)
    });


    childPython.on('close', (code) => {
        console.log(`child process exited with code: ${code}`);
    });
});
 */