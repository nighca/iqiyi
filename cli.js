#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var program = require('commander');

var cli = require('./lib/node-cli');
var pkg = require("./package.json");
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

var trunkFolder = '__trunk__';
var trunkName = 'trunk';
var branchFolder = '__branch__';

var config = function(cfg){
    var pkg = require(__dirname+"/package.json");
    pkg.config = pkg.config || {};

    if(cfg){
        pkg.config.iqiyi = cfg;
        fs.writeFileSync(__dirname+"/package.json", JSON.stringify(pkg, null, 2));
    }
    return pkg.config.iqiyi;
};

var getBranchList = function(root){
    var branchPath = path.join(root, branchFolder);
    var branchList = fs.readdirSync(branchPath);
    return branchList;
};

var checkoutRewriteRule = function(root, branch){
    var ruleFile = path.join(root, 'js', '.htaccess');
    var rules = [
        'RewriteEngine on',
        '',
        'RewriteCond %{HTTP_HOST} static.qiyi.com',
        'RewriteRule .* http://static.qiyi.com/' + branch + '/$0 [P]',
        '',
        '',
        'RewriteCond %{HTTP_HOST} static.iqiyi.com',
        'RewriteRule .* http://static.iqiyi.com/' + branch + '/$0 [P]',
        '',
        '',
        'RewriteCond %{HTTP_HOST} static.qiyipic.com',
        'RewriteRule .* http://static.qiyipic.com/' + branch + '/$0 [P]'
    ];

    fs.writeFileSync(ruleFile, rules.join('\n'));
};

var addLocalRewriteRule = function(root, branch){
    var ruleFile = path.join(root, branch, '.htaccess');
    var rules = [
        'RewriteEngine on',
        'RewriteCond %{REQUEST_FILENAME} !-f',
        'RewriteCond %{REQUEST_FILENAME} !-d',
        'RewriteRule ^(.*)$ http://202.108.14.56/js/$0 [P]'
    ];

    fs.writeFileSync(ruleFile, rules.join('\n'));
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

var rootAction = function(root){
    var svRoot = function(root){
        root = path.resolve(process.cwd(), root);
        try{
            config({
                root: root
            });
            myCli
                .begin()
                .write('Finished.')
                .end();
            myCli
                .begin()
                .write('Current root:')
                .succ(root).end();
        }catch(e){
            myCli
                .begin()
                .write('Failed.')
                .end();
            myCli
                .begin()
                .fail(e).end();
        }
        process.exit();
    };

    var promptSvRoot = function(){
        myCli
            .begin()
            .tell('Input the path of dev folder:')
            .end();
        program.prompt('    ', function(root){
            if(!root){
                promptSvRoot();
            }else{
                svRoot(root);
            }
        });
    };

    if(root){
        svRoot(root);
    }else{
        promptSvRoot();
    }
};

var checkoutAction = function(branch){
    var root = config().root;
    if(!root){
        myCli
            .begin()
            .fail('Failed.')
            .write('Please set the dev path first using')
            .write('`iqiyi root [root]`').end();
        process.exit();
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
                .write('Finished.')
                .end();
            myCli
                .begin()
                .write('Current branch:')
                .succ(branch).end();
        }catch(e){
            myCli
                .begin()
                .write('Failed.')
                .end();
            myCli
                .begin()
                .fail(e).end();
        }
        process.exit();
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
            .fail('Failed.')
            .write('Please set the dev path first using')
            .write('`iqiyi root [root]`').end();
        process.exit();
    }
    var branchList = getBranchList(root);
    branchList.unshift(trunkName);

    var currBranch = getCurrBranch(root);

    for (var i = 0, l = branchList.length, branch; i < l; i++) {
        branch = branchList[i];
        if(branch == currBranch){
            myCli
                .begin()
                .succ(i+1)
                .succ('CURRENT')
                .succ(branchList[i]).end();
        }else{
            myCli
                .begin()
                .write(i+1)
                .write('       ')
                .write(branchList[i]).end();
        }
    };
    process.exit();
};

program.version(pkg.version);

var cmds = [
    {
        command: 'root [root]',
        description: 'set the path of dev folder',
        action: rootAction
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
    }
];

for (var i = cmds.length - 1, cmd; i >= 0; i--) {
    cmd = cmds[i];
    program
        .command(cmd.command)
        .description(cmd.description)
        .action(cmd.action);
};

program.parse(process.argv);
