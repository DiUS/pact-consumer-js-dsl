define('pactBuilder', ['jquery', 'pact'],
    function ($, Pact) {

        function PactBuilder(consumerName, providerName) {
            this.pact = new Pact();
            this.pact.consumer.name = consumerName;
            this.pact.provider.name = providerName;
            for (var prop in this) {
                PactBuilder.prototype[prop] = this[prop];
            }
        }

        PactBuilder.prototype.withInteractions = function (interactions) {
            for (var index in interactions) {
                this.pact.interactions.push(interactions[index]);
            }

            return this;
        };

        PactBuilder.prototype.setup = function () {
            console.log("In setup");
            debugger;
            var self = this,
                interactions = self.pact.interactions;
            $.ajax({
                url: "http://127.0.0.1:1234/interactions",
                type: "DELETE",
                beforeSend: function (request)
                {
                    request.setRequestHeader("X-Pact-Mock-Service", true);
                },
                async: false,
                success: function (data) {console.log("success delete: "+data);  },
                error: function (jqXHR, textStatus, errorThrown) { console.log("error sending delete: "+errorThrown);}
            }).always(function (data) {
                console.dir(data);
            });
            console.log("Sent DELETE request :::");

//
//            var testInteraction = {
//                "description": "a request for foo",
//                "provider_state": "foo exists",
//                "request": {
//                    "method": "get",
//                    "path": "/foo"
//                },
//                "response": {
//                    "status": 200,
//                    "headers": {
//                        "Content-Type": "application/json"
//                    },
//                    "body": {
//                        "foo": "bar"
//                    }
//                }
//            };

            //We need to send mu;tiple requests for each interaction
            for (var i=0; i < this.pact.interactions.length; i++) {
                $.ajax({
                    url: "http://127.0.0.1:1234/interactions",
                    type: "POST",
                    beforeSend: function (request)
                    {
                        request.setRequestHeader("X-Pact-Mock-Service", true);
                    },
                    contentType: "application/json",
                    data: JSON.stringify(this.pact.interactions[i]),
                    dataType: "json",
                    async: false,
                    success: function (data) { console.log("success post: "+data); },
                    error: function (jqXHR, textStatus, errorThrown) {
                        debugger;
                        console.log("error sending post errorThrown : "+errorThrown);
                        console.log("error sending post responseText : "+jqXHR.responseText);
                        console.log("error sending post jqXHR.status : "+jqXHR.status);
                    }
                }).always(function (data) {
                    console.dir(data);
                });
                console.log("Sent POST request with ::: "+JSON.stringify(this.pact.interactions[i]));
            }

            return 1234;
        };

        PactBuilder.prototype.verify = function (statePort) {
            console.log("In verify :::: "+ statePort);
            var response;
            $.ajax({
                //url: "http://localhost:1234/complete",
                url: "http://127.0.0.1:1234/interactions/verification",
                type: "GET",
                beforeSend: function (request)
                {
                    request.setRequestHeader("X-Pact-Mock-Service", true);
                },
                //data: JSON.stringify({"port": statePort}),
               // dataType: "json",
                async: false,
                success: function (data) { console.log("success verification: "+data); },
                error: function (jqXHR, textStatus, errorThrown) {
                    debugger;
                    console.log("error verification errorThrown : "+errorThrown);
                    console.log("error verification responseText : "+jqXHR.responseText);
                    console.log("error verification jqXHR.status : "+jqXHR.status);
                }
            }).done(function (data) {
                console.log(data);
                response = data;
            });

            return response;
        };

//        PactBuilder.prototype.runAndWait = function (f) {
//            var latch = false;
//            runs(function () {
//                f();
//                latch = true;
//            });
//            waitsFor(function () {
//                return latch;
//            });
//        };

        PactBuilder.prototype.runPact = function (clientSetup, test) {

            var self = this;
            var port;

            port = self.setup();

//            self.runAndWait(function () {
//                port = self.setup();
//            });

            runs(function () {
                clientSetup(port);
            });

 //           var latch = false;
            var completed = function () {
 //               latch = true;
            };
            runs(function () {
                test(completed);
            });
//            waitsFor(function () {
//                return latch;
//            });

            self.verify(port);
//            self.runAndWait(function () {
//                self.verify(port);
//            });
        };

        return PactBuilder;
    });
