Pact.Http = Pact.Http || {};

(function() {
	var XMLHttpRequest = typeof exports === 'object'? require('xhr2') : window.XMLHttpRequest;

    this.makeRequest = function(method, url, body, callback) {
      var xhr = new XMLHttpRequest();
      xhr.onload = function(event) {
          callback(null, event.target);
      };
      xhr.onerror = function() {
          callback(new Error('Error calling ' + url));
      };
      xhr.open(method, url, true);
      xhr.setRequestHeader('X-Pact-Mock-Service', 'true');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(body);
  };

}).apply(Pact.Http);
