# secret-safe

Secret Safe protects your secrets and keeps them from being commited.

Once installed and added to your project, secret-safe adds rules to your pre and post-commit hooks. Add the paths to your secret files in your config, and you're all set!

Now, when you commit a secret file, Secret Saver will remove the secret values before comitting, and will replace them after commiting. This allows you to commit the structure of your secrets.json, without fear of the values getting into source control.

## Install

````
npm install -g secret-safe
````

## Usage

Add secret-safe rules to your project and generate config:
````
secret-safe init
````

## Example Config

package.json:
````
{
  "name": "your-package",
  "secretSafe": {
    "secrets": ["secrets.json"]
  }
}
````

Or


secret-safe.config.js:
````
{
  "secrets": ["secrets.json"]
}
````