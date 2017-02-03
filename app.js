'use strict';

let app = require('express')();
let http = require('http').Server(app);

var bodyParser = require('body-parser');


app.use(bodyParser.json());

app.all('/*', function (req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  
});

// If no route is matched by now, it must be a 404
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


let io = require('socket.io')(http);

var userlist = [];

    io.on('connection', function (socket) {

    socket.emit('welcome', { message: 'Welcome!', id: socket.id });

    console.log("client connected 1")
    if (socket.handshake.query.id) {
      var found=false;
      for(var i = 0; i < userlist.length; i++) {
          if (userlist[i].socketid == socket.id) {
              found = true;
              break;
          } 
        }
        if(!found){
           console.log(socket.handshake.query.id);
           var user={id: socket.handshake.query.id,socketid: socket.id};
           userlist.push(user);
        }       
     }
 
    console.log("client connected")
     socket.on('pulllist', function () {
        console.log('test');
              
        io.sockets.emit('getlist', userlist);
      });

      socket.on('sendmessage', function ( data) {
       for(var i = 0; i < userlist.length; i++) {
            if(userlist[i].socketid === data.receiver) {
               console.log('message sent to' + userlist[i].socketid)
               io.sockets.connected[userlist[i].socketid].emit('message', data);
             break;
            }
         }      
     });

      socket.on('disconnect', function() {
         var id = '';
         for(var i = 0; i < userlist.length; i += 1) {
            if(userlist[i].socketid === socket.id) {
              id = userlist[i].id;
              userlist.splice(i, 1);
            }
         }
           io.sockets.emit('disconnected', id);
           if (socket.id !== undefined) {      
              socket.leave(socket.id);
           }
      });
});



http.listen(app.get('port'), () => {
  console.log('started on port ' + app.get('port'));
});
