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
