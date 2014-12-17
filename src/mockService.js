define('mockService', ['pact', 'interaction'],
    function(Pact, Interaction) {
        var _host = "http://127.0.0.1";
        var _port = "";

        function MockService(consumerName, providerName, port, pactDir) {
            _port = port;
            this.pact = new Pact();
            this.pact.consumer.name = consumerName;
            this.pact.provider.name = providerName;
            if (pactDir) {
                this.pact.pact_dir = pactDir;
            }
            for (var prop in this) {
                MockService.prototype[prop] = this[prop];
            }
        }
        MockService.prototype.given = function(providerState){
            var interaction = new Interaction();
            interaction.given(providerState);
            this.pact.interactions.push(interaction);
            return interaction;
        }

        MockService.prototype.uponReceiving = function(description){
            var interaction = new Interaction();
            interaction.uponReceiving(description);
            this.pact.interactions.push(interaction);
            return interaction;
        }

        MockService.prototype.clean = function() {
            var xhr = new XMLHttpRequest();
            xhr.open("DELETE", _host + ":" + _port + "/interactions", false);
            xhr.setRequestHeader("X-Pact-Mock-Service", true);
            xhr.send();
            if(200 != xhr.status){
                throw "pact-js-dsl: Pact cleanup failed. "+ xhr.responseText;
            }
        };

        MockService.prototype.setup = function() {
            var xhr;
            var interactions = this.pact.interactions;
            this.pact.interactions = []; //Clean the local setup
            for (var i = 0; i < interactions.length; i++) {
                xhr = new XMLHttpRequest();
                xhr.open("POST", _host + ":" + _port + "/interactions", false);
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
            xhr.open("GET", _host + ":" + _port + "/interactions/verification", false);
            xhr.setRequestHeader("X-Pact-Mock-Service", true);
            xhr.send();
            if(200 != xhr.status){
                throw "pact-js-dsl: Pact verification failed. "+ xhr.responseText;
            }
        };

        MockService.prototype.write = function() {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", _host + ":" + _port + "/pact", false);
            xhr.setRequestHeader("X-Pact-Mock-Service", true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.send(JSON.stringify(this.pact));
            if(200 != xhr.status){
                throw "pact-js-dsl: Could not write the pact file. "+ xhr.responseText;
            }
        };

        MockService.prototype.run = function(testFn) {
            var self = this;
            self.clean();   // Cleanup the server
            self.setup();   // Post the interactions

            var complete = function() {
                self.verify();  //Verify with the server
            };

            testFn(complete);       // Call the tests
        };

        return MockService;
    });
