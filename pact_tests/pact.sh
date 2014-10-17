#!/bin/sh
# This script will run the pact process.  There is no need to edit this file.

PORT=$1

echo "Running the pact server on port 1234"
pact service -p 1234 > out.txt 2>&1 &

echo "\nStart running pact test\n"

GRUNT=grunt

if [ -e `npm bin`/grunt ]; then
  GRUNT=`npm bin`/grunt
fi

$GRUNT karma:pact

#./sbt -Dserver.port=${PORT:=29999} pact