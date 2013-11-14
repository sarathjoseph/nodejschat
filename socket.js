var http = require("http");
var fs = require("fs");
var users = new Array();
var port=process.env.PORT||4444;
idle = new Array();

var server = http.createServer(function (req, res) {


    fs.readFile('./index.html', function (error, data) {

        res.writeHead(200, {
            'content-Type': 'text/html'
        });
        res.end(data, 'utf-8');
    });




}).listen(port);


io = require("socket.io").listen(server, {
    log: false
});


io.sockets.on('connection', function (socket) {

    var first = true;
    var name, i;

    //This function searches for user in the array and removes it

    function removeUser(array) {

        for (i = 0; i < array.length; i++) {
            if (array[i] === name) array.splice(i, 1);

        }

    }
    //This function pushes unique users in the array . Has an additional check to prevent disconnected users from being pushed in

    function addUser(array, data) {
        for (i = 0; i < array.length; i++) {
            if (array[i] === data) var exits = true;
        }

        if (!exits && data === name) array.push(data)

    }


    socket.on('textmesg', function (data) {


        if (first) {
            name = data.nom;
            users.push(name);
            first = false;

        }


        socket.broadcast.emit('message', {
            "txt": data.mesg,
            "name": data.nom
        });
        socket.emit('message', {
            "txt": data.mesg,
            "name": data.nom
        });


    });

    socket.on('status', function (data) {

        socket.broadcast.emit('status', {
            "activeusers": users,
            "idleusers": idle
        });
        socket.emit('status', {
            "activeusers": users,
            "idleusers": idle
        });

    });

    socket.on('idle', function (data) {


        addUser(idle, data);
        removeUser(users);


    });

    socket.on('available', function (data) {

        removeUser(idle);
        addUser(users, data);

    });

    socket.on('disconnect', function () {

        removeUser(idle);
        removeUser(users);

        name = "disconnected";
    });


});