var path = require('path');

var myCli = require('../kit/cli');
var pathname = require('../kit/pathname');
var config = require('../kit/config');
var kit = require('../kit');

var action = function(){
    var root = config().root;
    if(!root){
        myCli
            .begin()
            .fail('Failed to checkout directory.')
            .end();
        output.noRootFault();
        kit.terminate();
    }

    var currBranch = kit.getCurrBranch(root);
    var workingDirectory = path.join(root, pathname.branchFolder, currBranch);
    console.log(workingDirectory);
    process.chdir(workingDirectory);
    //kit.terminate();
};

module.exports = action;
