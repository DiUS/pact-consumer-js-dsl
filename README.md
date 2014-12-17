Pact JS DSL
=========

_This DSL is in very early stages of development, please bear with us as we give it some polish. Please raise any problems you have in the github issues. Check out the [Development Roadmap](#development-roadmap) to see where we are headed._

This codebase is to create the JS version DSL for Pact

At the moment the hard requirements are,
- Jasmine
- the `pact` ruby gem
- RequireJS

### Getting Started (with Karma, Jasmine, RequireJS and the pact gem)

1. Install the ["pact" ruby gem](https://github.com/realestate-com-au/pact)

   The easiest way is to add `gem "pact-mock_service"` to your `Gemfile` and run `bundle install`

1. Install and configure Karma with Jasmine and RequireJS

  1. Create a `package.json` if you don't have one already (`npm init` is a good way to get started)

  1. Install Karma using their [installation instructions](http://karma-runner.github.io/0.12/intro/installation.html)

    This basically consists of running,

    * `npm install karma --save-dev`
    * `npm install karma-jasmine karma-chrome-launcher --save-dev`
    * `npm install -g karma-cli`

  1. Initialise and configure Karma

    Run `karma init` and,

    * For the **testing framework?** choose `jasmine`
    * For **use Require.js?** choose `yes`
    * For **generate a bootstrap file for RequireJS?** choose `yes` (this creates `test-main.js` for you)

  1. Add `pact-js-dsl` to your project by running `npm install DiUS/pact-consumer-js-dsl --save-dev`

  1. Tell Karma about `pact-js-dsl.js` in `karma.conf.js`. In the `files: [...` section add,

    ```javascript
        {pattern: 'node_modules/pact-js-dsl/dist/pact-js-dsl.js', included: false},
    ```

  1. Configure RequireJS to find `pact-js-dsl` by adding the following to the `require.config({...` section of `test-main.js`

    ```javascript
      paths: {
        'pact-js-dsl':  'node_modules/pact-js-dsl/dist/pact-js-dsl',
      },
      bundles: {
        'pact-js-dsl':  ['pactDetails', 'interaction', 'mockService']
      },
    ```

    For more info on configuring Karma with RequireJS check out [Karma's page on RequireJS](http://karma-runner.github.io/0.8/plus/RequireJS.html)

  1. Allow tests to load resources from `pact` mock server. One way to do this is in the `karma.conf.js`, change `browsers: ['Chrome'],` to,

     ```javascript
        browsers: ['Chrome_without_security'],

        customLaunchers: {
          Chrome_without_security: {
            base: 'Chrome',
            flags: ['--disable-web-security']
          }
        },
     ```

    Note that running your tests across multiple browsers with one pact mock server will probably conflict with eachother. You will need to either run them sequentially or start multiple pact mock servers. To run them sequentially make multiple calls to karma from the command line with the different browsers passed with the `--browser` option.

1. Write a Jasmine unit test similar to the following,

  ```javascript
  define(['mockService'],
    function (MockService) {

      describe('my app', function () {

        // Configure your client to hit the pact mock server instead of 'production'
        MyClient.urlBase = "http://localhost:9427";

        it('should behave as expected', function () {
            var provider = new MockService('my-client', 'my-service', '9427');
            provider
                .given("usual state")
                .uponReceiving("a greeting")
                .withRequest("GET", "/hello")
                .willRespondWith({
                  status: 200,
                  headers: { "Content-Type": "application/json" },
                  body: {
                    responseMessage: "hello to you too"
                  }
                });

            provider.run(function (completed) {
                expect(MyClient.hello().responseMessage).toBe("hello to you too");
                completed();
            });
        }); // end it

      }); // end describe

    }
  ); // end define
  ```

  Make sure this test file is included by Karma in the `karma.conf.js`. You'll probably need to add something like,

  ```
  {pattern: 'src/my-client.js', included: true},
  {pattern: 'test/my-client-test.js', included: false},
  ```

  Note that in this example `my-client.js` has `included` set to `true`. Use this if `my-client.js` is not loaded by RequireJS. This may be the case if you include the file into your page with a script tag (e.g. `<script type="text/javascript" src="my-client.js"></script>`)

1. Let's run that bad boy!

  * start the pact mock server with `bundle exec pact-mock-service -p 9427 -l /tmp/pact.logs`
  * run `karma start` (in another terminal window)

1. Write some Grunt, Gulp, Rake, etc., tasks to make running easier. As an example, look at the `Gruntfile` in this repo.


### Example

There is an example in the example folder.

To contribute
-----
You can also contribute to this codebase

### Prepare Development Environment

You need to install nodejs to you computer.

In MacOSX:

- brew install node
- export PATH=$PATH:/usr/local/share/npm/bin
- source .bash_profile

### To start development

You need to install grunt-cli, bower and karma first

- npm install -g grunt-cli bower karma

Install other dependencies

- npm install
- bower install

### Running tests

    npm install
    script/test.sh

### Run example test

- grunt test (this will run the example test in the example folder)

### Create the pact-js-dsl.js

- grunt package (this will concat the src code into pact-js-dsl.js and put it into dist)

## Development Roadmap

We would like to remove the dependency on Ruby by using Phusion's [Travelling Ruby](https://github.com/phusion/traveling-ruby) to package the pact-mock_service gem as a standalone executable. This is preferred over writing a native javascript mock server, as duplicating all the matching logic and maintaining it long term will be a burden. If you are interested in assisting with the packaging (the Pact authors are a little swamped right now!) please hit us up on the [pact-dev](https://groups.google.com/forum/#!forum/pact-dev) google group.

At the moment, the DSL does not support flexible matching as there is no equivalent of Pact::Term or Pact::SomethingLike (though you could hack this in by hand if you really needed to). If you are interested in contributing, again, please contact us.

We are also working on removing the dependency on requirejs, and are very happy to receive pull requests for code that makes the DSL work nicely with other testing frameworks.
