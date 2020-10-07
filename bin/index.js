#!/usr/bin/env node

const { init } = require('../lib/init');
const { preCommit } = require('../lib/pre-commit');
const { postCommit } = require('../lib/post-commit');

const args = process.argv.splice(2);

if (args.length == 0) {
  console.info("Usage: etc...");
}
else if (args[0] == 'init') {
  init();
}
else if (args[0] == "pre-commit") {
  preCommit();
}
else if (args[0] == "post-commit") {
  postCommit();
}
else {
  console.info("Usage: etc...");
}