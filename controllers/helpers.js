const helpers = {};

helpers.trace = function (message = '') {
    const stack = new Error().stack;
    const trace = stack.split('\n')[2];
    const match = /\((.*)\)/.exec(trace);
    console.log(`<=== ${match[1]}`);
    console.log(message);
    console.log(`== ${match[1]}===>`);

}

helpers.log = function (message = '') {
    console.log('<==============================');
    console.log(message);
    console.log('==============================>');
}

module.exports = helpers;

