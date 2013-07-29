#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var program = require('commander');

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

var args = process.argv.slice(2);

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
    var branchPath = path.join(root, '__branch__');
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

    if(branch.trim() === 'trunk'){
        branch = '__trunk__';
    }else{
        branch = '__branch__/' + branch;
    }

    checkoutRewriteRule(root, branch);
    addLocalRewriteRule(root, branch);
};

var rootAction = function(root){
    var svRoot = function(root){
        root = path.resolve(__dirname, root);
        try{
            config({
                root: root
            });
            myCli
                .write('Finished.')
                .write('Current root:')
                .succ(root).end();
        }catch(e){
            myCli
                .write('Failed.')
                .fail(e).end();
        }
        process.exit();
    };

    var promptSvRoot = function(){
        program.prompt('Input the path of dev folder: ', function(root){
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
            .fail('Failed.')
            .write('Please set the dev path first using')
            .write('`iqiyi root [root]`').end();
        process.exit();
    }

    var doCheckout = function(branch){
        try{
            checkout(branch);
            myCli
                .write('Finished.')
                .write('Current branch:')
                .succ(branch).end();
        }catch(e){
            myCli
                .write('Failed.')
                .fail(e).end();
        }
        process.exit();
    };

    var promptCheckout = function(){
        var branchList = getBranchList(root);
        branchList.unshift('trunk');
        myCli.tell('Choose a branch to checkout to:').end();
        program.choose(branchList, function(i){
            doCheckout(branchList[i]);
        });
    };

    if(branch){
        doCheckout(branch);
    }else{
        promptCheckout();
    }
};

program.version('0.0.1');

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
