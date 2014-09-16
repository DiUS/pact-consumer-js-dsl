/*global module */
module.exports = function (grunt) {
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        distDir: "dist",
        distName: "pact-js-dsl",
        srcDir: "src",
        clean: ['<%= dest %>'],
        concat: {
            dist: {
                src: ['<%= srcDir %>/*.js'],
                dest: '<%= distDir %>/<%= distName %>.js'

            }
        },
        karma: {
            pact: {
                configFile: 'example/karma.conf.js',
                singleRun: true
            }
        },
        shell: {
            pact: {
                command: 'echo run pact test; cd ./pact_tests; ./pact.sh',
                options: {
                    stdout: true,
                    failOnError: true
                }
            },
            copyPacts: {
                command: 'echo copy Pacts file to provider; cd ./pact_tests; ./sbt copyPacts',
                options: {
                    stdout: true
                }
            }
        },
    });

    require("load-grunt-tasks")(grunt);

    grunt.registerTask('pactTest', ['shell:pact']);

    grunt.registerTask('pact', ['concat', 'shell:pact', 'shell:copyPacts']);

};
