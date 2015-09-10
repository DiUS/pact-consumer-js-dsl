'use strict';

describe('Match integration test', function() {

    var doneCallback;
    var mockService;
    var somethingLike = Pact.Match.somethingLike;
    var term = Pact.Match.term;
    var eachLike = Pact.Match.eachLike;

    beforeEach(function() {
        doneCallback = jasmine.createSpy('doneCallback').and.callFake(function (error) {
            expect(error).toBe(null);
        });

        mockService = Pact.mockService({
            consumer: 'Consumer',
            provider: 'Provider',
            port: 1234,
            done: doneCallback
        });
    });

    describe('object with multiple Pact.Matchers', function () {
        it('should respond with correct object', function(done) {

            var doHttpCall = function(callback) {
                specHelper.makeRequest({
                    method: 'POST',
                    path: '/thing',
                    headers: {
                        'Content-Type': 'text/plain'
                    },
                    body: 'body'
                }, callback);
            };

            mockService
                .uponReceiving('a request with Pact.Match eachLike, somethingLike and term')
                .withRequest({
                    method: 'POST',
                    path: '/thing',
                    headers: {
                        'Content-Type': 'text/plain'
                    },
                    body: 'body'
                })
                .willRespondWith({
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: {
                        "items":eachLike({
                            size: somethingLike(10),
                            colour: term({generate: "red", matcher: "red|green|blue"}),
                            tag: eachLike(
                                somethingLike("jumper")
                            , {min: 1})
                        }, {min: 2})
                    }
                });

            mockService.run(done, function(runComplete) {
                doHttpCall(function (error, response) {
                    expect(error).toBe(null, 'error');
                    expect(JSON.parse(response.responseText)).toEqual(
                        {
                            items: [
                                { size: 10, colour: 'red', tag: [ 'jumper' ] },
                                { size: 10, colour: 'red', tag: [ 'jumper' ] }
                            ]
                        }
                    );
                    expect(response.status).toEqual(200, 'status');
                    expect(response.getResponseHeader('Content-Type')).toEqual('application/json', 'Content-Type header');
                    runComplete();
                });
            });
        });

    });
});