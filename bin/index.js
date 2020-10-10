#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { init } = require('../lib/init');
const { getConfig } = require('../lib/utils');
const { preCommit } = require('../lib/pre-commit');
const { postCommit } = require('../lib/post-commit');

const args = process.argv.splice(2);

if (args.length == 0) {
  console.info("Usage: etc...");
}
else if (args[0] == 'init') {
  init();
}
else if (args[0] == "unlink") {
  console.error("secret-safe unlink is not yet defined");
}
else if (args[0] == "pre-commit") {
  let config = getConfig();
  preCommit(config);
}
else if (args[0] == "post-commit") {
  postCommit();
}
else {
  console.info("Usage: etc...");
}