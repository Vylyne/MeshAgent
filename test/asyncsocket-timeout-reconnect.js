'use strict';
// Full-agent regression in a network-isolated container, using loopback only.
var net = require('net');
var completed = 0;
global.deadline = setTimeout(function () {
    console.log('FAIL_TIMEOUT'); process.exit(3);
}, 20000);
global.server = net.createServer();
server.on('error', function () { console.log('FAIL_SERVER'); process.exit(4); });
server.on('connection', function (socket) {
    global.peer = socket;
    socket.on('error', function () { console.log('FAIL_PEER'); process.exit(5); });
});
function connect() {
    global.client = net.createConnection({host:'127.0.0.1', port:server.address().port});
    client.on('error', function () { console.log('FAIL_CLIENT'); process.exit(6); });
    client.on('connect', function () {
        this.setTimeout(50, function () {
            console.log('TIMEOUT_CALLBACK');
            this.end();
            setTimeout(function () {
                completed++;
                if (completed === 10) {
                    console.log('PASS_TIMEOUT_RECONNECT_10'); process.exit(0);
                }
                connect();
            }, 100);
        });
    });
}
server.on('listening', connect);
server.listen({host:'127.0.0.1', port:0});
