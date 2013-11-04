#!/usr/bin/env node

var program = require('commander');
var config = require('./kit/config');

var completion = require('./kit/cmd').completion(
    ['init', 'use', 'checkout', 'branch', 'status', 'update', 'exec'],
    ['h', 'V'],
    ['help', 'version']
);

if(completion){
    return completion;
}

program.version(config().pkg.version);

var cmds = [
    {
        command: 'init [root]',
        description: 'give a path & init it',
        action: require('./action/init')
    },
    {
        command: 'use [root]',
        description: 'use folder which already occurs',
        action: require('./action/use')
    },
    {
        command: 'checkout [branch]',
        description: 'checkout to a branch',
        action: require('./action/checkout')
    },
    {
        command: 'branch',
        description: 'show all branches',
        action: require('./action/branch')
    },
    /*{
        command: 'goto',
        description: 'goto the working directory',
        action: require('./action/goto')
    },*/
    {
        command: 'exec',
        description: 'exec command @cwd',
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

