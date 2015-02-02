(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(<%= amd %>, factory);
    } else if (typeof exports === 'object') {
        global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
        module.exports = factory(<%= cjs %>);
    } else {
        root.<%= namespace %> = factory(<%= global %>);
    }
}(this, function(<%= param %>) {

<%= contents %>
return <%= exports %>;

}));