# Pact Consumer Javascript DSL

[![Build Status](https://travis-ci.org/DiUS/pact-consumer-js-dsl.svg)](https://travis-ci.org/DiUS/pact-consumer-js-dsl)

This codebase provides a Javascript DSL for creating pacts. If you are new to Pact, please read the Pact [README][pact-readme] first.

The Javascript DSL is compatible with v2 of the [pact-specification](https://github.com/bethesque/pact-specification/tree/version-2) and supports type based matching, flexible array lengths, and regular expressions (read more below).

This DSL relies on the Ruby [pact-mock_service][pact-mock-service] gem to provide the mock service for the Javascript tests. If you do not want to use Ruby in your project, please read about using a standalone Pact mock service [here][pact-mock-service-without-ruby].

### Getting Help

* Please see the [wiki](https://github.com/DiUS/pact-consumer-js-dsl/wiki) for documentation (eg. using CORS, using the DSL on Windows).
* Google users group: https://groups.google.com/forum/#!forum/pact-support
* Twitter: [@pact_up](https://twitter.com/pact_up)

### Installing pact-mock-service

* If on Windows, please refer to the [Installing pact-mock-service on Windows](https://github.com/bethesque/pact-mock_service/wiki/Installing-the-pact-mock_service-gem-on-Windows)

1. You must install [Ruby](https://www.ruby-lang.org/en/downloads/) and [RubyGems](https://rubygems.org/pages/download) first.

1. After these binaries are available in the console, you can install the mock service by creating a Gemfile as shown below (this is the Ruby equivalent of package.json), then running `gem install bundler && bundle install` (the equivalent of npm install).

* Note: Windows users must run the install command after following Wiki instructions

```ruby
source 'https://rubygems.org'
gem 'pact-mock_service', '~> 0.7.0'

```

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

         ````javascript
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

    ```javascript
    describe("Client", function() {
      var client, helloProvider;

      beforeAll(function(done) {
        //ProviderClient is the class you have written to make the HTTP calls to the provider
        client = new ProviderClient('http://localhost:1234');
        helloProvider = Pact.mockService({
          consumer: 'Hello Consumer',
          provider: 'Hello Provider',
          port: 1234,
          done: function (error) {
            expect(error).toBe(null);
          }
        });

        // This ensures your pact-mock-service is in a clean state before
        // running your test suite.
        helloProvider.resetSession(done);
      });

      it("should say hello", function(done) {
        helloProvider
          .given("an alligator with the name Mary exists")
          .uponReceiving("a request for an alligator")
          .withRequest("get", "/alligators/Mary", {
            "Accept": "application/json"
          }).willRespondWith(200, {
            "Content-Type": "application/json"
          }, {
            "name": "Mary"
          });

        helloProvider.run(done, function(runComplete) {
          expect(client.getAlligatorByName("Mary")).toEqual(new Alligator("Mary"));
          runComplete();
        });
      });
    });
    ```

    The "done" callback is used by the pact framework to communicate to your test framework that the expected interactions have not occurred. It should contain an assertion that will fail the test if an error is present. eg. for Jasmine:

    ```javascript
    done: function (error) {
      expect(error).toBe(null);
    }
    ```
    This is required because of the asynchonous nature of Javascript - raising exceptions to fail a test is not the "Javascript Way".

    See the spec in the example directory for more examples of asynchronous callbacks, how to expect error responses, and how to use query params.

    Make sure the source and test files are included by Karma in the `karma.conf.js` in the files array.

1. Let's run that bad boy!

   * Start the pact mock server with `bundle exec pact-mock-service -p 1234 --pact-specification-version 2.0.0 -l log/pact.logs --pact-dir tmp/pacts`
   * Run `karma start` (in another terminal window)
   * Inspect the pact file that has been written to "hello_consumer-hello_provider.json"

### Flexible Matching

Please read about using regular expressions and type based matching [here][flexible-matching] before continuing.

#### Match by regular expression

Remember that the mock service is written in Ruby, so the regular expression must be in a Ruby format, not a Javascript format. Make sure to start the mock service with the argument `--pact-specification-version 2.0.0`.

```javascript

provider
  .given('there is a product')
  .uponReceiving("request for products")
  .withRequest({
    method: "get",
    path: "/products",
    query: {
      category: Pact.Match.term({matcher: "\\w+", generate: 'pizza'}),
    }
  })
  .willRespondWith(
    200,
    {},
    {
      "collection": [
        {
          guid: Pact.Match.term({matcher: "\\d{16}", generate: "1111222233334444"})
        }
      ]
    }
  );
```

#### Match based on type

```javascript

provider
  .given('there is a product')
  .uponReceiving("request for products")
  .withRequest({
    method: "get",
    path: "/products",
    query: {
      category: Pact.Match.somethingLike("pizza")
    }
  })
  .willRespondWith(
    200,
    {},
    {
      "collection": [
        {
          guid: Pact.Match.somethingLike(1111222233334444)
        }
      ]
    }
  );
```

[flexible-matching]: https://github.com/realestate-com-au/pact/wiki/Regular-expressions-and-type-matching-with-Pact

#### Match based on arrays

Matching provides the ability to specify flexible length arrays. For example:

```javascript
Pact.Match.eachLike(obj, { min: 3 })
```

Where `obj` can be any javascript object, value or Pact.Match. It takes optional argument (`{ min: 3 }`) where min is greater than 0 and defaults to 1 if not provided. 

Below is an example that uses all of the Pact Matchers.

```javascript

var somethingLike = Pact.Match.somethingLike;
var term = Pact.Match.term;
var eachLike = Pact.Match.eachLike;

provider
  .given('there is a product')
  .uponReceiving("request for products")
  .withRequest({
    method: "get",
    path: "/products",
    query: {
      category: "clothing"
    }
  })
  .willRespondWith({
    status: 200,
    headers: {
        'Content-Type': 'application/json'
    },
    body: {
        "items":eachLike({
            size: somethingLike(10),
            colour: term("red|green|blue", {generates: "blue"}),
            tag: eachLike(somethingLike("jumper"))
        }, {min: 2})
    }
  });
```

### Examples

#### Web Example

Have a look at the [example](/example/web) folder. Ensure you have Google Chrome installed.

    $ cd example/web
    $ bundle install
    $ npm install
    $ npm test


#### Nodejs Example

This is only an example on how to use the pact-consumer-js-dsl within Node.  This is not best practice, but is a good starting point without creating a lengthy example using Grunt or Gulp with Protractor or Karma.

1. Start pact-mock-service with `bundle exec pact-mock-service start -p 1234 -l tmp/pact.log --pact-dir tmp/pacts`

1. Run nodejs command to setup pact consumer `node example/nodejs/setup.js`

1. Run your tests here with whatever you want, like Protractor for e2e testing

1. Run nodejs command to verify interactions and write pact files `node example/nodejs/teardown.js`

1. Stop the mock service with `bundle exec pact-mock-service stop -p 1234`

# Contributing

Please read [CONTRIBUTING.md](/CONTRIBUTING.md)

[pact-readme]: https://github.com/realestate-com-au/pact
[releases]: https://github.com/DiUS/pact-consumer-js-dsl/releases
[pact-mock-service]: https://github.com/bethesque/pact-mock_service
[pact-mock-service-without-ruby]: https://github.com/DiUS/pact-consumer-js-dsl/wiki/Using-the-Pact-Mock-Service-without-Ruby
