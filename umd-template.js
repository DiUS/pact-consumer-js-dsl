'use strict';

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(<%= amd %>, factory);
    } else if (typeof exports === 'object') {
        global.XMLHttpRequest = require('xhr2');
        module.exports = factory(<%= cjs %>);
    } else {
        root.<%= namespace %> = factory(<%= global %>);
    }
}(this, function(<%= param %>) {

<%= contents %>
return <%= exports %>;

}));