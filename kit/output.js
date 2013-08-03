var myCli = require('./cli');

exports.noRootFault = function(){
    myCli
        .begin()
        .write('Please init a dev folder using')
        .tell('`iqiyi init [root]`')
        .end();
    myCli
        .begin()
        .write('Or set the path of your dev folder using')
        .tell('`iqiyi use [root]`')
        .end();
};

exports.readFileFault = function(path, e){
    myCli
        .begin()
        .fail('Read file ' + path + ' failed.')
        .end();
    myCli
        .begin()
        .write(JSON.stringify(e))
        .end();
};

exports.writeFileFault = function(path, e){
    myCli
        .begin()
        .fail('Write file ' + path + ' failed.')
        .end();
    myCli
        .begin()
        .write(JSON.stringify(e))
        .end();
};

exports.readDirFault = function(path, e){
    myCli
        .begin()
        .fail('Read directory ' + path + ' failed.')
        .end();
    myCli
        .begin()
        .write(JSON.stringify(e))
        .end();
};

exports.mkDirFault = function(path, e){
    myCli
        .begin()
        .fail('Make directory ' + path + ' failed.')
        .end();
    myCli
        .begin()
        .write(JSON.stringify(e))
        .end();
};