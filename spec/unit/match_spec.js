'use strict';

describe('Match', function () {
    describe('term', function () {
        describe('when provided a term', function () {
            it('should return a serialized Ruby object', function () {
                var expected = {
                    "json_class": "Pact::Term",
                    "data": {
                        "generate": "myawesomeword",
                        "matcher": {
                            "json_class": "Regexp",
                            "o": 0,
                            "s": "\\w+"
                        }
                    }
                };

                var term = Pact.Match.term({
                    generate: "myawesomeword",
                    matcher: "\\w+"
                });

                expect(term).toEqual(expected);
            });
        });

        describe("when not provided with a valid term", function () {
            var createTheTerm = function (badArg) {
                return function () {
                    Pact.Match.term(badArg);
                }
            };

            describe("when no term is provided", function () {
                it("should throw an Error", function () {
                    expect(createTheTerm()).toThrow();
                });
            });

            describe("when an invalid term is provided", function () {
                it("should throw an Error", function () {
                    expect(createTheTerm({})).toThrow();
                    expect(createTheTerm("")).toThrow();
                    expect(createTheTerm({generate: "foo"})).toThrow();
                    expect(createTheTerm({matcher: "\\w+"})).toThrow();
                });
            });
        });
    });

    describe('somethingLike', function () {
        describe('when provided a value', function () {
            it('should return a serialized Ruby object', function () {
                var expected = {
                    "json_class": "Pact::SomethingLike",
                    "contents": "myspecialvalue"
                };

                var match = Pact.Match.somethingLike("myspecialvalue");
                expect(match).toEqual(expected);
            });
        });

        describe("when not provided with a valid value", function () {
            var createTheValue = function (badArg) {
                return function () {
                    Pact.Match.somethingLike(badArg);
                }
            };

            describe("when no value is provided", function () {
                it("should throw an Error", function () {
                    expect(createTheValue()).toThrow();
                });
            });

            describe("when an invalid value is provided", function () {
                it("should throw an Error", function () {
                    expect(createTheValue(undefined)).toThrow();
                    expect(createTheValue(function(){})).toThrow();
                });
            });
        });
    });
});