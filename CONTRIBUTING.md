# Contributing to Pact Consumer Javascript DSL

### Prepare development environment

#### Nodejs

You need to install nodejs in your computer.

In Mac OS X:

    $ brew install node
    $ export PATH=$PATH:/usr/local/share/npm/bin
    $ source .bash_profile

In Linux:

    $ apt-get install nodejs

In Windows: [Download the 32-bit version of Nodejs installer.](http://nodejs.org/download/)

#### Installing Ruby

In Mac OS X:

    $ brew install ruby
    $ export PATH=$PATH:/usr/local/opt/ruby/bin
    $ source .bash_profile

In Linux:

    $ apt-get install ruby1.9.3 rubygems

In Windows: [Follow the installation instructions here to install Ruby and RubyGems](https://github.com/bethesque/pact-mock_service/wiki/Installing-the-pact-mock_service-gem-on-Windows)

#### Installing Bundle & pact-mock-service

Run the following commands (works in all OS'):

    $ gem install bundler

### To start development

You need to install gulp, bower and karma to build and test the code; if you don't want them to be globally available, remove the `-g` at the end:

    $ npm install gulp bower karma -g

While inside the project folder, setup the dependencies needed by running:

    bundle install
    npm install
    bower install

To build and test:

    $ gulp

Useful gulp tasks:
- `gulp build` creates the distribution version of the code, which sits in the 'dist' folder.
- `gulp run-tests` will build the distribution file, spin up the pact server and run the tests in a browser and in nodejs.
- `gulp watch` will spin up the pact server and automatically rerun the tests in a browser every time a relevant file is changed.

### Run example test

    $ cd example
    $ bundle install && npm install
    $ npm test

### Create the pact-consumer-js-dsl.js

The `pact-consumer-js-dsl.js` is a minified and concatenated version of the Pact Javascript source. In order to generate it just run...

    $ gulp build

### Release process

When a stable version X.Y.Z can be released:

* Increment the version in package.json and bower.json.
* Update the CHANGELOG.md with the commits since the last release using the command:

    $ git log --pretty=format:'  * %h - %s (%an, %ad)'

Do not include commit messages that will not affect end users (eg. refactoring, updates to README files etc.)

* Commit

    $ git commit -am "Releasing version X.Y.Z"
    $ git push

* Create a copy of the pact-consumer-js-dsl.js file with the suffix pact-consumer-js-dsl-X.Y.Z.js
* Open the page to create a [new release][new-release] in Github.

    Tag version: X.Y.Z
    Release title: pact-consumer-js-dsl-X.Y.Z.js

* Upload pact-consumer-js-dsl-X.Y.Z.js and publish the release.

Then publish to npm

    $ npm publish ./


[new-release]: https://github.com/DiUS/pact-consumer-js-dsl/releases/new
