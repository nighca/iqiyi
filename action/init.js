var path = require('path');
var fs = require('fs');

var myCli = require('../kit/cli');
var pathname = require('../kit/pathname');
var config = require('../kit/config');
var fsplus = require('../kit/fsplus');
var kit = require('../kit');

var action = function(root){
    var initFiles = function(root){
        var dirs = [
            'js',
            'css',
            pathname.trunkFolder,
            pathname.branchFolder,
            'proj'
        ], dir;
        
        for (var i = dirs.length - 1; i >= 0; i--) {
            dir = path.join(root, dirs[i]);
            !fs.existsSync(dir) && fsplus.mkDir(dir);
        };
        
        var rootHtaccessCnt = fsplus.readFile(pathname.rootHtaccess);
        var jsHtaccessCnt = fsplus.readFile(pathname.jsHtaccess);
        var branchHtaccessCnt = fsplus.readFile(pathname.branchHtaccess);
        var rootHtaccessPath = path.join(root, '.htaccess');
        var jsHtaccessPath = path.join(root, 'js', '.htaccess');
        var branchHtaccessPath = path.join(root, pathname.trunkFolder, '.htaccess');
        !fs.existsSync(rootHtaccessPath) && fsplus.writeFile(rootHtaccessPath, rootHtaccessCnt);
        !fs.existsSync(jsHtaccessPath) && fsplus.writeFile(jsHtaccessPath, jsHtaccessCnt);
        !fs.existsSync(branchHtaccessPath) && fsplus.writeFile(branchHtaccessPath, branchHtaccessCnt);
    };
    var doInit = function(root){
        var program = this;
        root = path.resolve(process.cwd(), root);
        if(!fs.existsSync(root)){
            myCli
                .begin()
                .write('Failed to init.')
                .end();
            myCli
                .begin()
                .fail('The path:')
                .fail(root)
                .fail('does not exist!')
                .end();
            kit.terminate();
        }
        config({
            root: root
        });
        myCli
            .begin()
            .write('Root path Saved.')
            .end();
        myCli
            .begin()
            .write('Current root:')
            .tell(root)
            .end();
        
        initFiles(root);
        myCli
            .begin()
            .write('Files init finished.')
            .end();
        myCli
            .begin()
            .write('Folder path:')
            .tell(root)
            .end();
        kit.terminate();
    };

    var promptRoot = function(){
        myCli
            .begin()
            .tell('Input the path of folder to init:')
            .end();
        program.prompt('    ', function(root){
            if(!root){
                promptRoot();
            }else{
                doInit(root);
            }
        });
    };

    if(root){
        doInit(root);
    }else{
        promptRoot();
    }
};

module.exports = action;
