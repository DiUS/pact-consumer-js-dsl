# Contributing to Pact Consumer Javascript DSL

### Prepare development environment

You need to install nodejs in your computer.

In Mac OS X:

    $ brew install node
    $ export PATH=$PATH:/usr/local/share/npm/bin
    $ source .bash_profile

### To start development

You need to install grunt-cli, bower and karma first

    $ npm install -g grunt-cli bower karma

Inside the project folder, simply run `npm install` and `bundle install` to install the other dependencies.

### Running tests

    $ gulp run-tests

or

    $ node_modules/.bin/gulp run-tests

### Run example test

    $ cd example
    $ script/setup.sh
    $ script/test.sh

### Create the pact-consumer-js-dsl.js

The `pact-consumer-js-dsl.js` is a minified and concatenated version of the Pact Javascript source. In order to generate it just run...

    $ gulp

### Release process

When a stable version X.Y.Z can be released:

* Increment the version in package.json

    $ git commit -am "Releasing version X.Y.Z"
    $ git push

* Create a copy of the pact-consumer-js-dsl.js file with the suffix pact-consumer-js-dsl-X.Y.Z.js
* Open the page to create a [new release][new-release] in Github.

    Tag version: X.Y.Z
    Release title: pact-consumer-js-dsl-X.Y.Z.js

* Upload pact-consumer-js-dsl-X.Y.Z.js and publish the release.

[new-release]: https://github.com/DiUS/pact-consumer-js-dsl/releases/new
