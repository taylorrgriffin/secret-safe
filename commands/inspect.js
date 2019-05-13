#!/usr/bin/env node
var hash = false;
const fs = require('fs');
const [,, ...args] = process.argv;
const { secretsStore } = require('../vars');

// Check for proper usage
if (args.length > 1) {
    console.error("Error: wrong number of parameters passed.\nUSAGE: inspect [OPTIONAL: -hash]");
    return;
}
else {
    // handle any passed arguments
    if (args.length == 1) {
        switch(args[0]) {
            case '-hash':
                hash = true;
                break;
            default:
                break;
        }
    }
    if (fs.existsSync(secretsStore)) {
        fs.readFile(secretsStore, (err, data) => {
            if (err) {
                throw err;
            }
            else {
                console.log("Secrets being protected by secret-savr...");
                var secrets = JSON.parse(data).secrets;
                secrets.forEach(secret => {
                    // print secret messages, print hashes if hash option is passed
                    console.log(' * ' + secret.msg + (hash ? ': ' + secret.id : ''));
                });
            }
        });
    }
    else {
        console.log("Hm it looks like you're not protecting any secrets yet. Better run `protect [secret]` to fix that.");
    }
}