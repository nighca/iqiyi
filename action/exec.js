var exec = require('child_process').exec;

var myCli = require('../kit/cli');
var config = require('../kit/config')();
var kit = require('../kit');
var output = require('../kit/output');

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
    var cmdArr = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
    exec(cmdArr.join(' '), {cwd: workingDirectory}, function (error, stdout, stderr) {
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