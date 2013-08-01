#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var program = require('commander');

var pkg = require("./package.json");

var cli = require('./lib/node-cli');
var myCli = {
    succ: function(){
        cli.color('green');
        this.write.apply(this, arguments);
        cli.reset();
        return this;
    },
    fail: function(){
        cli.color('red');
        this.write.apply(this, arguments);
        cli.reset();
        return this;
    },
    tell: function(){
        cli.color('blue');
        this.write.apply(this, arguments);
        cli.reset();
        return this;
    },
    begin: function(){
        cli.color('blue');
        this.write('>>>');
        cli.reset();
        return this;
    },
    end: function(){
        cli.write('\n');
        return this;
    },
    write: function(){
        var cnt;
        for (var i = 0; i < arguments.length; i++) {
            cnt = typeof arguments[i] === 'object' || typeof arguments[i] === 'object' ?
                JSON.stringify(arguments[i]) :
                arguments[i];
            cli.write(cnt + ' ');
        }
        return this;
    },
    print: function(){
        this.write.apply(this, arguments);
        this.end();
        return this;
    }
};

var terminate = function(){
    process.exit();
};

var trunkFolder = '__trunk__';
var trunkName = 'trunk';
var branchFolder = '__branch__';

var staticPath = path.join(__dirname, 'static');
var configFileName = '.htaccess';
var rootHtaccess = path.join(staticPath, 'root' + configFileName);
var jsHtaccess = path.join(staticPath, 'js' + configFileName);
var branchHtaccess = path.join(staticPath, 'branch' + configFileName);

var config = function(cfg){
    var commonConfigFolder = path.join(process.env['HOME'], '.config');
    if(!fs.existsSync(commonConfigFolder)){
        fs.mkdirSync(commonConfigFolder);
    }
    var configFolder = path.join(commonConfigFolder, pkg.name);
    if(!fs.existsSync(configFolder)){
        fs.mkdirSync(configFolder);
    }
    var configFile = path.join(configFolder, 'config.json');
    if(!fs.existsSync(configFile)){
        fs.writeFileSync(configFile, '{}');
    }
    var config = JSON.parse(fs.readFileSync(configFile, {encoding:'utf8'}));

    if(cfg){
        config = cfg;
        fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
    }
    return config;
};

var noRootFault = function(){
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

var getBranchList = function(root){
    var branchPath = path.join(root, branchFolder);
    var branchList = fs.readdirSync(branchPath);
    return branchList;
};

var checkoutRewriteRule = function(root, branch){
    var ruleFile = path.join(root, 'js', '.htaccess');
    var jsHtaccessCnt = fs.readFileSync(jsHtaccess, {encoding:'utf8'});

    fs.writeFileSync(ruleFile, jsHtaccessCnt.replace(/__trunk__/g, branch));
};

var addLocalRewriteRule = function(root, branch){
    var ruleFile = path.join(root, branch, '.htaccess');
    var branchHtaccessCnt = fs.readFileSync(branchHtaccess, {encoding:'utf8'});

    fs.writeFileSync(ruleFile, branchHtaccessCnt);
};

var checkout = function(branch){
    var root = config().root;

    if(branch.trim() === trunkName){
        branch = trunkFolder;
    }else{
        branch = path.join(branchFolder, branch);
    }

    checkoutRewriteRule(root, branch);
    addLocalRewriteRule(root, branch);
};

var useAction = function(root){
    var doUse = function(root){
        root = path.resolve(process.cwd(), root);
        try{
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
        }catch(e){
            myCli
                .begin()
                .write('Failed to set root.')
                .end();
            myCli
                .begin()
                .fail(e)
                .end();
        }
        terminate();
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

var initAction = function(root){
    var initFiles = function(root){
        var dirs = [
            'js',
            'css',
            trunkFolder,
            branchFolder,
            'proj'
        ];
        
        for (var i = dirs.length - 1; i >= 0; i--) {
            fs.mkdirSync(path.join(root, dirs[i]));
        };
        
        var rootHtaccessCnt = fs.readFileSync(rootHtaccess, {encoding:'utf8'});
        var jsHtaccessCnt = fs.readFileSync(jsHtaccess, {encoding:'utf8'});
        var branchHtaccessCnt = fs.readFileSync(branchHtaccess, {encoding:'utf8'});
        fs.writeFileSync(path.join(root, '.htaccess'), rootHtaccessCnt);
        fs.writeFileSync(path.join(root, 'js', '.htaccess'), jsHtaccessCnt);
        fs.writeFileSync(path.join(root, trunkFolder, '.htaccess'), branchHtaccessCnt);
    };
    var doInit = function(root){
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
            terminate();
        }
        try{
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
        }catch(e){
            myCli
                .begin()
                .write('Failed to save root.')
                .end();
            myCli
                .begin()
                .fail(e)
                .end();
            terminate();
        }
        try{
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
        }catch(e){
            myCli
                .begin()
                .write('Failed to init files.')
                .end();
            myCli
                .begin()
                .fail(e)
                .end();
            terminate();
        }
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

var checkoutAction = function(branch){
    var root = config().root;
    if(!root){
        myCli
            .begin()
            .fail('Failed to checkout.')
            .end();
        noRootFault();
        terminate();
    }
    var branchList = getBranchList(root);

    var isValidBranch = function(branch){
        for (var i = branchList.length - 1; i >= 0; i--) {
            if(branchList[i].trim() == branch.trim()){
                return true;
            }
        };
        return false;
    };

    var doCheckout = function(branch){
        try{
            checkout(branch);
            myCli
                .begin()
                .write('Checkout finished.')
                .end();
            myCli
                .begin()
                .write('Current branch:')
                .tell(branch)
                .end();
        }catch(e){
            myCli
                .begin()
                .write('Failed to checkout.')
                .end();
            myCli
                .begin()
                .fail(e).end();
        }
        terminate();
    };

    var promptCheckout = function(){
        branchList.unshift(trunkName);
        myCli
            .begin()
            .tell('Choose a branch to checkout to:').end();
        program.choose(branchList, function(i){
            doCheckout(branchList[i]);
        });
    };

    if(branch && isValidBranch(branch)){
        doCheckout(branch);
    }else{
        promptCheckout();
    }
};

var getCurrBranch = function(root){
    var ruleFile = path.join(root, 'js', '.htaccess');
    var ruleCnt = fs.readFileSync(ruleFile, {
        encoding: 'utf8'
    });

    var pattern = /RewriteRule\s\.\*\s\w+\:\/\/[\w\.]+\/([\w\/]+)\/\$0\s\[P\]/;
    var branch = pattern.test(ruleCnt) && pattern.exec(ruleCnt)[1];
    if(branch){
        if(branch == trunkFolder){
            branch = trunkName;
        }else if(branch.indexOf(branchFolder) === 0){
            branch = branch.slice(branchFolder.length + 1);
        }
    }

    return branch;
};

var branchAction = function(){
    var root = config().root;
    if(!root){
        myCli
            .begin()
            .fail('Failed to list branches.')
            .end();
        noRootFault();
        terminate();
    }
    var branchList = getBranchList(root);
    branchList.unshift(trunkName);

    var currBranch = getCurrBranch(root);

    myCli
        .begin()
        .tell('All branches:')
        .end();
    for (var i = 0, l = branchList.length, branch; i < l; i++) {
        branch = branchList[i];
        if(branch == currBranch){
            myCli
                .begin()
                .tell(i+1)
                .tell('[CURRENT]')
                .tell(branchList[i]).end();
        }else{
            myCli
                .begin()
                .write(i+1)
                .write('         ')
                .write(branchList[i]).end();
        }
    };
    terminate();
};

var statusAction = function(){
    var root = config().root;
    if(!root){
        myCli
            .begin()
            .fail('Failed to get status.')
            .end();
        noRootFault();
        terminate();
    }

    myCli
        .begin()
        .write('Root:')
        .tell(root)
        .end();

    var currBranch = getCurrBranch(root);
    myCli
        .begin()
        .write('Current branch:')
        .tell(currBranch)
        .end();
};

program.version(pkg.version);

var cmds = [
    {
        command: 'init [root]',
        description: 'give a path & init it',
        action: initAction
    },
    {
        command: 'use [root]',
        description: 'use folder which already occurs',
        action: useAction
    },
    {
        command: 'checkout [branch]',
        description: 'checkout to a branch',
        action: checkoutAction
    },
    {
        command: 'branch',
        description: 'show all branches',
        action: branchAction
    },
    {
        command: 'status',
        description: 'show status',
        action: statusAction
    }
];

for (var i = 0, l = cmds.length, cmd; i < l; i++) {
    cmd = cmds[i];
    program
        .command(cmd.command)
        .description(cmd.description)
        .action(cmd.action);
};

program.parse(process.argv);

