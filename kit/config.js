var fs = require('fs');
var path = require('path');
var pkg = require('../package.json');

var myCli = require('./cli');

var config;

var commonConfigFolder = path.join(process.env['HOME'], '.config');
var configFolder = path.join(commonConfigFolder, pkg.name);
var configFile = path.join(configFolder, 'config.json');

var readConfig = function(){
    if(!fs.existsSync(commonConfigFolder)){
        kit.mkDir(commonConfigFolder);
    }

    if(!fs.existsSync(configFolder)){
        kit.mkDir(configFolder);
    }

    if(!fs.existsSync(configFile)){
        fs.writeFileSync(configFile, '{}');
    }

    return JSON.parse(fs.readFileSync(configFile, {encoding:'utf8'}));
};

var writeConfig = function(config){
    return fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
};

var dealConfig = function(cfg){
    if(!config){
        try{
            config = readConfig();
        }catch(e){
            myCli
                .begin()
                .fail('Read config failed.')
                .end();
            myCli
                .begin()
                .write(JSON.stringify(e))
                .end();
            process.exit();
        }
        config.pkg = pkg;
    }

    if(cfg){
        try{
            writeConfig(cfg);
        }catch(e){
            myCli
                .begin()
                .fail('Write config failed.')
                .end();
            myCli
                .begin()
                .write(JSON.stringify(e))
                .end();
            process.exit();
        }
        config = cfg;
    }

    return config;
};

module.exports = dealConfig;
