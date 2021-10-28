const {spawn} = require('child_process');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('New User connected');

        socket.on('userCoordinates', coords => { 
            console.log(coords);
            //let coords = {coordinates: [4.8148, 45.7758]};
            
            const childPython = spawn('/home/noe/Satelitte/app/myenv/bin/python3', ['src/app.py', JSON.stringify(coords)]);
            resultString = '';

            childPython.stdout.on('data', (data) => {
                resultString += data.toString();
            });

            childPython.stderr.on('data', (data) => {
                console.log(`stderr: ${data}`);
            });

            childPython.stderr.on('end', () => {
                let resultData = JSON.parse(resultString);
                socket.emit('markerInfo', resultData);
            });


            childPython.on('close', (code) => {
                console.log(`child process exited with code: ${code}`);
            });
            
        })
        
    });
}