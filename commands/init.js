const fs = require('fs');
const {
  // config,
  // sampleConfig,
  preCommitHooksFile,
  postCommitHooksFile,
  // secretSafePreCommit,
  // secretSafePostCommit
  preCommitJsHookFile,
  postCommitJsHookFile
} = require('../vars');

const { errorHandler } = require('../src/utils');

let secretSafePreCommit = `./${preCommitJsHookFile}\n`
let secretSafePostCommit = `./${postCommitJsHookFile}\n`

// TODO: figure out config stuff
// create default secret safe config if user hasn't created a config file yet
// if (!fs.existsSync(config)) {
//   fs.copyFile(sampleConfig, config, (err) => {
//     if (err) {
//       throw err;
//     }
//   });
// }

let verbose = true;

// load user's current pre-commit hook
let preCommitHook = fs.existsSync(preCommitHooksFile) ? fs.readFileSync(preCommitHooksFile) : '';

// add secret safe's pre-commit hook if the user's doesn't include it already
if (!preCommitHook.includes(secretSafePreCommit)) {

  verbose && console.info("Adding secret-safe to pre-commit");
  fs.appendFile(preCommitHooksFile, '\n' + secretSafePreCommit, 'utf8', (err) => {
    errorHandler(err);
  });

  verbose && console.info("Copying pre-commit js script to .git/hooks")
  fs.copyFile('pre-commit.js', preCommitJsHookFile, (err) => {
    errorHandler(err);

    verbose && console.info("Setting permissions on pre-commit js script (-rwxr-xr-x)");
    fs.chmod(preCommitJsHookFile, 0o755, (err) => {
      errorHandler(err);
    });
  });

  // verbose && console.info("Setting permissions on pre-commit hook (-rwxr-xr-x)");
  // fs.chmod(preCommitHooksFile, 0o755, (err) => {
  //   errorHandler(err);
  // });
}
else {
  verbose && console.info("Pre-commit hook is already staged, skipping.");
}

// load user's current post-commit hook
let postCommitHook = fs.existsSync(postCommitHooksFile) ? fs.readFileSync(postCommitHooksFile) : '';

// add secret safe's post-commit hook if the user's doesn't include it already
if (!postCommitHook.includes(secretSafePostCommit)) {

  verbose && console.info("Adding secret-safe to post-commit");
  fs.appendFile(postCommitHooksFile, '\n' + secretSafePostCommit, 'utf8', (err) => {
    errorHandler(err);
  });

  verbose && console.info("Copying post-commit js script to .git/hooks")
  fs.copyFile('post-commit.js', postCommitJsHookFile, (err) => {
    errorHandler(err);

    verbose && console.info("Setting permissions on post-commit js script (-rwxr-xr-x)");
    fs.chmod(postCommitJsHookFile, 0o755, (err) => {
      errorHandler(err);
    });
  });

  // TODO: figure out why these statements are broken / not necessary
  // verbose && console.info("Setting permissions on post-commit hook (-rwxr-xr-x)");
  // fs.chmod(postCommitHooksFile, 0o755, (err) => {
  //   errorHandler(err);
  // });
}
else {
  verbose && console.info("Post-commit hook is already staged, skipping.");
}