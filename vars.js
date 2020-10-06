const preCommitHooksFile = ".git/hooks/pre-commit";
const postCommitHooksFile = ".git/hooks/post-commit";
const preCommitJsHookFile = ".git/hooks/secret-safe-pre-commit.js"
const postCommitJsHookFile = ".git/hooks/secret-safe-post-commit.js"

const sampleConfig = "sample.config.js";
const config = "secret-safe.config.js";
const secretSafePreCommit = "pre-commit.sh";
const secretSafePostCommit = "post-commit.sh";

module.exports = {
  config,
  sampleConfig,
  preCommitHooksFile,
  postCommitHooksFile,
  secretSafePreCommit,
  secretSafePostCommit,
  preCommitJsHookFile,
  postCommitJsHookFile,
};
