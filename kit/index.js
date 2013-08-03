var fs = require('fs');

var pathname = require('./pathname');
var output = require('./output');

var terminate = exports.terminate = function(){
    process.exit();
};

var readFile = exports.readFile = function(path){
    try{
        var cnt = fs.readFileSync(path, {encoding:'utf8'});
    }catch(e){
        output.readFileFault(path, e);
        terminate();
    }

    return cnt;
};

var writeFile = exports.writeFile = function(path, cnt){
    try{
        var ret = fs.writeFileSync(path, cnt);
    }catch(e){
        output.writeFileFault(path, e);
        terminate();
    }

    return ret;
};

var readDir = exports.readDir = function(path, cnt){
    try{
        var ret = fs.readdirSync(path);
    }catch(e){
        output.readDirFault(path, e);
        terminate();
    }

    return ret;
};

var mkDir = exports.mkDir = function(path, cnt){
    try{
        var ret = fs.mkdirSync(path);
    }catch(e){
        output.mkDirFault(path, e);
        terminate();
    }

    return ret;
};

exports.getBranchList = function(root){
    var branchList = readDir(pathname.branchPath);
    return branchList;
};

exports.getCurrBranch = function(root){
    var ruleCnt = readFile(pathname.ruleFile);

    var pattern = /RewriteRule\s\.\*\s\w+\:\/\/[\w\.]+\/([\w\/]+)\/\$0\s\[P\]/;
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
