var ClientForward =  function (ip, port, userAgent, referer){
  var self = this;
  self.ip = ip;
  self.port = port;
  self.userAgent = userAgent;
  self.referer = referer;
}


var UrlShortenerViewModel = function() {

  var self = this;

  self.userURL = ko.observable('');
  self.shortURL = ko.observable('shortie');
  self.forwards = ko.observableArray([]);

  self.submitURL = function(){
    console.log('Submitting..' + self.submitURL());
  };
  
  self.forwards.push(new ClientForward('127.0.0.1', '8080', 'iPhone', 'meeee'));
}

ko.applyBindings(new UrlShortenerViewModel());
