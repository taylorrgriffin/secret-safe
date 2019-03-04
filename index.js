module.exports={
    /*** 
     * protect(secret)
     * preconditions: none
     * postconditions: pre-commit file within .git directory will protect supplied secret
    ***/
    protect:function(secret) {
        const fs = require('fs');
        if (fs.existsSync('secrets.json')) {
            module.exports.addSecret(secret)
        }
        else {
            module.exports.initSecrets(secret);
        }
        module.exports.stagePrecommit();
    },
    /***
     * initSecrets(secret)
     * preconditions: secrets.json doesn't exist
     * postconditions: supplied secret is added to secrets.json 
    ***/
    initSecrets:function(secret) {
        const fs = require('fs');
        var secrets = {
            secrets: []
        }
        var json = JSON.stringify(secrets);
        fs.writeFileSync('secrets.json', json, 'utf8');
        module.exports.addSecret(secret);
    },
    /*** 
     * addSecret(secret)
     * preconditons: secrets.json exists
     * postconditions: secret has been added to secrets.json
    ***/
    addSecret:function(secret) {
        const fs = require('fs');
        if (fs.existsSync('secrets.json')) {
            fs.readFile('secrets.json', 'utf8', function(err, data) {
                if (err) throw err;
                obj = JSON.parse(data);
                var hash = module.exports.generateDatetimeHash();
                obj.secrets.push({id: hash, msg: secret});
                json = JSON.stringify(obj);
                fs.writeFileSync('secrets.json', json, 'utf8', console.log(secret+" added to secrets.json"));
            });
        }
    },
    /***
     * stagePrecommit()
     * preconditions: at least one secret exists in secrets.json
     * postconditions: pre-commit script is added to .git directory 
    ***/
    stagePrecommit:function() {
        const fs = require('fs');
        // if pre-commit exists, append rules to end of file
        if (fs.existsSync('.git/hooks/pre-commit')) {
            fs.readFile('pre-commit', 'utf8', function(err,rules) {
                if (err) throw err;
                fs.appendFileSync('.git/hooks/pre-commit',rules);
            });
        }
        // if it doesn't exist, add file and rules
        if (!fs.existsSync('.git/hooks/pre-commit')) {
            fs.copyFile('pre-commit','.git/hooks/pre-commit',(err)=>{
                if (err) throw err;
            });
        }
    },
    generateDatetimeHash:function() {
        var date = new Date();

        var day = date.getDate();
        var month = date.getMonth();
        var year = date.getFullYear();
        var time = date.getTime();

        return(time ^ day ^ month ^ year);
    }
}

module.exports.protect('ABCDEF');
