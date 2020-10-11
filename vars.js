const preCommitHooksFile = ".git/hooks/pre-commit";
const postCommitHooksFile = ".git/hooks/post-commit";

const secretSafePreCommit = "\nsecret-safe pre-commit\n";
const secretSafePostCommit = "\nsecret-safe post-commit\n";

const SECRET_SAFE_TMP_DIR = '.git/secret-safe-tmp';
const GIT_STAGED_FILES = "git diff --cached --name-only --diff-filter=ACMR";

module.exports = {
  preCommitHooksFile,
  postCommitHooksFile,
  secretSafePreCommit,
  secretSafePostCommit,
  SECRET_SAFE_TMP_DIR,
  GIT_STAGED_FILES,
};
