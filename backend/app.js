const express = require('express')
const Websocket = require('ws')
require('dotenv').config()
const app = express()
app.use(express.json())
const {connectToRabbitMQ} = require('./connect-broker')
const router = require('./router')
let wss

connectToRabbitMQ().then(
    (connection) => {
        console.log('Connect to broker successfuly!')
        server = app.listen(process.env.PORT || 3003, process.env.HOST || '0.0.0.0', () => {
            app.use(router)
            wss = new Websocket.Server({ server })
            wss.on('connection', (ws) => {
                console.log('React client connected via Websocket')
                ws.on('close', () => console.log('React client disconnected'))
            })
            console.log('Chat server is running on', process.env.HOST, 'at port:', process.env.PORT, '!')
            //send message
            app.post('/dm', (req, res) => {
                let { message, staff_id } = req.body
                connection.createChannel(function(error1, channel) {
                    if (error1) {
                        throw error1;
                    }
                    channel.assertQueue(staff_id, {
                        durable: true
                    });
                    channel.sendToQueue(staff_id, Buffer.from(message), {persistent: true});
                    res.sendStatus(200)
                   
                });
            })

            //get message
            app.get('/dm', (req, res) => {
                let { staff_id } = req.body
                connection.createChannel(function(error1, channel) {
                    if (error1) {
                        throw error1;
                    }
                    channel.assertQueue(staff_id, {
                        durable: true
                    });
            
                    channel.consume(staff_id, function(msg) {
                        console.log('Message:', msg.content.toString())
                        wss.clients.forEach((client) => {
                            if (client.readyState === Websocket.OPEN) {
                                client.send(JSON.stringify(msg.content.toString()))
                            }
                        });
                    }, {
                        noAck: true
                    });
                });
            })
            
        })
    },
    (err) => {
        console.log('Connect to broker failed! Error:', err)
    }
)