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

app.use(function (req, res, next) {
  // res.jsonFail = function(error) {
  //     return res.json({
  //         success: false,
  //         message:error.message,
  //         result: ''
  //     })
  // };
  res.jsonResult = function (error, data) {
    return res.json({
      success: error ? false : true,
      message: error ? error.message : 'sucess',
      result: error ? '' : data
    });
  };

  next();
});


//  app.use('/api/wines',require('./routes/api'))
//  app.use('/api/users',require('./routes/users'))


// If no route is matched by now, it must be a 404
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


let io = require('socket.io')(http);
var usernames = {};
var rooms = [];
var userlist = [];
io.sockets.on('connection', function (socket) {
  
 console.log('connect');
   socket.emit('welcome', { message: 'Welcome!', id: socket.id });

  socket.on('disconnect', function () {
    console.log('disconnect');
    // require('./models/user').updateIsOnline(socket.username, false);
    
  });
});



http.listen(app.get('port'), () => {
  console.log('started on port ' + app.get('port'));
});
