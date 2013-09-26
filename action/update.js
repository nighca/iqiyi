var exec = require('child_process').exec;
var path = require('path');

var myCli = require('../kit/cli');
var pathname = require('../kit/pathname');
var config = require('../kit/config')();
var kit = require('../kit');

var action = function(){
    var root = config.root;
    if(!root){
        myCli
            .begin()
            .fail('Failed to checkout directory.')
            .end();
        output.noRootFault();
        kit.terminate();
    }

    var workingDirectory = kit.getWorkingDirectory(root);
    var cmd = 'svn update';
    exec(cmd, {cwd: workingDirectory}, function (error, stdout, stderr) {
        myCli
            .begin()
            .write('Output:')
            .end();
        myCli.print(stdout);

        if(error){
            myCli
                .begin()
                .fail('Err:')
                .end();
            myCli.print(stderr);
        }
    });
};

module.exports = action;