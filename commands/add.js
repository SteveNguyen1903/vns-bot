module.exports = {
    commands: ['add', 'addition'],
    expectedArgs: '<num1> <num2>',
    permissionError: 'You need admin permission to run this command',
    minArgs: 2,
    maxArgs: 2,
    callback: (client, message, arguments, text) => {

    },
    permissions: 'ADMINISTRATOR',
    // requiredRoles: ['Math']
}