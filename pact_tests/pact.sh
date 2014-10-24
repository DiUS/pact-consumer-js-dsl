#!/bin/sh
# This script will run the pact process.  There is no need to edit this file.

PORT=$1

echo "Running the pact server on $PORT"

rm /tmp/pact.log
pact-mock-service  -p $PORT -l /tmp/pact.log >out.txt 2>&1 &

echo "\nStart running pact tests \n"

GRUNT=grunt

if [ -e `npm bin`/grunt ]; then
  GRUNT=`npm bin`/grunt
fi

$GRUNT karma:pact