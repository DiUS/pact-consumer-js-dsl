#!/bin/sh
# This script will execute the tests

#Make sure that the pact server is running
#pact-mock-service  -p $PORT -l /tmp/pact.log >out.txt 2>&1 

echo "\nStart running pact tests \n"

GRUNT=grunt

if [ -e `npm bin`/grunt ]; then
  GRUNT=`npm bin`/grunt
fi

$GRUNT karma:pact