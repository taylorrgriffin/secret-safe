const path = require("path");

const preCommitHooksFile = ".git/hooks/pre-commit";
const postCommitHooksFile = ".git/hooks/post-commit";

const secretSafePreCommit = "./node_modules/@taylorrgriffin/secret-safe/bin/index.js pre-commit";
const secretSafePostCommit = "./node_modules/@taylorrgriffin/secret-safe/bin/index.js post-commit";
// const secretSafePreCommitGlobal = "secret-safe pre-commit";
// const secretSafePostCommitGlobal = "secret-safe post-commit";

const SECRET_SAFE_TMP_DIR = '.git/secret-safe-tmp';
const LEDGER = path.join(SECRET_SAFE_TMP_DIR, "ledger.json");

const GIT_STAGED_FILES = "git diff --cached --name-only --diff-filter=ACMR";

module.exports = {
  preCommitHooksFile,
  postCommitHooksFile,
  secretSafePreCommit,
  secretSafePostCommit,
  SECRET_SAFE_TMP_DIR,
  GIT_STAGED_FILES,
  LEDGER,
};
