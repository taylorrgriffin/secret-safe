const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const {
  GIT_STAGED_FILES,
  SECRET_SAFE_TMP_DIR,
  preCommitHooksFile,
  postCommitHooksFile
} = require('../vars');

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
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @return {Promise<string>}
 */
function execShellCommand(cmd) {
  return new Promise((resolve, reject) => {
   exec(cmd, (error, stdout, stderr) => {
    errorHandler(error);
    resolve(stdout? stdout : stderr);
   });
  });
}

 /**
 * Fetches git staged files
 * @return {Promise<Array<string>>}
 */
async function getStagedFiles() {
  return (await execShellCommand(GIT_STAGED_FILES)).split("\n").slice(0, -1);
}

 /**
 * Create secret-safe temp directory (if it's doesn't exist) and return path
 * @return {Promise<string>}
 */
function createTmpDir() {
  return new Promise((resolve, reject) => {
    let dir = path.join(process.cwd(), SECRET_SAFE_TMP_DIR);
    if (!fs.existsSync(dir)){
      fs.mkdir(dir, (err) => {
        errorHandler(err);
        resolve(dir);
      });
    }
    else {
      resolve(dir);
    }
  });
}

/**
* Load json into memory as an object
* @param file {string}
* @return {Promise<object>}
*/
function loadJson(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      errorHandler(err);
      resolve(JSON.parse(data));
    });
  });
}

/**
* Writes json object to file
* @param file {string}
* @param data {object}
* @return {Promise<object>}
*/
function storeJson(file, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8', (err) => {
      errorHandler(err);
      resolve(); 
    });
  });
}

function deleteFile(file) {
  return new Promise((resolve, reject) => {
    fs.unlink(file, (err) => {
      errorHandler(err);
      resolve();
    })
  })
}

/**
* Get config object if the user has a config defined
* @return {object}
*/
function getConfig() {
  let result = {};

  try {
    result = require(path.join(process.cwd(), 'secret-safe.config.js'));
  }
  catch(e) {
    if (e instanceof Error && e.code != "MODULE_NOT_FOUND") {
      throw e;
    }
  }

  return result;
}

/**
 * Get the user's pre-commit hook
 * @return {string}
 */
function fetchUsersPreCommitHook() {
  return fs.existsSync(preCommitHooksFile) ? fs.readFileSync(preCommitHooksFile, 'utf8') : '';
}

/**
 * Get the user's post-commit hook
 * @return {string}
 */
function fetchUsersPostCommitHook() {
  return fs.existsSync(postCommitHooksFile) ? fs.readFileSync(postCommitHooksFile, 'utf8') : '';
}

module.exports = {
  errorHandler,
  getStagedFiles,
  createTmpDir,
  loadJson,
  storeJson,
  getConfig,
  deleteFile,
  fetchUsersPreCommitHook,
  fetchUsersPostCommitHook,
  execShellCommand,
}