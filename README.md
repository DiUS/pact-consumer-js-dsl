# Pact Consumer Javascript DSL

_This DSL is in very early stages of development, please bear with us as we give it some polish. Please raise any problems you have in the github issues. Check out the [Development Roadmap](/ROADMAP.md) to see where we are headed._

This codebase provides a Javascript DSL for creating pacts. If you are new to Pact, please read the Pact [README](pact-readme) first.

This DSL relies on the Ruby [pact-mock_service][pact-mock-service] gem to provide the mock service for the Javascript tests. If you do not want to use Ruby in your project, please read about using a standalone Pact mock service [here][pact-mock-service-without-ruby].

### Getting Help

* Please see the [wiki](https://github.com/DiUS/pact-consumer-js-dsl/wiki) for documentation (eg. using CORS, using the DSL on Windows).
* Google users group: https://groups.google.com/forum/#!forum/pact-support
* Twitter: [@pact_up](https://twitter.com/pact_up)

### Getting Started (with Karma, Jasmine and the pact-mock_service gem)

1. Install the [pact-mock_service](https://github.com/bethesque/pact-mock_service) ruby gem

   The easiest way is to add `gem 'pact-mock_service', '~> 0.2.3.pre.rc1'` to your `Gemfile` and run `bundle install`

1. Install and configure Karma with Jasmine

  1. Create a `package.json` if you don't have one already - use `npm init` if you don't

  1. Install Karma using their [installation instructions](http://karma-runner.github.io/0.12/intro/installation.html)

    This basically consists of running,

    * `npm install karma --save-dev`
    * `npm install karma-jasmine karma-chrome-launcher --save-dev`
    * `npm install -g karma-cli`

  1. Initialise and configure Karma

    Run `karma init`. Answer **jasmine** for *testing framework* and **no** for *use require.js*.

  1. Add `pact-consumer-js-dsl` to your project by running `npm install DiUS/pact-consumer-js-dsl#X.Y.Z --save-dev`, where `X.Y.Z` is the latest stable version, according to the [releases][releases] page.

  1. Tell Karma about `pact-consumer-js-dsl.js` in `karma.conf.js`. In the `files: []` section add a new entry for `node_modules/pact-consumer-js-dsl/dist/pact-consumer-js-dsl.js`.

  1. Allow tests to load resources from `pact` mock server. One way to do this is in the `karma.conf.js`, change `browsers: ['Chrome'],` or `browsers: ['PhantomJS'],` to,

         ````
         browsers: ['Chrome_without_security'],
         customLaunchers: {
            Chrome_without_security: {
                base: 'Chrome',
                flags: ['--disable-web-security']
            }
         }
         
         or:
         
         browsers: ['PhantomJS_without_security'],
         customLaunchers: {
            PhantomJS_without_security: {
              base: 'PhantomJS',
              flags: ['--web-security=false']
            }
         }
         ````         

   Note that running your tests across multiple browsers with one pact mock server will probably conflict with each other. You will need to either run them sequentially or start multiple pact mock servers. To run them sequentially make multiple calls to karma from the command line with the different browsers passed with the `--browser` option.

1. Write a Jasmine unit test similar to the following,

    ```
    describe("Client", function() {
      var client, helloProvider;

      beforeEach(function() {
        client = new ProviderClient('http://localhost:1234');
        helloProvider = MockService.create({
          consumer: 'Hello Consumer',
          provider: 'Hello Provider',
          port: 1234
        });
      });

      it("should say hello", function(done) {
        helloProvider
          .uponReceiving("a request for hello")
          .withRequest("get", "/sayHello")
          .willRespondWith(200, {
            "Content-Type": "application/json"
          }, {
            reply: "Hello"
          });

        helloProvider.done(function(pactError) {
          expect(pactError).toBe(null);
          done();
        });

        helloProvider.run(function(runComplete) {
          expect(client.sayHello()).toEqual("Hello");
          runComplete();
        });
      });
    });
    ```

    See the spec in the example directory for more examples of asynchronous callbacks, how to expect error responses, and how to use query params.

    Make sure the source and test files are included by Karma in the `karma.conf.js` in the files array.

1. Let's run that bad boy!

   * start the pact mock server with `bundle exec pact-mock-service -p 1234 -l log/pact.logs --pact-dir tmp/pacts`
   * run `karma start` (in another terminal window)
   * inspect the pact file that has been written to "hello_consumer-hello_provider.json"

### Example

Have a look at the [example](/example) folder. Ensure you have Google Chrome installed.

    $ cd example
    $ bundle install
    $ npm install
    $ npm test

# Contributing

Please read [CONTRIBUTING.md](/CONTRIBUTING.md)

[pact-readme]: https://github.com/realestate-com-au/pact
[releases]: https://github.com/DiUS/pact-consumer-js-dsl/releases
[pact-mock-service]: https://github.com/bethesque/pact-mock_service
[pact-mock-service-without-ruby]: https://github.com/DiUS/pact-consumer-js-dsl/wiki/Using-the-Pact-Mock-Service-without-Ruby
