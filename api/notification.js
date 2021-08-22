const express = require('express'),
    mongo = require('mongo.js'),
    utils = require('utils.js'),
    collection = 'notifications';

var router = express.Router();
router.get('/', getAllNotifications);
router.get('/:sensor_id/', getNotification);
router.get('/:sensor_id/:timestamp', getNotification);
// router.delete('/', deleteAllNotifications);
router.delete('/:sensor_id/:timestamp', deleteNotification);
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
        var authorization = req.headers.authorization;
        if (await mongo.authenticate(authorization)) {
            var sensor_id = req.params.sensor_id;
            var timestampsReceived = req.params.timestamp;
            // console.log(sensor_id);
            // console.log(timestampsReceived);
            if (timestampsReceived) {
                var filter = getFilterFromTimestamps(timestampsReceived);
                if (filter) {
                    var query;
                    if (!filter.$and) {
                        query = {
                            sensor_id: sensor_id,
                            timestamp: filter
                        }
                        // console.log({
                        //     sensor_id: sensor_id,
                        //     timestamp: filter
                        // });
                    } else {
                        query = {
                            sensor_id: sensor_id,
                            $and: filter.$and
                        }
                        // console.log({
                        //     sensor_id: sensor_id,
                        //     $and: filter.$and
                        // });
                    }
                    var notificationsRetrieved = await mongo.findDB(collection, query);
                    if (!utils.isEmpty(notificationsRetrieved)) {
                        res.send({
                            notificationsRetrieved
                        });
                    } else {
                        res.status(204).send();
                    }
                } else {
                    res.status(406).send(new utils.Error(`URL is malformed!`));
                }
            } else {
                var notificationsRetrieved = await mongo.findDB(collection, {
                    sensor_id: sensor_id
                });
                if (!utils.isEmpty(notificationsRetrieved)) {
                    res.send({
                        notificationsRetrieved
                    });
                } else {
                    res.status(204).send();
                }
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

async function deleteAllNotifications(req, res) {
    try {
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
                var data = await mongo.deleteManyDB(collection, {
                    $or: sensor_id_list
                });
                
                // console.log({
                //     $or: sensor_id_list
                // });
                // console.log(data);

                if (data.result.n > 0) {
                    res.send(new utils.Success(`All notifications deleted!`));
                } else {
                    res.status(406).send(new utils.Error(`Notifications failed to delete, contact admin for help`));
                }
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

async function deleteNotification(req, res) {
    try {
        var authorization = req.headers.authorization;
        if (await mongo.authenticate(authorization)) {
            var sensor_id = req.params.sensor_id;
            var timestampsReceived = req.params.timestamp;
            // console.log(sensor_id);
            // console.log(timestampsReceived);
            var filter = getFilterFromTimestamps(timestampsReceived);
            if (filter) {
                var query;
                if (!filter.$and) {
                    query = {
                        sensor_id: sensor_id,
                        timestamp: filter
                    }
                    // console.log({
                    //     sensor_id: sensor_id,
                    //     timestamp: filter
                    // });
                } else {
                    query = {
                        sensor_id: sensor_id,
                        $and: filter.$and
                    }
                    // console.log({
                    //     sensor_id: sensor_id,
                    //     $and: filter.$and
                    // });
                }
                var data = await mongo.deleteManyDB(collection, query);
                if (data.result.n > 0) {
                    res.send(new utils.Success(`Notification(s) deleted!`));
                } else {
                    res.status(406).send(new utils.Error(`Notification(s) failed to delete, verify if the timestamp is correct and try again`));
                }
            }
        } else {
            res.status(401).send();
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(new utils.Error(err));
    }
}

function getFilterFromTimestamps(timestampsReceived) {
    if (timestampsReceived) {
        var filter;
        var timestamps = timestampsReceived.split('-');
        // console.log('timestamps');
        // console.log(timestamps);
        // console.log(typeof timestamps);
        // console.log('length');
        // console.log(timestamps.length);
        if (timestamps.length > 1) {
            var firstFilter = timestamps[0].trim();
            var secondFilter = timestamps[1].trim();
            if (!firstFilter) {
                // console.log('IS EMPTY');
                if (!secondFilter) {
                    // console.log('IS EMPTY TOO');
                } else {
                    filter = {$lte:Number(secondFilter)};
                }
            } else if (!secondFilter) {
                // console.log('IS EMPTY');
                if (!firstFilter) {
                    // console.log('IS EMPTY TOO');
                } else {
                    filter = {$gte:Number(firstFilter)};
                }
            } else {
                filter = {$and:[{timestamp:{$gte:Number(firstFilter)}}, {timestamp:{$lte:Number(secondFilter)}}]};
            }
            return filter;
        } else {
            filter = Number(timestamps[0].trim());
            return filter;
        }
    } else {
        return null;
    }
}

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
    port: 1883,
    reconnectPeriod: 1
};

var broker = 'mqtt://52.14.171.32/';
var topic = 'Antenna001';

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
    insertNotification(notification);
    // client.end();
});