var path = require('path');
var fs = require('fs');

var myCli = require('../kit/cli');
var config = require('../kit/config');
var kit = require('../kit');

var action = function(root){
    var program = this;
    var doUse = function(root){
        root = path.resolve(process.cwd(), root);
        if(!fs.existsSync(root)){
            myCli
                .begin()
                .write('Failed to set root.')
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
            .write('Set root finished.')
            .end();
        myCli
            .begin()
            .write('Current root:')
            .tell(root)
            .end();

        kit.terminate();
    };

    var promptRoot = function(){
        myCli
            .begin()
            .tell('Input the path of dev folder:')
            .end();
        program.prompt('    ', function(root){
            if(!root){
                promptRoot();
            }else{
                doUse(root);
            }
        });
    };

    if(root){
        doUse(root);
    }else{
        promptRoot();
    }
};

module.exports = action;