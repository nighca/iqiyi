var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

var fsplus = require('../kit/fsplus');
var myCli = require('../kit/cli');
var config = require('../kit/config')();
var kit = require('../kit');
var output = require('../kit/output');
var pathname = require('../kit/pathname');

var action = function(addr, branch){
    var root = config.root;
    if(!root){
        myCli
            .begin()
            .fail('Failed to create a branch.')
            .end();
        output.noRootFault();
        kit.terminate();
    }

    var program = this;
    var doCreate = function(addr, branch){
        var directory = path.join(root, pathname.branchFolder, branch);
        if(!fs.existsSync(directory)){
            fsplus.mkDir(directory);
        }

        var cmd = ['svn', 'checkout', addr, pathname.projectFolder].join(' ');
        exec(cmd, {cwd: directory}, function (error, stdout, stderr) {
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
            }else{
                myCli
                    .begin()
                    .write('Branch')
                    .tell(branch)
                    .write('created.')
                    .end();
            }
            kit.terminate();
        });
    };

    var promptBranch = function(){
        var br;

        var madeByServerPattern = /\/[0-9]+\_([^\_]+)\_[a-zA-Z]+$/;
        if(madeByServerPattern.test(addr)){
            br = madeByServerPattern.exec(addr)[1];
            doCreate(addr, br);
            return;
        }

        var normalPattern = /\/([^\/]+)$/;
        if(normalPattern.test(addr)){
            br = normalPattern.exec(addr)[1];
            doCreate(addr, br);
            return;
        }

        myCli
            .begin()
            .tell('Input the branch name:')
            .end();
        program.prompt('    ', function(br){
            if(!br){
                promptBranch();
            }else{
                doCreate(addr, br);
            }
        });
    };

    var promptAddress = function(){
        myCli
            .begin()
            .tell('Input the addr of repository:')
            .end();
        program.prompt('    ', function(ad){
            if(!ad){
                promptAddress();
            }else{
                addr = ad;
                promptBranch();
            }
        });
    };

    if(addr && branch){
        doCreate(addr, branch);
    }else if(addr){
        promptBranch();
    }else{
        promptAddress();
    }
};

module.exports = action;