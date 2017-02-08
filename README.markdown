This app enables real-time bidirectional event-based communication. It consists in:

* [Node.js](http://nodejs.org)
* [Socket.IO](http://socket.io/)

## Allow access domain

By adding config variables you can allow few domains to access the socket.
You can add domains in config variable just like following:

`KEY`=`ORIGINS` and  `VALUE`=`mydomain.com:* http://localhost:3000*`


## How to use

A standalone build of `socket.io-client` is exposed automatically by the
socket.io server as `/socket.io/socket.io.js`. Alternatively you can
serve the file `socket.io.js` or `socket.io.min.js`.

```html
<script src="/socket.io/socket.io.js"></script>
<script>
  var socket = io('domain',{ query: "parameters" });
  socket.on('message', function(){});
  socket.on('event', function(data){});
  socket.on('disconnect', function(){});
</script>
```

### Node.JS (server-side usage)

  Add `socket.io-client` to your `package.json` and then:

  ```js
  var socket = require('socket.io-client')('http://localhost');
  socket.on('connect', function(){});
  socket.on('event', function(data){});
  socket.on('disconnect', function(){});
  


