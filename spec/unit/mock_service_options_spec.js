'use strict';

describe('mockService', function() {
    var mockService;

    describe('client configuration', function() {
        beforeEach(function() {
            spyOn(Pact.MockServiceRequests, 'putInteractions')
                .and.callFake(function(interactions, baseUrl, callback) {});
        });

        describe('when provided a host option', function() {
            beforeEach(function() {
                mockService = Pact.mockService({
                    consumer: 'Consumer',
                    provider: 'Provider',
                    port: 1234,
                    done: function() {},
                    host: '1.2.3.4'
                });
            });

            it('should use the host option in pact mock service API request', function() {
                mockService.setup(function() {});
                expect(Pact.MockServiceRequests.putInteractions)
                    .toHaveBeenCalledWith(jasmine.anything(), 'http://1.2.3.4:1234', jasmine.anything());
            });
        });

        describe('when no host option is provided', function() {
            beforeEach(function() {
                mockService = Pact.mockService({
                    consumer: 'Consumer',
                    provider: 'Provider',
                    port: 1234,
                    done: function() {}
                });
            });

            it('should use the default host in pact mock service API request', function() {
                mockService.setup(function() {});

                expect(Pact.MockServiceRequests.putInteractions)
                    .toHaveBeenCalledWith(jasmine.anything(), 'http://127.0.0.1:1234', jasmine.anything());
            });
        });

        describe('when no port is provided', function() {
            it('should throw an error', function() {
                var options = {
                    consumer: 'Consumer',
                    provider: 'Provider',
                    done: function(){},
                    host: '1.2.3.4'
                };

                var createMockService = function() {
                    Pact.mockService(options)
                };

                expect(createMockService).toThrow();
            });
        });

        describe('when a port is provided', function() {
            it('should not throw an error', function() {
                var options = {
                    consumer: 'Consumer',
                    provider: 'Provider',
                    done: function(){},
                    port: 1234,
                    host: '1.2.3.4'
                };

                var createMockService = function() {
                    Pact.mockService(options)
                };

                expect(createMockService).not.toThrow();
            });
        });
    });
});