#!/usr/bin/env node
const [,, ...args] = process.argv;
const { protect } = require("../src/protect");

if (args.length != 1) {
    console.error("Error: wrong number of parameters passed.\nUSAGE: protect [secret]");
}
else {
    let secret = args;
    protect(secret);
}


