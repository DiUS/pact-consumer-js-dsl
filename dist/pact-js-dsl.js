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

    Interaction.prototype.with = function(path, method, headers, body) {
        this.request.path = path;
        this.request.method = method;
        this.request.headers = headers;
        this.request.body = body;

        return this;
    };

    Interaction.prototype.thenRespondWith = function(status, headers, body) {
        this.response.status = status;
        this.response.headers = headers;
        this.response.body = body;

        return this;
    };

    function UponReceiving(option) {
        var interaction = new Interaction();
        interaction.uponReceiving(option);
        return interaction;
    }

    return UponReceiving;
});

define('pact', [], function () {
	function Pact() {
		this.provider = {};
		this.consumer = {};
		this.interactions = [];
		this.pact_dir=".";
		this.metadata = {
			"pact_gem" : {
			"version" : "1.0.9"
			}
		};
	}
	return Pact;
});
define('pactBuilder', ['pact'],
    function(Pact) {
        var _host = "http://127.0.0.1";
        var _port = "";

        function PactBuilder(consumerName, providerName, port, pactDir) {
            _port = port;
            this.pact = new Pact();
            this.pact.consumer.name = consumerName;
            this.pact.provider.name = providerName;
            if (pactDir) {
                this.pact.pact_dir = pactDir;
            }
            for (var prop in this) {
                PactBuilder.prototype[prop] = this[prop];
            }
        }

        PactBuilder.prototype.withInteractions = function(interactions) {
            for (var index in interactions) {
                this.pact.interactions.push(interactions[index]);
            }
            return this;
        };

        PactBuilder.prototype.clean = function() {
            var xhr = new XMLHttpRequest();
            xhr.open("DELETE", _host + ":" + _port + "/interactions", false);
            xhr.setRequestHeader("X-Pact-Mock-Service", true);
            xhr.send();
        };

        PactBuilder.prototype.setup = function() {
            var xhr;
            for (var i = 0; i < this.pact.interactions.length; i++) {
                xhr = new XMLHttpRequest();
                xhr.open("POST", _host + ":" + _port + "/interactions", false);
                xhr.setRequestHeader("X-Pact-Mock-Service", true);
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.send(JSON.stringify(this.pact.interactions[i]));
            }
        };

        PactBuilder.prototype.verify = function() {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", _host + ":" + _port + "/interactions/verification", false);
            xhr.setRequestHeader("X-Pact-Mock-Service", true);
            xhr.send();
        };

        PactBuilder.prototype.write = function() {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", _host + ":" + _port + "/pact", false);
            xhr.setRequestHeader("X-Pact-Mock-Service", true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.send(JSON.stringify(this.pact));
        };

        PactBuilder.prototype.runInteractions = function(test) {
            var self = this;

            self.clean();   // Cleanup the server 
            self.setup();   // Post the interactions

            var latch = false;
            var completed = function() {
                latch = true;
            };

            //The real interaction
            runs(function() {
                test(completed);
            });
            waitsFor(function() {
                return latch;
            });

            self.verify();  // Verify
            self.write();   // Write pact file
        };
        return PactBuilder;
    });
