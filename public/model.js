var ClientForward =  function (count,ip, port, userAgent, referer){
  var self = this;
  self.ip = ip;
  self.port = port;
  self.userAgent = userAgent;
  self.referer = referer;
  self.count = count;
  console.log('created');
}


var UrlShortenerViewModel = function() {

  var self = this;
  var count = 0;

  self.userURL = ko.observable('');
  self.shortURL = ko.observable('shortie');
  self.forwards = ko.observableArray([]);

  self.submitURL = function(){
    console.log('Submitting..' + self.submitURL());
  };

  self.dummy = function(){
    self.socket.send('woooo');
    //self.forwards.unshift(new ClientForward(count++,'127.0.0.1', '8080', 'iPhone', 'meeee'));
  };
  
  
  self.socket = new WebSocket('ws://127.0.0.1:8090/', 'live-hits-protocol');

  self.socket.onopen = function(event) {
    console.log('opned');
    self.socket.send('woooo');
  }
  self.socket.onmessage = function(event) {
    console.log(event.data);
    self.forwards.unshift(new ClientForward(count++, event.data, '', '',''));
  }
  
}

ko.applyBindings(new UrlShortenerViewModel());
