var TmodJS = require('tmodjs');
var fs = require('fs');
var path = require('path');
var myCli = require('../kit/cli');
var config = require('../kit/config')();

var options = {
    output: './build',
    charset: 'utf-8',
    debug: true,
    type: 'cmd'
};

var templateFolder = './';

if(config.templateRoot){
    var configFilePath = path.join(config.templateRoot, 'template.json');
    if(fs.existsSync(configFilePath)){
        options = require(configFilePath);
    }
    templateFolder = options.templateFolder || path.join(config.templateRoot, templateFolder);
}

var action = function(op, f){

    switch(op){

    case 'compile':
        f = f || templateFolder;

        TmodJS.init(f, options);

        TmodJS.compile('', true);

        break;

    case 'watch':
        f = f || templateFolder;

        TmodJS.init(f, options);

        TmodJS.watch();

        break;

    default:
        myCli.printFail('Wrong operation!');
    }
};

module.exports = action;
