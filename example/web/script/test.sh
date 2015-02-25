#!/bin/bash

# Start mock service
mkdir -p tmp/pacts
bundle exec pact-mock-service restart -p 1234 -l tmp/pact.log --pact-dir tmp/pacts

node_modules/karma/bin/karma start
exit_code=$?

# Shutdown mock service
bundle exec pact-mock-service stop -p 1234

exit $exit_code