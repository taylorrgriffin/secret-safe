#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { init } = require('../lib/init');
const { unlink } = require('../lib/unlink');
const { getConfig } = require('../lib/utils');
const { preCommit } = require('../lib/pre-commit');
const { postCommit } = require('../lib/post-commit');

const config = getConfig();
const args = process.argv.splice(2);

if (args.length == 0) {
  console.info("Usage: etc...");
}
else if (args[0] == 'init') {
  init(config);
}
else if (args[0] == "unlink") {
  unlink(config);
}
else if (args[0] == "pre-commit") {
  preCommit(config);
}
else if (args[0] == "post-commit") {
  postCommit(config);
}
else {
  console.info("Usage: etc...");
}