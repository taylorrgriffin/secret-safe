const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const { SECRET_SAFE_TMP_DIR } = require('../vars');
const { getStagedFiles, createTmpDir, loadJson, storeJson, stageFile } = require('./utils');

async function preCommit({ secrets, verbose, debug }) {
  verbose && console.info("=== Secret-Safe pre-commit script ===");
  if (secrets) {
    // fetch staged files
    let stagedFiles = await getStagedFiles();
    debug && console.info("=== Staged files: ");
    debug && stagedFiles.forEach(file => console.info(`===   ${file}`));

    // create tmp directory and ledger to keep track of files
    let tmpDir = await createTmpDir(SECRET_SAFE_TMP_DIR);
    let ledger = {};

    stagedFiles.forEach(async (file) => {
      if (secrets.includes(file)) {

        verbose && console.info(`=== Evaluating ${file}`);

        // ensure file is json format before modifying it
        if (path.extname(file) === '.json') {
          // record file in ledger
          let fileId = uuidv4();
          ledger[fileId] = file;

          // copy file to tmp dir
          fs.copyFileSync(file, `${tmpDir}/${fileId}.tmp.json`);

          verbose && console.info(`=== Wrote ${file} to ${tmpDir}`);
  
          // load contents of file into memory
          let obj = await loadJson(file);

          verbose && console.info(`=== Loaded ${file} into memory`);
          
          // set all values to blanks
          Object.keys(obj).forEach((key) => {
            obj[key] = "";
          });
  
          // write obj back to file
          await storeJson(file, obj);

          verbose && console.info(`=== Stored ${file} to file`);

          // stage modified file
          await stageFile(file);

          verbose && console.info(`=== Staged ${file}`);
        }
        else {
          console.warn(`=== WARNING: non-JSON file found, skipping: ${file}`);
        }
      }
    });

    // write ledger to tmp directory
    storeJson(`${tmpDir}/ledger.json`, ledger);
  }
}

module.exports = {
  preCommit,
}