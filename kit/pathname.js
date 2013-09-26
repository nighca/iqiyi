var path = require('path');

var config = require('./config')();

var root = config.root;

var trunkFolder = '__trunk__';
var trunkName = 'trunk';
var branchFolder = '__branch__';

var projectFolder = config.project || 'qiyiV2';

var branchPath = path.join(root, branchFolder);

var staticPath = path.join(__dirname, '..', 'static');
var configFileName = '.htaccess';
var rootHtaccess = path.join(staticPath, 'root' + configFileName);
var jsHtaccess = path.join(staticPath, 'js' + configFileName);
var branchHtaccess = path.join(staticPath, 'branch' + configFileName);

var ruleFile = path.join(root, 'js', '.htaccess');

exports.root = root;

exports.trunkFolder = trunkFolder;
exports.trunkName = trunkName;
exports.branchFolder = branchFolder;
exports.projectFolder = projectFolder;

exports.branchPath = branchPath;

exports.staticPath = staticPath;
exports.configFileName = configFileName;
exports.rootHtaccess = rootHtaccess;
exports.jsHtaccess = jsHtaccess;
exports.branchHtaccess = branchHtaccess;

exports.ruleFile = ruleFile;
