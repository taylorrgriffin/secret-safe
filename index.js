/***
 * A NPM module to abstract secrets to avoid accidental committal
 ***/

//Imports
const fs = require("fs");
const uuidv1 = require("uuid/v1");

/**
 * Main function used to parse secrets
 * @param {string | number} secret
 */
const protect = function(secret) {
  if (fs.existsSync("secrets.json")) {
    addSecret(secret);
  } else {
    initSecrets(secret);
  }
  stagePrecommit();
};

/**
 *
 */
const initSecrets = function(secret) {
  const secrets = {
    secrets: []
  };
  const json = JSON.stringify(secrets);
  fs.writeFileSync("secrets.json", json, "utf8");
  addSecret(secret);
};

const addSecret = function(secret) {
  if (fs.existsSync("secrets.json")) {
    fs.readFile("secrets.json", "utf8", function(err, data) {
      if (err) {
        throw err;
      }
      fs.writeFileSync(
        "secrets.json",
        pushSecretToExistingObj(data, secret),
        "utf8",
        console.log(secret + " added to secrets.json")
      );
    });
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

const stagePrecommit = function() {
  // if pre-commit exists, append rules to end of file
  if (fs.existsSync(".git/hooks/pre-commit")) {
    fs.readFile("pre-commit", "utf8", function(err, rules) {
      if (err) {
        throw err;
      }
      fs.appendFileSync(".git/hooks/pre-commit", rules);
    });
  }
  // if it doesn't exist, add file and rules
  if (!fs.existsSync(".git/hooks/pre-commit")) {
    fs.copyFile("pre-commit", ".git/hooks/pre-commit", err => {
      if (err) {
        throw err;
      }
    });
  }
  // if it doesn't exist, add file and rules
  if (!fs.existsSync(".git/hooks/pre-commit")) {
    fs.copyFile("pre-commit", ".git/hooks/pre-commit", err => {
      if (err) {
        throw err;
      }
    });
  }
};

const generateDatetimeHash = function() {
  const date = new Date();

  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const time = date.getTime();

  return time ^ day ^ month ^ year;
};

//exports
module.exports = {
  protect,
  initSecrets,
  addSecret,
  stagePrecommit,
  generateDatetimeHash
};

// test
protect("ABCDEF");
