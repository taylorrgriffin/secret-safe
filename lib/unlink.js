const fs = require('fs');
const rimraf = require('rimraf');
const { errorHandler, fetchUsersPreCommitHook, fetchUsersPostCommitHook } = require('../lib/utils');
const {
  secretSafePreCommit,
  secretSafePostCommit,
  postCommitHooksFile,
  preCommitHooksFile,
  SECRET_SAFE_TMP_DIR } = require('../vars');

const unlink = ({ verbose }) => {
  // obtain user's pre and post commit hooks
  let preCommitHook = fetchUsersPreCommitHook();
  let postCommitHook = fetchUsersPostCommitHook();

  if (preCommitHook.includes(secretSafePreCommit)) {
    // remove secret-safe pre-commit script from pre-commit hook
    fs.writeFile(preCommitHooksFile, preCommitHook.replace(secretSafePreCommit, ''), 'utf8', (err) => {
      errorHandler(err);
    });
  }

  if (postCommitHook.includes(secretSafePostCommit)) {
    // remove secret-safe post-commit script from post-commit hook
    fs.writeFile(postCommitHooksFile, postCommitHook.replace(secretSafePostCommit, ''), 'utf8', (err) => {
      errorHandler(err);
    })
  }

  // delete tmp dir in
  rimraf(SECRET_SAFE_TMP_DIR, (error) => {
    errorHandler(error);
  })
}

module.exports = {
  unlink,
}