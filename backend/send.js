var amqp = require('amqplib/callback_api');

amqp.connect('amqp://10.17.12.239', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    console.log('connection', connection)
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'hello';
        console.log('>_')
        process.stdin.once('data', (data) => {
    
            channel.assertQueue(queue, {
                durable: false
            });
            channel.sendToQueue(queue, Buffer.from(data));
    
            console.log(" [x] Sent %s", data.toString());
        
            setTimeout(function() {
                connection.close();
                process.exit(0);
            }, 500);
        })
       
    });
});

let isConnect = new Promise((resolve, reject) => {
    amqp.connect('amqp://10.17.12.239', function(error0, connection) {
        if (error0) {
            reject(false)
            return
        }
        else
            resolve(connection)
    });
})

module.exports = {isConnect}