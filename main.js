#!/usr/bin/env node

var program = require('commander');
//var config = require('./kit/config');
var pkg = require('./package.json');

var completion = require('./kit/cmd').completion(
    ['init', 'use', 'checkout', 'create', 'config', 'branch', 'status', 'update', 'exec', 'goto'],
    ['h', 'V'],
    ['help', 'version']
);

if(completion){
    return completion;
}

program.version(pkg.version);

var cmds = [
    {
        command: 'init [root]',
        description: 'use a directory as root & init it',
        action: require('./action/init')
    },
    {
        command: 'use [root]',
        description: 'use a directory as root',
        action: require('./action/use')
    },
    {
        command: 'checkout [branch]',
        description: 'checkout to a branch',
        action: require('./action/checkout')
    },
    {
        command: 'create [addr] [branch]',
        description: 'create a branch',
        action: require('./action/create')
    },
    {
        command: 'config [name] [value]',
        description: 'set config',
        action: require('./action/config')
    },
    {
        command: 'branch',
        description: 'show all branches',
        action: require('./action/branch')
    },
    {
        command: 'goto',
        description: 'open a new terminal @cbd (current branch directory)',
        action: require('./action/goto')
    },
    {
        command: 'exec',
        description: 'exec command @cbd (current branch directory)',
        action: require('./action/exec')
    },
    {
        command: 'update',
        description: 'update current branch',
        action: require('./action/update')
    },
    {
        command: 'status',
        description: 'show status',
        action: require('./action/status')
    }
];

for (var i = 0, l = cmds.length, cmd; i < l; i++) {
    cmd = cmds[i];
    program
        .command(cmd.command)
        .description(cmd.description)
        .action(cmd.action.bind(program));
}

program.parse(process.argv);

