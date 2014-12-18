# Start mock service
mkdir -p tmp/pacts
bundle exec pact-mock-service -p 1234 -l tmp/pact.log &
PACT_PID=$!

sleep 5 #wip! Need a nicer way to wait for the service to start up

echo $PACT_PID

GRUNT=grunt

if [ -e `npm bin`/grunt ]; then
  GRUNT=`npm bin`/grunt
fi

# Run tests
$GRUNT karma

# Shutdown mock service
kill -2 $PACT_PID
