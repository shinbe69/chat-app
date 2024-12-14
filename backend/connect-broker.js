var amqp = require('amqplib/callback_api');

let isConnect = new Promise((resolve, reject) => {
    amqp.connect('amqp://10.17.12.239', function(error0, connection) {
        if (error0) {
            reject(false)
        }
        else
            resolve(connection)
    });
})

module.exports = {isConnect}