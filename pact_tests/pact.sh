#!/bin/sh
# This script will run the pact process.  There is no need to edit this file.

PORT=$1


./sbt -Dserver.port=${PORT:=29999} pact
