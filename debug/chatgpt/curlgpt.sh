#!/bin/bash

#
# This script acts as a proxy to the openai api
# Simply deploy this as a CGI script and put
# the url in the init.js file
#

# Need to have access to the OPEN_API_KEY
OPENAI_API_KEY='';

BODY=$(cat)

echo "Access-Control-Allow-Origin: *"
echo 'content-type: text/event-stream'
echo

stdbuf -oL curl https://api.openai.com/v1/chat/completions \
     -v \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $OPENAI_API_KEY" \
     -d "$BODY"

