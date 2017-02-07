This app enables real-time bidirectional event-based communication. It consists in:

* a [Node.js] server(http://nodejs.org)
* [Socket.IO](http://socket.io/)

## How to use

A standalone build of `socket.io-client` is exposed automatically by the
socket.io server as `/socket.io/socket.io.js`. Alternatively you can
serve the file `socket.io.js` or `socket.io.min.js` found in the `dist` folder.

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
  

Disclaimer
----------

This *IS NOT* intended to be a catalogue of best practices. This is just
a very simple sample plenty of room for improvement. 
