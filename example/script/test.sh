# Start mock service
mkdir -p tmp/pacts
bundle exec pact-mock-service -p 1234 -l tmp/pact.log &
PACT_PID=$!

sleep 5 #wip! Need a nicer way to wait for the service to start up

echo $PACT_PID

# Run tests - is this the right way to call karma?!
node_modules/karma/bin/karma start

# Shutdown mock service
kill -2 $PACT_PID
