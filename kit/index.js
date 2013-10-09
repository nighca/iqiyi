var path = require('path');

var fsplus = require('./fsplus');
var pathname = require('./pathname');
var output = require('./output');
var terminate = require('./terminate');

exports.getBranchList = function(root){
    var branchList = fsplus.readDir(pathname.branchPath);
    branchList.unshift(pathname.trunkName);
    
    return branchList;
};

var getCurrBranch = function(root){
    var ruleCnt = fsplus.readFile(pathname.ruleFile);

    var pattern = /RewriteRule\s\.\*\s\w+\:\/\/[\w\.]+\/([\w\/\-]+)\/\$0\s\[P\]/;
    var branch = pattern.test(ruleCnt) && pattern.exec(ruleCnt)[1];
    if(branch){
        if(branch == pathname.trunkFolder){
            branch = pathname.trunkName;
        }else if(branch.indexOf(pathname.branchFolder) === 0){
            branch = branch.slice(pathname.branchFolder.length + 1);
        }
    }

    return branch;
};

var getWorkingDirectory = function(root){
    var currBranch = getCurrBranch(root);
    return currBranch === pathname.trunkName ?
        path.join(root, pathname.trunkFolder, pathname.projectFolder) :
        path.join(root, pathname.branchFolder, currBranch, pathname.projectFolder);
};

exports.terminate = terminate;
exports.getCurrBranch = getCurrBranch;
exports.getWorkingDirectory = getWorkingDirectory;