const fs = require('fs');
const {
  preCommitHooksFile,
  postCommitHooksFile,
  secretSafePreCommit,
  secretSafePostCommit
} = require('../vars');

const { errorHandler } = require('../src/utils');

let verbose = true;

const init = () => {
  // obtain user's pre and post commit hooks
  let preCommitHook = fs.existsSync(preCommitHooksFile) ? fs.readFileSync(preCommitHooksFile) : '';
  let postCommitHook = fs.existsSync(postCommitHooksFile) ? fs.readFileSync(postCommitHooksFile) : '';

  // add call to secret safe's pre-commit script to user's pre-commit hook
  if (!preCommitHook.includes(secretSafePreCommit)) {
    verbose && console.info("Adding secret-safe to pre-commit");
    fs.appendFile(preCommitHooksFile, '\n' + secretSafePreCommit, 'utf8', (err) => {
      errorHandler(err);

      // set permissions on pre-commit to -rwxr-xr-x
      verbose && console.info("Setting permissions on pre-commit hook (-rwxr-xr-x)");
      fs.chmod(preCommitHooksFile, 0o755, (err) => {
        errorHandler(err);
      });
    });
  }
  else {
    verbose && console.info("Pre-commit hook is already staged, skipping.");
  }

  // add call to secret safe's post-commit script to user's post-commit hook
  if (!postCommitHook.includes(secretSafePostCommit)) {
    verbose && console.info("Adding secret-safe to post-commit");
    fs.appendFile(postCommitHooksFile, '\n' + secretSafePostCommit, 'utf8', (err) => {
      errorHandler(err);

      // set permissions on post-commit to -rwxr-xr-x
      verbose && console.info("Setting permissions on post-commit hook (-rwxr-xr-x)");
      fs.chmod(postCommitHooksFile, 0o755, (err) => {
        errorHandler(err);
      });
    });
  }
  else {
    verbose && console.info("Post-commit hook is already staged, skipping.");
  }
}

module.exports = {
  init,
}