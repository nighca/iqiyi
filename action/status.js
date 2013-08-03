var myCli = require('../kit/cli');
var config = require('../kit/config');
var kit = require('../kit');

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
};

module.exports = action;
