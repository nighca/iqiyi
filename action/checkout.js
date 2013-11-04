var path = require('path');

var myCli = require('../kit/cli');
var fsplus = require('../kit/fsplus');
var pathname = require('../kit/pathname');
var kit = require('../kit');

var checkoutRewriteRule = function(root, branch){
    var ruleFile = path.join(root, 'js', '.htaccess');
    var jsHtaccessCnt = fsplus.readFile(pathname.jsHtaccess);

    fsplus.writeFile(ruleFile, jsHtaccessCnt.replace(/__trunk__/g, branch));
};

var addLocalRewriteRule = function(root, branch){
    var ruleFile = path.join(root, branch, '.htaccess');
    var branchHtaccessCnt = fsplus.readFile(pathname.branchHtaccess);

    fsplus.writeFile(ruleFile, branchHtaccessCnt);
};

var checkout = function(branch){
    var root = pathname.root;

    if(branch.trim() === pathname.trunkName){
        branch = pathname.trunkFolder;
    }else{
        branch = path.join(pathname.branchFolder, branch);
    }

    checkoutRewriteRule(root, branch);
    addLocalRewriteRule(root, branch);
};

var action = function(branch){
    var root = pathname.root;
    var program = this;
    if(!root){
        myCli
            .begin()
            .fail('Failed to checkout.')
            .end();
        output.noRootFault();
        kit.terminate();
    }
    var branchList = kit.getBranchList(root);

    var isValidBranch = function(branch){
        for (var i = branchList.length - 1; i >= 0; i--) {
            if(branchList[i].trim() == branch.trim()){
                return true;
            }
        };
        return false;
    };

    var doCheckout = function(branch){
        checkout(branch);
        myCli
            .begin()
            .write('Checkout finished.')
            .end();
        myCli
            .begin()
            .write('Current branch:')
            .tell(branch)
            .end();
        kit.terminate();
    };

    var promptCheckout = function(){
        myCli
            .begin()
            .tell('Choose a branch to checkout to:').end();
        program.choose(branchList, function(i){
            doCheckout(branchList[i]);
        });
    };

    if(branch && isValidBranch(branch)){
        doCheckout(branch);
    }else{
        promptCheckout();
    }
};

module.exports = action;