require('rootpath')();
var express = require('express');
var cors = require('cors');

var app = express();
app.use(cors());

var port = process.env.PORT || 5000

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: false}));

app.use('/image', require('api/image'));
app.use('/notification', require('api/notification'));
app.use('/sensor', require('api/sensor'));
app.use('/tag', require('api/tag'));
app.use('/user', require('api/user'));

app.listen(port, () => console.log(`Listening on port ${port}`));

var mqtt = require('mqtt');

var options = {
    port: 1883,
    clientId: 'GAPO_IDENTIFICATION_LEITOR_001',
    username: 'NnB7tFj8KgQdkjg',
    password: 'KoTg3FGuYMMwSxW',
};

var client = mqtt.connect('mqtt://ioticos.org', options);

client.on('connect', function () {
    client.subscribe('qkk2sNHLWr2MFm6/output', function (err) {
        if (!err) {
            // client.publish('test', 'Hello mqtt!!!');
        }
    })
});

client.on('message', function (topic, message) {
    // message is Buffer
    console.log(message.toString());
    console.log({
        tag_id: message.tag_id,
        sensor_id: message.sensor_id,
        timestamp: new Date().getTime()
    })
    // client.end();
});