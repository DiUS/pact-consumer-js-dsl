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

    Interaction.prototype.withRequest = function(method, path, headers, body) {
        this.request.path = path;
        this.request.method = method;
        this.request.headers = headers;
        this.request.body = body;

        return this;
    };

    Interaction.prototype.willRespondWith = function(status, headers, body) {
        this.response.status = status;
        this.response.headers = headers;
        this.response.body = body;

        return this;
    };

    return Interaction;
});
