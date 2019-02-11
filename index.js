module.exports={
    init:function() {
        const fs = require('fs');
        // if pre-commit exists, append rules to end of file
        if (fs.existsSync('.git/hooks/pre-commit')) {
            fs.readFile('pre-commit', 'utf8', function(err,rules) {
                fs.appendFileSync('.git/hooks/pre-commit',rules);
            });
        }
        // if it doesn't exist, add file and rules
        if (!fs.existsSync('.git/hooks/pre-commit')) {
            fs.copyFile('pre-commit','.git/hooks/pre-commit',(err)=>{
                if (err) throw err;
            });
        }
    }
}

module.exports.init();