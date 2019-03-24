#!/usr/bin/env bash

# install bash dependencies
JQ="jq"
JQ_REPO="https://github.com/stedolan/jq.git"
if [ -d $JQ ]; then
  rm -rf jq
fi
git clone $JQ_REPO
# install npm dependencies
npm install