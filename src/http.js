Pact.Http = Pact.Http || {};

(function() {
  var makeRequestForNode = function(method, url, body, callback) {
    var http = require('http');
    var parse = require('url').parse;

    var parsedUrl = parse(url);
    var requestOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      method: method,
      path: parsedUrl.path,
      headers: {
        'X-Pact-Mock-Service': 'true',
        'Content-Type': 'application/json'
      }
    };

    var request = http.request(requestOptions, function (response) {
      var responseText = '';

      response.on('data', function (chunk) {
        responseText += chunk.toString();
      });

      response.on('error', function (err) {
        callback(new Error('Error calling ' + url + ' - ' + err.message));
      });

      response.on('end', function () {
        callback(null, {responseText: responseText, status: response.statusCode});
      });
    });

    request.on('error', function (err) {
      callback(new Error('Error calling ' + url + ' - ' + err.message));
    });

    request.end(body || '');
  };

  var makeRequestForBrowser = function(method, url, body, callback) {
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

  this.makeRequest = (Pact.IsNodeJs) ? makeRequestForNode : makeRequestForBrowser;

}).apply(Pact.Http);