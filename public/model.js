var ClientForward =  function (ip, userAgent, referer){
  var self = this;
  self.ip = ip;
  self.userAgent = userAgent;
  self.referer = referer;
}


var UrlShortenerViewModel = function() {

  var self = this;

  self.userURL = ko.observable('');
  self.shortURL = ko.observable('');
  self.forwards = ko.observableArray([]);
  self.tweetURL = ko.computed(function(){
    return 'http://twitter.com/home?status=' + encodeURIComponent(self.shortURL() + ' #devto'); 
  });
  self.submitURL = function(){
    self.socket.send(JSON.stringify({url:self.userURL()}));
  };

  self.socket = new WebSocket('ws://127.0.0.1:8090/', 'live-hits-protocol');

  self.socket.onopen = function(event) {
    console.log('opned');
  }
  self.socket.onmessage = function(event) {
    var msg = JSON.parse(event.data);
    if (msg.url !== undefined) {
      self.shortURL('http://127.0.0.1:8080/' + msg.url);
    }else{
      self.forwards.unshift(new ClientForward(msg.ip, msg.agent, msg.referer));
    }
  }
  
}

ko.applyBindings(new UrlShortenerViewModel());
