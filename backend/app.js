const express = require('express')
require('dotenv').config()
const app = express()
app.use(express.json())
const broker = require('./connect-broker')
const router = require('./router')

broker.isConnect.then(
    (connection) => {
        console.log('Connect to broker successfuly!')
        app.listen(process.env.PORT || 3003, process.env.HOST || '0.0.0.0', () => {
            app.use(router)
            console.log('Chat server is running on', process.env.HOST, 'at port:', process.env.PORT, '!')
            //send message
            app.post('/dm', (req, res) => {
                let { message } = req.body
                connection.createChannel(function(error1, channel) {
                    if (error1) {
                        throw error1;
                    }
            
                    var queue = 'hello';
                    channel.assertQueue(queue, {
                        durable: false
                    });
                    channel.sendToQueue(queue, Buffer.from(message));
                    res.send(200)
                
                    setTimeout(function() {
                        connection.close();
                    }, 500);
                   
                });
            })

            //get message
            app.get('/dm', (req, res) => {
                connection.createChannel(function(error1, channel) {
                    if (error1) {
                        throw error1;
                    }
            
                    var queue = 'hello';
            
                    channel.assertQueue(queue, {
                        durable: false
                    });
            
                    channel.consume(queue, function(msg) {
                        console.log(" [x] Received %s", msg.content.toString());
                    }, {
                        noAck: true
                    });
                });
            })
            
        })
    },
    () => {
        console.log('Connect to broker failed!')
    }
)