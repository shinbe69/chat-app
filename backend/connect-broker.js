const amqp = require('amqplib/callback_api');

function connectToRabbitMQ() {
    return new Promise((resolve, reject) => {
        let count = 0
        let id = setInterval(async () => {
            await amqp.connect('amqp://BROKER', (err, connection) => {
                if (err) {
                    if (count == 5) {
                        clearInterval(id)
                        return reject(err)
                    }
                    console.log(err)
                    console.log('Connecting to message broker fail, trying again...')
                    count++
                } else {
                    clearInterval(id)
                    resolve(connection);
                }
            })  
        }, 5000)
    });
}

module.exports = { connectToRabbitMQ }