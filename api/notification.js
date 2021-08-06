const express = require('express'),
    mongo = require('mongo.js'),
    utils = require('utils.js'),
    collection = 'notifications';

var router = express.Router();
router.get('/', getAllNotifications);
router.get('/:timestamp', getNotification);
// router.post('/', insertNotification);
// router.delete('/:timestamp', deleteNotification);
module.exports = router;

async function getAllNotifications(req, res) {
    var authorization = req.headers.authorization;
    if (await mongo.authenticate(authorization)) {
        var sensor_id_list = [];
        var ownerKey = utils.getOwnerKey(authorization);
        var sensorsRetrieved = await mongo.findDB('sensors', {
            owner: ownerKey
        });
        if (!utils.isEmpty(sensorsRetrieved)) {
            sensorsRetrieved.forEach(function (item, index, array) {
                sensor_id_list.push({sensor_id:item.sensor_id});
            });
            var notificationsRetrieved = await mongo.findDB(collection, {
                $or: sensor_id_list
            });
            if (!utils.isEmpty(notificationsRetrieved)) {
                res.send({
                    notificationsRetrieved
                });
            } else {
                res.status(204).send();
            }
        } else {
            res.status(204).send();
        }
    } else {
        res.status(401).send();
    }
}

async function getNotification(req, res) {
    try {
        var timestamp = Number(req.params.timestamp);
        var authorization = req.headers.authorization;
        if (await mongo.authenticate(authorization)) {
            // var ownerKey = utils.getOwnerKey(authorization);
            var notificationsRetrieved = await mongo.findDB(collection, {
                timestamp: {
                    $gt: timestamp
                }
                // owner: ownerKey
            });
            if (!utils.isEmpty(notificationsRetrieved)) {
                res.send({
                    notificationsRetrieved
                });
            } else {
                res.status(204).send();
            }
        } else {
            res.status(401).send();
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(new utils.Error(err));
    }
}

async function insertNotification(fullRequest) {
    try {
        var sensorsRetrieved = await mongo.findDB('sensors', {
            sensor_id: fullRequest.sensor_id
        });
        if (!utils.isEmpty(sensorsRetrieved)) {
            var data = await mongo.insertDB(collection, fullRequest);
            if (data.result.n > 0) {
                console.log('Tag inserted!');
            } else {
                console.log('Tag not inserted!');
            }
        } else {
            console.log(`No sensor ${fullRequest.sensor_id} found!`);
        }
    } catch (err) {
        console.log('Body from request may be in the wrong format:');
        console.log(fullRequest)
        console.error(err);
        res.status(500).send(new utils.Error(err));
    }
}

// async function deleteNotification(req, res) {
//     try {
//         var authorization = req.headers.authorization;
//         if (await mongo.authenticate(authorization)) {
//             var timestamp = req.params.timestamp;
//             var ownerKey = utils.getOwnerKey(authorization);
//             var data = await mongo.deleteDB(collection, {
//                 timestamp: timestamp,
//                 owner: ownerKey
//             });
//             if (data.result.n > 0) {
//                 res.send(new utils.Success(`Notification '${timestamp}' deleted!`));
//             } else {
//                 res.status(406).send(new utils.Error(`Notification '${timestamp}' failed to delete, verify if the id is correct and try again`));
//             }
//         } else {
//             res.status(401).send();
//         }
//     } catch (err) {
//         console.error(err);
//         res.status(500).send(new utils.Error(err));
//     }
// }

class NotificationInsert {
    constructor(notification) {
        this.tag_id     = notification.tag_id;
        this.sensor_id  = notification.sensor_id;
        this.timestamp  = new Date().getTime();
    }
}

// Broker Connection

var mqtt = require('mqtt');
var options = {
    port: 1883
    // clientId: 'LEITOR_001',
    // username: 'NnB7tFj8KgQdkjg',
    // password: 'KoTg3FGuYMMwSxW',
};

var broker = 'mqtt://52.14.171.32/';
// 'mqtt://ioticos.org';
var topic = 'Antenna001';
// 'qkk2sNHLWr2MFm6/output';

var client = mqtt.connect(broker, options);

client.on('connect', function () {
    console.log(`Connected to broker on ${broker}`);
    client.subscribe(topic, function (err) {
        if (!err) {
            console.log(`Subscribed to ${topic}`);
        }
    });
});

client.on('message', async function (topic, message) {

    console.log(`message from topic: ${topic}`);
    console.log(message.toString());
    var notification = new NotificationInsert(JSON.parse(message.toString()));
    console.log(notification);

    // var ownerKey;
    // var sensorsRetrieved = await mongo.findDB(collection, {
    //     sensor_id: notification.sensor_id
    // });
    // if (!utils.isEmpty(sensorsRetrieved)) {
        // ownerKey = utils.getOwnerKey(authorization);

    insertNotification(notification);

    // } else {
        
    // }
    
    // client.end();

});