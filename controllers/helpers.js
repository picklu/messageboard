const helpers = {};

helpers.trace = function (message = '') {
    const stack = new Error().stack;
    const trace = stack.split('\n')[2];
    const match = /\((.*)\)/.exec(trace);
    console.log(`<=== ${match[1]}`);
    console.log(message);
    console.log(`== ${match[1]}===>`);

}

helpers.log = function (message = '', script = '', line = 0) {
    console.log('<==============================');
    if (script && line) console.log(`In "${script}" at line ${line}.`);
    if (message) console.log(message);
    console.log('==============================>');
}

module.exports = helpers;

