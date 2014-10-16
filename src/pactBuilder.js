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
            var self = this,
                interactions = self.pact.interactions;

            $.ajax({
                url: "http://localhost:29999/create?state=" + interactions[0].provider_state,
                type: "POST",
                data: JSON.stringify(this.pact),
                dataType: "json",
                async: false
            }).done(function (data) {
                    self.port = data.port;
                }).fail(function (error) {
                    self.port = error;
                });

            return self.port;
        };

        PactBuilder.prototype.verify = function (statePort) {
            var response;
            $.ajax({
                url: "http://localhost:29999/complete",
                type: "POST",
                data: JSON.stringify({"port": statePort}),
                dataType: "json",
                async: false
            }).done(function (data) {
                    response = data;
                });

            return response;
        };

        PactBuilder.prototype.runAndWait = function (f) {
            var latch = false;
            runs(function () {
                f();
                latch = true;
            });
            waitsFor(function () {
                return latch;
            });
        };

        PactBuilder.prototype.runInteractions = function (setup, test) {

            var self = this;
            var port;
            self.runAndWait(function () {
                port = self.setup();
            });

            runs(function () {
                setup(port);
            });

            var latch = false;
            var completed = function () {
                latch = true;
            };
            runs(function () {
                test(completed);
            });
            waitsFor(function () {
                return latch;
            });

            self.runAndWait(function () {
                self.verify(port);
            });
        };

        return PactBuilder;
    });
