var myCli = require('../kit/cli');
var kit = require('../kit');

var pathname = require('../kit/pathname');

var action = function(){
    var root = pathname.root;
    if(!root){
        myCli
            .begin()
            .fail('Failed to list branches.')
            .end();
        output.noRootFault();
        kit.terminate();
    }
    var branchList = kit.getBranchList(root);
    branchList.unshift(pathname.trunkName);

    var currBranch = kit.getCurrBranch(root);

    myCli
        .begin()
        .tell('All branches:')
        .end();
    for (var i = 0, l = branchList.length, branch; i < l; i++) {
        branch = branchList[i];
        if(branch == currBranch){
            myCli
                .begin()
                .tell(i+1)
                .tell('[CURRENT]')
                .tell(branchList[i]).end();
        }else{
            myCli
                .begin()
                .write(i+1)
                .write('         ')
                .write(branchList[i]).end();
        }
    };
    kit.terminate();
};

module.exports = action;
