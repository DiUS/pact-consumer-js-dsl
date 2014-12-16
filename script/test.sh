bundle exec pact-mock-service -p 1234 -l /tmp/pact.log &
PACT_PID=$!

sleep 5 #wip

echo $PACT_PID

echo 'running tests'
# run tests!

kill -2 $PACT_PID
