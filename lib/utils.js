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
    if (error) {
      reject(error);
    }
    else {
      resolve(stdout? stdout : stderr);
    }
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
 * Stage file via git
 * @param file {string}
 * @return {Promise<string>} 
 */
async function stageFile(file) {
  return (await execShellCommand(`git add ${file}`));
}

 /**
 * Create secret-safe temp directory (if it's doesn't exist) and return path
 * @return {Promise<string>}
 */
function createTmpDir(d) {
  return new Promise((resolve, reject) => {
    let dir = path.join(process.cwd(), d);
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

/**
* Delete file
* @param file {string}
* @return {Promise<string>}
*/
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

  // first, try to load config from package.json
  try {
    // if package.json can't be found, it will throw MODULE_NOT_FOUND
    let packageJson = require(path.join(process.cwd(), 'package.json'));
    if (packageJson.secretSafe) {
      result = packageJson.secretSafe;
    }
    else {
      // if secretSafe config isn't defined in package.json, throw an empty object to hop into catch
      throw {};
    }
  } catch(e) {
    // account for unexpected errors which could be thrown
    if (e instanceof Error && e.code != "MODULE_NOT_FOUND") {
      throw e;
    }
    else {
      // try to load config from file
      try {
        result = require(path.join(process.cwd(), 'secret-safe.config.js'));
      }
      catch(e) {
        if (e instanceof Error && e.code != "MODULE_NOT_FOUND") {
          throw e;
        }
      }
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
  stageFile,
  createTmpDir,
  loadJson,
  storeJson,
  getConfig,
  deleteFile,
  fetchUsersPreCommitHook,
  fetchUsersPostCommitHook,
  execShellCommand,
}