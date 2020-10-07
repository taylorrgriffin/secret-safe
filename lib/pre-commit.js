const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const preCommit = ({ secrets, verbose }) => {
  console.info("=== Secret-Safe pre-commit script ===");
  if (secrets) {
    // get list of non-deleted staged files
    exec("git diff --cached --name-only --diff-filter=ACMR", (error, stdout) => {
      if (error) {
        throw new Error(error);
      }
      // iterate through list of non-deleted staged files
      stdout.split("\n").slice(0, -1).forEach(file => {
        // looks for files which match the secret config
        if (secrets.includes(file)) {
          let ext = path.extname(file);
          // ensure secret file is a JSON
          if (ext === '.json') {
            fs.readFile(file, 'utf8', (err, data) => {
              if (err) {
                throw err;
              }
              // parse JSON into object
              var obj = JSON.parse(data);

              // set all values in object to blanks
              Object.keys(obj).forEach((key) => {
                obj[key] = "";
              });
              
              // write JSON object back into file
              fs.writeFile(file, JSON.stringify(obj), 'utf8', (err) => {
                if (err) {
                  throw err;
                }
              })
            });
          }
          else {
            throw new Error(`Invalid file type: ${file}`);
          }
        }
      });
    });
  }
}

module.exports = {
  preCommit,
}