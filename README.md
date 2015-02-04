# Pact Consumer Javascript DSL

_This DSL is in very early stages of development, please bear with us as we give it some polish. Please raise any problems you have in the github issues. Check out the [Development Roadmap](/ROADMAP.md) to see where we are headed._

This codebase provides a Javascript DSL for creating pacts. If you are new to Pact, please read the Pact [README](pact-readme) first.

This DSL relies on the Ruby [pact-mock_service][pact-mock-service] gem to provide the mock service for the Javascript tests. If you do not want to use Ruby in your project, please read about using a standalone Pact mock service [here][pact-mock-service-without-ruby].

### Getting Help

* Please see the [wiki](https://github.com/DiUS/pact-consumer-js-dsl/wiki) for documentation (eg. using CORS, using the DSL on Windows).
* Google users group: https://groups.google.com/forum/#!forum/pact-support
* Twitter: [@pact_up](https://twitter.com/pact_up)

### Installing pact-mock-service

* If on Windows, please refer to the [Installing pact-mock-service on Windows](https://github.com/bethesque/pact-mock_service/wiki/Installing-the-pact-mock_service-gem-on-Windows) *

1. You must install [Ruby](https://www.ruby-lang.org/en/downloads/) and [RubyGems](https://rubygems.org/pages/download) first.

1. After these binaries as available in the console, you can install the mock service easily using this command: `gem i pact-mock_service -v 0.2.4` * Windows users must run this command after following Wiki instructions *

### Getting Started (with Karma, Jasmine and pact-mock-service)

1. Install and configure Karma with Jasmine

  1. Create a `package.json` if you don't have one already - use `npm init` if you don't

  1. Install Karma using their [installation instructions](http://karma-runner.github.io/0.12/intro/installation.html)

    This basically consists of running,
    
    ```
    npm install karma karma-jasmine karma-chrome-launcher --save-dev
    npm install -g karma-cli
    ```

  1. Initialise and configure Karma

    Run `karma init`. Answer **jasmine** for *testing framework* and **no** for *use require.js*.

  1. Add `pact-consumer-js-dsl` to your project by running `bower install pact-consumer-js-dsl --save-dev`.

  1. Tell Karma about `pact-consumer-js-dsl.js` in `karma.conf.js`. In the `files: []` section add a new entry for `bower_components/pact-consumer-js-dsl/dist/web/pact-consumer-js-dsl.js`.

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
          port: 1234,
          done: function (error) {
            expect(error).toBe(null);
          }
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

        helloProvider.run(done, function(runComplete) {
          expect(client.sayHello()).toEqual("Hello");
          runComplete();
        });
      });
    });
    ```

    See the spec in the example directory for more examples of asynchronous callbacks, how to expect error responses, and how to use query params.

    Make sure the source and test files are included by Karma in the `karma.conf.js` in the files array.

1. Let's run that bad boy!

   * start the pact mock server with `pact-mock-service -p 1234 -l log/pact.logs --pact-dir tmp/pacts`
   * run `karma start` (in another terminal window)
   * inspect the pact file that has been written to "hello_consumer-hello_provider.json"

#### Web Example

Have a look at the [example](/example/web) folder. Ensure you have Google Chrome installed.

    $ cd example
    $ bundle install
    $ npm install
    $ npm test

    
#### Nodejs Example

This is only an example on how to use the pact-consumer-js-dsl within Node.  This is not best practice, but is a good starting point without creating a lengthy example using Grunt or Gulp with Protractor or Karma.

1. Start pact-mock-service with `pact-mock-service -p 1234 -l tmp/pact.log --pact-dir tmp/pacts`

1. Run nodejs command to setup pact consumer `node example/nodejs/setup.js`

1. Run your tests here with whatever you want, like Protractor for e2e testing

1. Run nodejs command to verify interactions and write pact files `node example/nodejs/teardown.js`

# Contributing

Please read [CONTRIBUTING.md](/CONTRIBUTING.md)

[pact-readme]: https://github.com/realestate-com-au/pact
[releases]: https://github.com/DiUS/pact-consumer-js-dsl/releases
[pact-mock-service]: https://github.com/bethesque/pact-mock_service
[pact-mock-service-without-ruby]: https://github.com/DiUS/pact-consumer-js-dsl/wiki/Using-the-Pact-Mock-Service-without-Ruby
