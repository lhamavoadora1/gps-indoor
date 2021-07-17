const express = require('express'),
    mongo = require('mongo.js'),
    utils = require('utils.js'),
    collection = 'notifications';

var router = express.Router();
router.get('/', getAllNotifications);
router.get('/:timestamp', getNotification);
router.post('/', insertNotification);
// router.delete('/:timestamp', deleteNotification);
module.exports = router;

async function getAllNotifications(req, res) {
    var authorization = req.headers.authorization;
    if (await mongo.authenticate(authorization)) {
        var ownerKey = utils.getOwnerKey(authorization);
        var notificationsRetrieved = await mongo.findDB(collection, {
            owner: ownerKey
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
}

async function getNotification(req, res) {
    try {
        var timestamp = Number(req.params.timestamp);
        var authorization = req.headers.authorization;
        if (await mongo.authenticate(authorization)) {
            var ownerKey = utils.getOwnerKey(authorization);
            var notificationsRetrieved = await mongo.findDB(collection, {
                timestamp: {
                    $gt: timestamp
                },
                owner: ownerKey
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

async function insertNotification(req, res) {
    try {
        var authorization = req.headers.authorization;
        if (await mongo.authenticate(authorization)) {
            // APENAS O USER PADRÃO DO BROKER PODE NOTIFICAR!!!!!!!!!!
            var timestamp = req.body.timestamp;
            if (utils.isEmpty(timestamp)) {
                res.status(400).send(new utils.Error(`timestamp is empty!`));
            } else {
                var ownerKey = utils.getOwnerKey(authorization);
                var notificationsRetrieved = await mongo.findDB(collection, {
                    timestamp: timestamp,
                    owner: ownerKey
                });
                if (!utils.isEmpty(notificationsRetrieved)) {
                    res.status(406).send(new utils.Error(`Notification '${timestamp}' is already in database!`));
                } else {
                    var fullRequest = new NotificationInsert(req.body);
                    fullRequest.owner = ownerKey;
                    var data = await mongo.insertDB(collection, fullRequest);
                    if (data.result.n > 0) {
                        res.status(201).send(new utils.Success(`Notification '${timestamp}' inserted!`));
                    } else {
                        res.status(406).send(new utils.Error(`Notification '${timestamp}' failed to insert, contact an admin for help`));
                    }
                }
            }
        } else {
            res.status(401).send();
        }
    } catch (err) {
        console.log('Body from request may be in the wrong format:');
        console.log(req.body)
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
        this.timestamp  = notification.timestamp;
    }
}