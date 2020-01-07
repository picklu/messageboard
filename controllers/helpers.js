const helpers = {};

helpers.trace = function(){
    const stack = new Error().stack;
    const trace = stack.split('\n')[2];
    const match = /\((.*)\)/.exec(trace);
    console.log(`== @ ==> ${match[1]}`);
}

module.exports = helpers;

