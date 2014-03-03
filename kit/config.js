var fs = require('fs');
var path = require('path');
var pkg = require('../package.json');

var fsplus = require('./fsplus');
var myCli = require('./cli');

var config;

var commonConfigFolder = path.join(process.env['HOME'], '.config');
var configFolder = path.join(commonConfigFolder, pkg.name);
var configFile = path.join(configFolder, 'config.json');

var defaultConfig = {
    root: '~/'
};

var readConfig = function(){
    if(!fs.existsSync(commonConfigFolder)){
        fsplus.mkDir(commonConfigFolder);
    }

    if(!fs.existsSync(configFolder)){
        fsplus.mkDir(configFolder);
    }

    if(!fs.existsSync(configFile)){
        fs.writeFileSync(configFile, JSON.stringify(defaultConfig));
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
        delete cfg.pkg;
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
