const fs = require("fs");
const { SECRET_SAFE_TMP_DIR, LEDGER } = require('../vars');
const { loadJson, storeJson, deleteFile } = require('./utils');

async function postCommit({ verbose }) {
  verbose && console.info("=== Secret-Safe post-commit script ===");

  let ledger = fs.existsSync(LEDGER) ? await loadJson(LEDGER) : null;

  if (ledger) {
    verbose && console.info("== Restoring files: ");
    // iterate through entries in ledger
    Object.keys(ledger).forEach(async (fileId) => {
      let filePath = ledger[fileId];
      let original = await loadJson(`${SECRET_SAFE_TMP_DIR}/${fileId}.tmp.json`);
      
      // restore original contents of file
      verbose && console.info(`==  Restoring ${filePath}`);
      await storeJson(filePath, original);
      
      // clean up tmp file
      deleteFile(`${SECRET_SAFE_TMP_DIR}/${fileId}.tmp.json`);
    });
  }
}

module.exports = {
  postCommit,
}