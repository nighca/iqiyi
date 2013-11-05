var path = require('path');
var exec = require('child_process').exec;

var myCli = require('../kit/cli');
var pathname = require('../kit/pathname');
var config = require('../kit/config');
var kit = require('../kit');
var output = require('../kit/output');

var action = function(){
    var cfg = config();
    var root = cfg.root;
    var terminal = cfg.terminal || 'gnome-terminal';

    if(!root){
        myCli
            .begin()
            .fail('Failed to goto working directory.')
            .end();
        output.noRootFault();
        kit.terminate();
    }

    var currBranch = kit.getCurrBranch(root);
    var workingDirectory = path.join(root, pathname.branchFolder, currBranch);
    
    exec(terminal, {cwd: workingDirectory}, function (error, stdout, stderr) {
        if(error){
            myCli
                .begin()
                .fail('Err:')
                .end();
            myCli.print(stderr);
            myCli
                .begin()
                .write('Seems that')
                .tell(terminal)
                .write('is not installed or not added to PATH')
                .end();
            myCli
                .begin()
                .write('Use')
                .tell(cfg.pkg.name, 'config terminal')
                .write('to set your own terminal.')
                .end();
        }
    });
};

module.exports = action;
