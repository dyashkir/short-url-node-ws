var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    WebSocketServer = require('websocket').server;

var store = {};
var counter = 0;

var server = http.createServer(function (req, res) {
  var reqUrl = url.parse(req.url, true);
  var urlId = reqUrl.pathname.replace('/', '');
  
  if (store[urlId]){
    var urlToFollow = store[urlId].url; 
    var rec = {
          ip : req.connection.remoteAddress,
          agent : req.headers['user-agent'],
          referer : req.headers.referer
        }; 
    
    res.statusCode = 302;
    res.setHeader('Location', 'http://' + urlToFollow );
    res.end('Find it here: ' + urlToFollow);
    
    store[urlId].socket.sendUTF(JSON.stringify(rec));
  }else{
    res.statusCode = 404;
    res.end();
  }

}).listen(8080);


var httpWsServer = http.createServer(function(req, res) {
    res.writeHead(404);
    res.end();
});

httpWsServer.listen(8090);

var wsServer = new WebSocketServer({
    httpServer: httpWsServer,
    autoAcceptConnections: false
});

wsServer.on('request', function(request) {
    
  var connection = request.accept('live-hits-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
          var submit = JSON.parse(message.utf8Data);
          var shortUrl = counter++;

          store[shortUrl] = {url:submit.url, socket : connection};
          connection.sendUTF(JSON.stringify({url:shortUrl}));
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});
