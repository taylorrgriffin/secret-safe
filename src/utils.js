/***
 * A NPM module to abstract secrets to avoid accidental committal
 ***/

//Module Imports
const fs = require("fs");
const uuidv1 = require("uuid/v1");

//Local Imports
const { preCommitFile, preCommitHooksFile, postCommitFile, postCommitHooksFile, secretsStore } = require("../vars");

/**
 * 
 */
const initSecrets = function(secret) {
  const secrets = {
    secrets: []
  };
  const json = JSON.stringify(secrets);
  fs.writeFileSync(secretsStore, json, "utf8");
  addSecret(secret);
};

const addSecret = function(secret) {
  if (fs.existsSync(secretsStore)) {
    fs.readFile(secretsStore, "utf8", function(err, data) {
      errorHandler(err);
      fs.writeFileSync(
        secretsStore,
        pushSecretToExistingObj(data, secret),
        "utf8",
        console.log(`${secret} added to ${secretsStore}`)
      );
    });
  }
};

const stagePrecommit = function() {
  const preCommitHooksExist = fs.existsSync(preCommitHooksFile);

  // pre-commit hook exists
  if (preCommitHooksExist) {
    fs.readFile(preCommitFile, "utf8", function(err, rules) {
      errorHandler(err);
      fs.readFile(preCommitHooksFile, "utf8", function(err, existingRules) {
        errorHandler(err);
        // add secret abstraction if its not already in the hook
        if (!existingRules.includes(rules)) {
          fs.appendFileSync(preCommitHooksFile, rules);
        }
      });
    });
  }
  // hook doesn't exist
  if (!preCommitHooksExist) {
    // add hook
    fs.copyFile(preCommitFile, preCommitHooksFile, err => {
      errorHandler(err);
    });
  }
};

const stagePostcommit = function() {
  const postCommitHooksExist = fs.existsSync(postCommitHooksFile);

  // post-commit hook exists
  if (postCommitHooksExist) {
    fs.readFile(postCommitFile, "utf8", function(err, rules) {
      errorHandler(err);
      fs.readFile(postCommitHooksFile, "utf8", function(err, existingRules) {
        errorHandler(err);
        // add hash replacement if its not already in the hook
        if (!existingRules.includes(rules)) {
          fs.appendFileSync(postCommitHooksFile, rules);
        }
      });
    });
  }
  // hook doesn't exist
  if (!postCommitHooksExist) {
    // add hook
    fs.copyFile(postCommitFile, postCommitHooksFile, err => {
      errorHandler(err);
    });
  }
}

/**
 * throws if there's an error
 * @param err
 */
const errorHandler = err => {
  if (err) {
    throw err;
  }
};

/**
 * Takes data from file and returns json with secret added
 * @param {string} data file contents from fs.readFile 
 * @param secret
 */
const pushSecretToExistingObj = function(data, secret) {
  const hash = uuidv1();
  const secretsObj = JSON.parse(data);
  secretsObj.secrets.push({ id: hash, msg: secret });
  json = JSON.stringify(secretsObj);
  return json;
};

//exports
module.exports = {
  addSecret,
  initSecrets,
  pushSecretToExistingObj,
  stagePrecommit,
  stagePostcommit
};
