var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    WebSocketServer = require('websocket').server;

var store = {};
var counter = 0;

//normal http server used to forward users from short to original
var server = http.createServer(function (req, res) {
  var reqUrl = url.parse(req.url, true);
  var urlId = reqUrl.pathname.replace('/', '');

  //does the short url exist
  if (store[urlId]){
    var urlToFollow = store[urlId].url;

    //gather info from request object 
    var rec = {
          ip : req.connection.remoteAddress,
          agent : req.headers['user-agent'],
          referer : req.headers.referer
        }; 
    
    //return forward
    res.statusCode = 302;
    res.setHeader('Location', 'http://' + urlToFollow );
    res.end('Find it here: ' + urlToFollow);
    
    //send tracking information throgh the web socket
    store[urlId].socket.sendUTF(JSON.stringify(rec));
  }else{
    res.statusCode = 404;
    res.end();
  }

}).listen(8080);

//http server to be user for listening for websocket requests
var httpWsServer = http.createServer(function(req,res) {
    res.writeHead(404);
    res.end();
});

httpWsServer.listen(8090);

var wsServer = new WebSocketServer({
    httpServer: httpWsServer,
    autoAcceptConnections: false
});

//when request to establish websocket
wsServer.on('request', function(request) {

  var connection = request.accept('live-hits-protocol', request.origin);
  console.log((new Date()) + ' Connection accepted.');
  
  //message arrives
  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      var submit = JSON.parse(message.utf8Data);
      var shortUrl = counter++;
      
      //store the URL and websocket associated with it
      store[shortUrl] = {url:submit.url, socket : connection};
      //send back short URL to the browser
      connection.sendUTF(JSON.stringify({url:shortUrl}));
    }
  });
  connection.on('close', function(reasonCode, description) {
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
  });
});
