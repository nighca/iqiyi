var myCli = require('../kit/cli');
var config = require('../kit/config');
var kit = require('../kit');
var exec = require('child_process').exec;
var output = require('../kit/output');

var action = function(){
    var root = config().root;
    if(!root){
        myCli
            .begin()
            .fail('Failed to get status.')
            .end();
        output.noRootFault();
        kit.terminate();
    }

    myCli
        .begin()
        .write('Root:')
        .tell(root)
        .end();

    var currBranch = kit.getCurrBranch(root);
    myCli
        .begin()
        .write('Current branch:')
        .tell(currBranch)
        .end();

    var workingDirectory = kit.getWorkingDirectory(root);
    var cmd = 'svn status';
    exec(cmd, {cwd: workingDirectory}, function (error, stdout, stderr) {
        myCli
            .begin()
            .write('Current branch status:')
            .end();
        myCli.print(stdout);

        if(error){
            myCli
                .begin()
                .fail('Current branch status failed:')
                .end();
            myCli.print(stderr);
        }
    });
};

module.exports = action;
