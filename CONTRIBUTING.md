Contributing to Pact
-----

### Prepare development environment

You need to install nodejs in your computer.

In Mac OS X:

    $ brew install node
    $ export PATH=$PATH:/usr/local/share/npm/bin
    $ source .bash_profile

### To start development

You need to install grunt-cli, bower and karma first

    npm install -g grunt-cli bower karma

Inside the project folder, simply run `npm install` to install the other dependencies.

### Running tests

  gulp run-tests

### Run example test

    cd example
    npm install
    script/test.sh

### Create the pact-js-dsl.js
The `pact-js-dsl.js` is a minified and concatenated version of the Pact Javascript source. In order to generate it just run...

    gulp

## Development Roadmap

We would like to remove the dependency on Ruby by using Phusion's [Travelling Ruby](https://github.com/phusion/traveling-ruby) to package the pact-mock_service gem as a standalone executable. This is preferred over writing a native javascript mock server, as duplicating all the matching logic and maintaining it long term will be a burden. If you are interested in assisting with the packaging (the Pact authors are a little swamped right now!) please hit us up on the [pact-dev](https://groups.google.com/forum/#!forum/pact-dev) google group.

At the moment, the DSL does not support flexible matching as there is no equivalent of Pact::Term or Pact::SomethingLike (though you could hack this in by hand if you really needed to). If you are interested in contributing, again, please contact us.

We are also working on removing the dependency on requirejs, and are very happy to receive pull requests for code that makes the DSL work nicely with other testing frameworks.
