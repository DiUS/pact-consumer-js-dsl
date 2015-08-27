//'use strict';

var specHelper = specHelper || {};

(function() {
    var XMLHttpRequest = typeof exports === 'object'? require('xhr2') : window.XMLHttpRequest;

    var BASE_URL = 'http://localhost:1234';

    this.makeRequest = function (options, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function(event) {
            callback(null, event.target);
        };
        xhr.onerror = function() {
            callback(new Error('Error calling ' + options.path));
        };
        xhr.open(options.method, BASE_URL + options.path, true);

        if (options.headers) {
            Object.keys(options.headers).forEach(function (header) {
                xhr.setRequestHeader(header, options.headers[header]);
            });
        }

        xhr.send(options.body);
    };

}).apply(specHelper);

if (typeof exports === 'object') {
    module.exports = specHelper;
}