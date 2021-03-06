'use strict';

let app = require('express')();
let http = require('http').Server(app);
var bodyParser = require('body-parser');
var dotenv = require('dotenv');
dotenv.load();
app.use(bodyParser.json());

app.configure(function () {
  app.set('port', process.env.PORT || 3000);
});

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

app.get('/', function (req, res) {
  res.render('index');
});

//Get allowed origins env variable. format shold be (allowedOrigins = "mydomain.com:* http://localhost:* http://127.0.0.1:*";)
var allowedOrigins = process.env.ORIGINS || 'https://uapchatbootmaster.herokuapp.com*';

//Start Socket.IO area
let io = require('socket.io')(http, { origins: allowedOrigins });
var userlist = [];
io.on('connection', function (socket) {
  if (socket.handshake.query.id) {
    //If user exixtes in array then update new socketid otherwise push him into array
    var index = userlist.findIndex(x => x.id === socket.handshake.query.id);
    if (index >= 0) {
      userlist[index].socketid = socket.id;
    }
    else {
      var user = { id: socket.handshake.query.id, socketid: socket.id };
      userlist.push(user);
    }
  }

  console.log("client connected")

  //pull the list of online users
  socket.on('pulllist', function () {
    io.sockets.emit('getlist', userlist);
  });

  //send message to particular user
  socket.on('sendmessage', function (data) {
    var index = userlist.findIndex(x => x.id === data.receiver);
    if (index >= 0) {
      io.sockets.connected[userlist[index].socketid].emit('message', data);
    }
  });

  //Will be fired when user logouts from screen or close the browser
  socket.on('disconnect', function () {
    // remove disconnected user from online users array
    var index = userlist.findIndex(x => x.socketid === socket.id);
    if (index >= 0) {
      var id = userlist[index].id;
      userlist.splice(index, 1);

      io.sockets.emit('disconnected', id);
      if (socket.id !== undefined) {
        //notify all users that this user is disconnect now
        socket.leave(socket.id);
      }
    }
  });
});

//End Socket.IO area


http.listen(app.get('port'), () => {
  console.log('started on port ' + app.get('port'));
});
