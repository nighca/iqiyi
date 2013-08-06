var completion = require('../lib/completion');
var config = require('./config');

var kit = require('./index');
var pathname = require('./pathname');

exports.completion = function (cmds, _cmds, __cmds) {
	if(process.argv.slice(2)[0] === 'completion'){
	    return completion.complete(config().pkg.name, function(err, data) {
	        if(err || !data){
	            return null;
	        }

	        if(/^--\w?/.test(data.last)){
	            return completion.log(__cmds, data, '--');
	        }
	        if(/^-\w?/.test(data.last)){
	            return completion.log(_cmds, data, '-');
	        }

	        if(data.prev === 'checkout'){
	            var root = pathname.root;
	            var branchList = kit.getBranchList(root);

	            return completion.log(branchList, data);
	        }

	        if(cmds.indexOf(data.prev) >= 0){
	            //return completion.log([' '], data);
	            return ;
	        }

	        return completion.log(cmds, data);
	    });
	}
};