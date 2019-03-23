/***
 * A NPM module to abstract secrets to avoid accidental committal
 ***/

//Module Imports
const fs = require("fs");
const uuidv1 = require("uuid/v1");

//Local Imports
const { preCommitFile, preCommitHooksFile, secretsStore } = require("../vars");

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

  // if pre-commit exists, append rules to end of file
  if (preCommitHooksExist) {
    fs.readFile(preCommitFile, "utf8", function(err, rules) {
      errorHandler(err);
      fs.appendFileSync(preCommitHooksFile, rules);
    });
  }
  // if it doesn't exist, add file and rules
  if (!preCommitHooksExist) {
    fs.copyFile(preCommitFile, preCommitHooksFile, err => {
      errorHandler(err);
    });
  }
};

/**
 * Generates a hash based on the time func is called at
 */
const generateDatetimeHash = function() {
  const date = new Date();

  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const time = date.getTime();

  return time ^ day ^ month ^ year;
};

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
 * @param {string} data
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
  generateDatetimeHash,
  initSecrets,
  pushSecretToExistingObj,
  stagePrecommit
};
