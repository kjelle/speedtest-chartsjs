#!/bin/bash

BINARY=$(cat 'config.json' | jq -r '.binary')
echo "Executing binary $BINARY"

OUTPUT=$(cat 'config.json' | jq -r '.output')
echo "Output to file $OUTPUT"

for row in $(cat 'config.json' | jq -r '.servers[] | @base64'); do
  _jq() {
    echo ${row} | base64 --decode | jq -r ${1}
  }

  SERVER=$(_jq '.')
  echo "Testing server $SERVER"

  $BINARY --server $SERVER --json | grep -v "^Servers:" >> data.json
done
