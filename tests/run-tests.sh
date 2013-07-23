#!/usr/bin/env sh

set -e

THIS_DIR=$(dirname "$0")

node "${THIS_DIR}/server.js" &
SERVER_PID=$!
"${THIS_DIR}/../node_modules/.bin/grunt" qunit
kill ${SERVER_PID}
