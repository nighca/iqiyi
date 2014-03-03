var _cli = require('../lib/node-cli');

var cli = {
    succ: function(){
        _cli.color('green');
        this.write.apply(this, arguments);
        _cli.reset();
        return this;
    },
    fail: function(){
        _cli.color('red');
        this.write.apply(this, arguments);
        _cli.reset();
        return this;
    },
    tell: function(){
        _cli.color('blue');
        this.write.apply(this, arguments);
        _cli.reset();
        return this;
    },
    begin: function(){
        _cli.color('blue');
        this.write('>>>');
        _cli.reset();
        return this;
    },
    end: function(){
        _cli.write('\n');
        return this;
    },
    write: function(){
        var cnt;
        for (var i = 0; i < arguments.length; i++) {
            cnt = typeof arguments[i] === 'object' || typeof arguments[i] === 'object' ?
                JSON.stringify(arguments[i]) :
                arguments[i];
            _cli.write(cnt + ' ');
        }
        return this;
    },
    print: function(){
        this.write.apply(this, arguments);
        this.end();
        return this;
    },
    printFail: function(){
        this.fail.apply(this, arguments);
        this.end();
        return this;
    }
};

module.exports = cli;