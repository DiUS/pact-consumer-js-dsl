Pact JS DSL
=========

_This DSL is in very early stages of development, please bear with us as we give it some polish. Please raise any problems you have in the github issues. Check out the [Development Roadmap](/ROADMAP.md) to see where we are headed._

This codebase is to create the JS version DSL for Pact.

At the moment the hard requirements are

- Jasmine
- the `pact` ruby gem

### Getting Started (with Karma, Jasmine and the pact gem)

1. Install the [pact-mock_service](https://github.com/bethesque/pact-mock_service) ruby gem

   The easiest way is to add `gem 'pact-mock_service'` to your `Gemfile` and run `bundle install`

1. Install and configure Karma with Jasmine

  1. Create a `package.json` if you don't have one already - use `npm init` if you don't

  1. Install Karma using their [installation instructions](http://karma-runner.github.io/0.12/intro/installation.html)

    This basically consists of running,

    * `npm install karma --save-dev`
    * `npm install karma-jasmine karma-chrome-launcher --save-dev`
    * `npm install -g karma-cli`

  1. Initialise and configure Karma

    Run `karma init`. Answer **jasmine** for *testing framework* and **no** for *use require.js*.

  1. Add `pact-js-dsl` to your project by running `npm install DiUS/pact-consumer-js-dsl --save-dev`

  1. Tell Karma about `pact-js-dsl.js` in `karma.conf.js`. In the `files: []` section add a new entry for `node_modules/pact-js-dsl/dist/pact-js-dsl.js`.

  1. Allow tests to load resources from `pact` mock server. One way to do this is in the `karma.conf.js`, change `browsers: ['Chrome'],` to,

         ````
         browsers: ['Chrome_without_security'],
         customLaunchers: {
            Chrome_without_security: {
                base: 'Chrome',
                flags: ['--disable-web-security']
            }
         }
         ````

   Note that running your tests across multiple browsers with one pact mock server will probably conflict with each other. You will need to either run them sequentially or start multiple pact mock servers. To run them sequentially make multiple calls to karma from the command line with the different browsers passed with the `--browser` option.

1. Write a Jasmine unit test similar to the following,

        describe("Client", function() {

            var client, helloProvider;

            beforeEach(function() {
              client = pact.createClient('http://localhost:1234');
              helloProvider = MockService.create('hello-consumer', 'hello-provider', '1234');
            });

            it("should say hello", function() {

                helloProvider
                  .uponReceiving("a request for hello")
                  .withRequest("get", "/sayHello")
                  .willRespondWith(200, {
                    "Content-Type": "application/json"
                  }, {
                    reply: "Hello"
                  });

                  helloProvider.run(function(complete) {
                    expect(client.sayHello()).toEqual("Hello");
                    complete();
                  });
            });
         });

    See the spec in the example directory for examples of asynchronous callbacks, how to expect error responses, and how to use query params.

    Make sure the source and test files are included by Karma in the `karma.conf.js` in the files array.

1. Let's run that bad boy!

   * start the pact mock server with `bundle exec pact-mock-service -p 1234 -l /tmp/pact.logs`
   * run `karma start` (in another terminal window)

### Example

Have a look at the `example` folder.
