
/**
 * Module dependencies.
 */

var express = require('express') 
  , http = require('http')
  , path = require('socket.io');
   var io = require('socket.io')(require('http').Server(app));

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:60455");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//io.set('transports', [ 'websocket' ]);
//io.set('origins', '*:*');
//io.set('origins', 'http://uatwagonex.herokuapp.com:*');
 var userlist = [];

    io.on('connection', function (socket) {
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
               io.sockets.connected[userlist[i].socketid].emit('message', {  message: data.message, sender: data.sender, receiver: data.receiver});
             break;
            }
         }      
     });

      socket.on('disconnect', function() {
        //var index=userlist.findIndex(x => x.socketid == socket.id);
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

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});