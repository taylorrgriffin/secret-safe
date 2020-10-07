#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
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
else if (args[0] == "unlink") {
  console.error("secret-safe unlink is not yet defined");
}
else if (args[0] == "pre-commit") {
  // load config if it exits, else create empty default config
  try {
    var config = require(path.join(process.cwd(), 'secret-safe.config.js'));
  }
  catch(e) {
    if (e instanceof Error && e.code === "MODULE_NOT_FOUND") {
      config = {};
    }
    else {
      throw e;
    }
  }

  // execute preCommit script
  preCommit(config);
}
else if (args[0] == "post-commit") {
  postCommit();
}
else {
  console.info("Usage: etc...");
}