const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { GIT_STAGED_FILES, SECRET_SAFE_TMP_DIR } = require('../vars');

/**
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @return {Promise<string>}
 */
function execShellCommand(cmd) {
  return new Promise((resolve, reject) => {
   exec(cmd, (error, stdout, stderr) => {
    if (error) {
     throw error;
    }
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
        if (err) {
          throw err;
        }
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
      if (err) {
        throw err;
      }
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
      if (err) {
        throw err;
      }
      resolve(); 
    });
  });
}

function deleteFile(file) {
  return new Promise((resolve, reject) => {
    fs.unlink(file, (err) => {
      if (err) {
        throw err;
      }
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

module.exports = {
  getStagedFiles,
  createTmpDir,
  loadJson,
  storeJson,
  getConfig,
  deleteFile,
}