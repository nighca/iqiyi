var path = require('path');
var fs = require('fs');

var myCli = require('../kit/cli');
var config = require('../kit/config');
var terminate = require('../kit/terminate');

var action = function(name, val){
    var program = this;
    var doConfig = function(name, val){
        var cfg = config();
        cfg[name] = val;
        config(cfg);
        myCli
            .begin()
            .write('Set config finished.')
            .end();
        myCli
            .begin()
            .write('Current config:')
            .tell(config())
            .end();

        terminate();
    };

    var promptVal = function(){
        myCli
            .begin()
            .tell('Input the value:')
            .end();
        program.prompt('    ', function(v){
            if(!v){
                promptVal();
            }else{
                doConfig(name, v);
            }
        });
    };

    var promptName = function(){
        myCli
            .begin()
            .tell('Input the name you want to config:')
            .end();
        program.prompt('    ', function(n){
            if(!n){
                promptName();
            }else{
                name = n;
                promptVal();
            }
        });
    };

    if(name && val){
        doConfig(name, val);
    }else if(name){
        promptVal();
    }else{
        promptName();
    }
};

module.exports = action;