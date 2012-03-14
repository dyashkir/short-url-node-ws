var http = require('http'),
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
    }else{
      res.statusCode = 404;
      res.end();
    }
  }
}).listen(1337,'127.0.0.1');

console.log('server running on 1337');


