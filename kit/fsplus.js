var fs = require('fs');
var path = require('path');

var output = require('./output');

var terminate = require('./terminate');

exports.readFile = function(path){
    try{
        var cnt = fs.readFileSync(path, {encoding:'utf8'});
    }catch(e){
        output.readFileFault(path, e);
        terminate();
    }

    return cnt;
};

exports.writeFile = function(path, cnt){
    try{
        var ret = fs.writeFileSync(path, cnt);
    }catch(e){
        output.writeFileFault(path, e);
        terminate();
    }

    return ret;
};

exports.readDir = function(path, cnt){
    try{
        var ret = fs.readdirSync(path);
    }catch(e){
        output.readDirFault(path, e);
        terminate();
    }

    return ret;
};

exports.mkDir = function(path, cnt){
    try{
        var ret = fs.mkdirSync(path);
    }catch(e){
        output.mkDirFault(path, e);
        terminate();
    }

    return ret;
};