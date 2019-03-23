const fs = require("fs");

const { addSecret, initSecrets, stagePrecommit } = require("./utils");
const { secretsStore } = require("../vars");

/**
 * Main function used to parse secrets
 * @param {string | number} secret
 */
const protect = function(secret) {
  const action = fs.existsSync(secretsStore) ? addSecret : initSecrets;
  action(secret);
  stagePrecommit();
};

module.exports = { protect };
