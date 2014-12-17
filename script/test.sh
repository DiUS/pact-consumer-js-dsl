# Start mock service
bundle exec pact-mock-service -p 1234 -l /tmp/pact.log &
PACT_PID=$!

sleep 5 #wip! Need a nicer way to wait for the service to start up

echo $PACT_PID

# Run tests
grunt karma

# Shutdown mock service
kill -2 $PACT_PID
