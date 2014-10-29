define('interaction', [], function() {

    function Interaction() {
        this.provider_state = "";
        this.description = "";
        this.request = {};
        this.response = {};
        for (var prop in this) {
            Interaction.prototype[prop] = this[prop];
        }
    }

    Interaction.prototype.given = function(providerState) {
        this.provider_state = providerState;
        return this;
    };

    Interaction.prototype.uponReceiving = function(description) {
        this.description = description;
        return this;
    };

    Interaction.prototype.withRequest = function(firstParameter, path, headers, body) {
        if (typeof(firstParameter) == "object") {
            this.request.method = firstParameter.method;
            this.request.path = firstParameter.path;
            this.request.headers = firstParameter.headers;
            this.request.body = firstParameter.body;
        }
        else {
            this.request.method = firstParameter;
            this.request.path = path;
            this.request.headers = headers;
            this.request.body = body;
        }
        if (!this.request.method || !this.request.path) {
            throw "pact-js-dsl's 'withRequest' function requires 'method' and 'path' parameters";
        }

        return this;
    };

    Interaction.prototype.willRespondWith = function(firstParameter, headers, body) {
        if (typeof(firstParameter) == "object") {
            this.response.status = firstParameter.status;
            this.response.headers = firstParameter.headers;
            this.response.body = firstParameter.body;
        }
        else {
            this.response.status = firstParameter;
            this.response.headers = headers;
            this.response.body = body;
        }
        if (!this.response.status) {
            throw "pact-js-dsl's 'willRespondWith' function requires 'status' parameter";
        }

        return this;
    };

    return Interaction;
});
