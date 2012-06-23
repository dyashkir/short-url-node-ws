var http = require('http'),
 //   io = require('socket.io'),
    url = require('url');

var store = {};
var counter = 0;

var server = http.createServer(function (req, res) {
  console.log('enter server');
  var reqUrl = url.parse(req.url, true);
  if (reqUrl.query && reqUrl.query.url){
    var shortUrl = counter++;
    store[shortUrl] = reqUrl.query.url;
    res.writeHead(200, {'Content-Type':'text/plain'});
    res.end(''+shortUrl);
    console.log('url:' + reqUrl.query.url + '  ' + shortUrl);
  }else{
    var urlToFollow = store[reqUrl.pathname.replace('/', '')]; 
    if(urlToFollow){  
      res.statusCode = 302;
      res.setHeader('Location', 'http://' + urlToFollow );
      res.end('Find it here: ' + urlToFollow);
      sockCon.sendUTF('sombody been here');
    }else{
      res.statusCode = 404;
      res.end();
    }
  }
}).listen(8080,'127.0.0.1');

var WebSocketServer = require('websocket').server;

var dummyServer = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

dummyServer.listen(8090, function() {
    console.log((new Date()) + ' Server is listening on port 8090');
});

wsServer = new WebSocketServer({
    httpServer: dummyServer,
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  return true;
}

var sockCon;

wsServer.on('request', function(request) {
  console.log('request arrived');
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    var connection = request.accept('live-hits-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('open', function(){
      connection.sendUTF('asd');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
    sockCon = connection;
});
