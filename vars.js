const preCommitHooksFile = ".git/hooks/pre-commit";
const postCommitHooksFile = ".git/hooks/post-commit";

const secretSafePreCommit = "\nsecret-safe pre-commit\n";
const secretSafePostCommit = "\nsecret-safe post-commit\n";

module.exports = {
  preCommitHooksFile,
  postCommitHooksFile,
  secretSafePreCommit,
  secretSafePostCommit,
};
