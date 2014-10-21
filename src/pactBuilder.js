define('pactBuilder', ['jquery', 'pact'],
    function($, Pact) {
        var PORT= 1234;
        function PactBuilder(consumerName, providerName) {
            this.pact = new Pact();
            this.pact.consumer.name = consumerName;
            this.pact.provider.name = providerName;
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

        PactBuilder.prototype.clean = function(){
            console.log("In clean");
             $.ajax({
                url: "http://127.0.0.1:"+PORT+"/interactions",
                type: "DELETE",
                beforeSend: function(request) {
                    request.setRequestHeader("X-Pact-Mock-Service", true);
                },
                async: false
            }); 
        };

        PactBuilder.prototype.setup = function() {
            console.log("In setup");
            var self = this,
                interactions = self.pact.interactions;

            //We need to send multiple requests for each interaction
            for (var i = 0; i < this.pact.interactions.length; i++) {
                $.ajax({
                    url: "http://127.0.0.1:"+PORT+"/interactions",
                    type: "POST",
                    beforeSend: function(request) {
                        request.setRequestHeader("X-Pact-Mock-Service", true);
                    },
                    contentType: "application/json",
                    data: JSON.stringify(this.pact.interactions[i]),
                    dataType: "json",
                    async: false
                });
                
            }
            return PORT;
        };

        PactBuilder.prototype.verify = function(statePort) { 
            var response;
            $.ajax({
                url: "http://127.0.0.1:"+PORT+"/interactions/verification",
                type: "GET",
                beforeSend: function(request) {
                    request.setRequestHeader("X-Pact-Mock-Service", true);
                },
                async: false
            }).done(function(data) {
                response = data;
            }); 
            return response;
        };

        PactBuilder.prototype.runAndWait = function(f) {
            var latch = false;
            runs(function() {
                f();
                latch = true;
            });
            waitsFor(function() {
                return latch;
            });
        };



        PactBuilder.prototype.runInteractions = function(test) {
            var self = this;
            var port;

            //Cleanup the server 
            self.runAndWait(function() {
                self.clean();
            });

            //Post the interactions
            self.runAndWait(function() {
                port = self.setup();
            });
            

            var latch = false;
            //The real interaction
            var completed = function() {
                latch = true;
            };

            runs(function() {
                test(port, completed);
            });

            waitsFor(function() {
                return latch;
            });

            self.runAndWait(function() {
                self.verify(port);
            });
        };

        return PactBuilder;

    });
