Pact JS DSL
=========

This codebase is to create the JS version DSL for Pact

For use
-----
### How to use it

#### 1. you will need the DSL
There is 2 way to use this DSL.

1. use bower to import it into your project
2. copy the pact-js-dsl.js file in dist to your project directly

After get this js file in your project, you can use it in requireJs like following:

<pre><code>
bundles: {
  'pact-js-dsl': ['pact', 'interaction', 'pactBuilder']
}
</code></pre>

#### 2. you need a pact server

In the example here, we are using ruby pact server (a gem). 
Ref: https://github.com/realestate-com-au/pact 

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

### Run example test

- grunt test (this will run the example test in the example folder)

### Create the pact-js-dsl.js

- grunt package (this will concat the src code into pact-js-dsl.js and put it into dist)
