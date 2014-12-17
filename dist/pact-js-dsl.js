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
            this.request.query = firstParameter.query;
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

define('mockService', ['pactDetails', 'interaction'],
    function(PactDetails, Interaction) {
        var _baseURL = "";

        function MockService(consumerName, providerName, port, pactDir) {
            _baseURL = "http://127.0.0.1:" + port;
            this.interactions = [];
            this.pactDetails = new PactDetails();
            this.pactDetails.consumer.name = consumerName;
            this.pactDetails.provider.name = providerName;
            if (pactDir) {
                this.pactDetails.pact_dir = pactDir;
            }
            for (var prop in this) {
                MockService.prototype[prop] = this[prop];
            }
        }
        MockService.prototype.given = function(providerState){
            var interaction = new Interaction();
            interaction.given(providerState);
            this.interactions.push(interaction);
            return interaction;
        }

        MockService.prototype.uponReceiving = function(description){
            var interaction = new Interaction();
            interaction.uponReceiving(description);
            this.interactions.push(interaction);
            return interaction;
        }

        MockService.prototype.clean = function() {
            var xhr = new XMLHttpRequest();
            xhr.open("DELETE", _baseURL + "/interactions", false);
            xhr.setRequestHeader("X-Pact-Mock-Service", true);
            xhr.send();
            if(200 != xhr.status){
                throw "pact-js-dsl: Pact cleanup failed. "+ xhr.responseText;
            }
        };

        MockService.prototype.setup = function() {
            var xhr;
            var interactions = this.interactions;
            this.interactions = []; //Clean the local setup
            for (var i = 0; i < interactions.length; i++) {
                xhr = new XMLHttpRequest();
                xhr.open("POST", _baseURL + "/interactions", false);
                xhr.setRequestHeader("X-Pact-Mock-Service", true);
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.send(JSON.stringify(interactions[i]));
                if(200 != xhr.status){
                    throw "pact-js-dsl: Pact interaction setup failed. "+ xhr.responseText;
                }
            }
        };

        MockService.prototype.verify = function() {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", _baseURL + "/interactions/verification", false);
            xhr.setRequestHeader("X-Pact-Mock-Service", true);
            xhr.send();
            if(200 != xhr.status){
                throw "pact-js-dsl: Pact verification failed. "+ xhr.responseText;
            }
        };

        MockService.prototype.write = function() {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", _baseURL + "/pact", false);
            xhr.setRequestHeader("X-Pact-Mock-Service", true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.send(JSON.stringify(this.pactDetails));
            if(200 != xhr.status){
                throw "pact-js-dsl: Could not write the pact file. "+ xhr.responseText;
            }
        };

        MockService.prototype.run = function(testFn) {
            var self = this;
            self.clean();       // Cleanup the interactions from the previous test
            self.setup();       // Post the new interactions

            var complete = function() {
                self.verify();  //Verify that the expected interactions have occurred
            };

            testFn(complete);   // Call the tests
        };

        return MockService;
    });

define('pactDetails', [], function () {
	function PactDetails() {
		this.provider = {};
		this.consumer = {};
		this.pact_dir=".";
	}
	return PactDetails;
});