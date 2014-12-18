var pact = pact || {};

(function() {

  var localBaseUrl;

  this.createClient = function(baseUrl) {
    localBaseUrl = baseUrl;
    return this;
  };

  this.sayHello = function() {
    //Makes a synchronous request
    var xhr = new XMLHttpRequest();
    xhr.open('GET', localBaseUrl + '/sayHello', false);
    xhr.send();

    return JSON.parse(xhr.responseText).reply;
  };

  this.findFriendsByAgeAndChildren = function(age, children) {
    //dirty hack - assume two children, because iterating
    //over an array in native Javascript is like stabbing yourself in the eyballs
    var url = localBaseUrl + '/friends?age=' + age + '&children=' + children[0] + '&children=' + children[1];
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.send();

    return JSON.parse(xhr.responseText).friends;
  };

  this.unfriendMe = function(callback) {
    //Makes an asynchronous request
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        callback(JSON.parse(xmlhttp.responseText).reply);
      }
    }

    xmlhttp.open('PUT', localBaseUrl + '/unfriendMe', true);
    xmlhttp.send();
  };

}).apply(pact);
