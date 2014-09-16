#!/bin/sh

SERVER_PORT=$1

# This is where you provide the hook into your build process.  This script will be called after
# the pact-jvm-server has been started.
#
# A non-zero exit code from this script will filter through to the pact and report a build failure.

echo "\nStart running pact test\n"

GRUNT=grunt

if [ -e `npm bin`/grunt ]; then
  GRUNT=`npm bin`/grunt
fi

$GRUNT karma:pact
