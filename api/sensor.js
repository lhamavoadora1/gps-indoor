const express = require('express'),
    mongo = require('mongo.js'),
    utils = require('utils.js'),
    collection = 'sensors';

var router = express.Router();
router.get('/', getAllSensors);
router.get('/:sensor_id', getSensor);
router.post('/', insertSensor);
router.patch('/:sensor_id', updateSensor);
router.delete('/:sensor_id', deleteSensor);
module.exports = router;

async function getAllSensors(req, res) {
    var authorization = req.headers.authorization;
    var authData = await mongo.authenticateToken(authorization);
    if (authData) {
        var ownerKey = authData.owner;
        var sensorsRetrieved = await mongo.findDB(collection, {
            owner: ownerKey
        });
        if (!utils.isEmpty(sensorsRetrieved)) {
            res.send({
                sensorsRetrieved
            });
        } else {
            res.status(204).send();
        }
    } else {
        res.status(401).send();
    }
}

async function getSensor(req, res) {
    try {
        var authorization = req.headers.authorization;
        var authData = await mongo.authenticateToken(authorization);
        if (authData) {
            var ownerKey = authData.owner;
            var sensorsRetrieved = await mongo.findDB(collection, {
                sensor_id: req.params.sensor_id,
                owner: ownerKey
            });
            if (!utils.isEmpty(sensorsRetrieved)) {
                res.send({
                    sensorsRetrieved
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

async function insertSensor(req, res) {
    try {
        var authorization = req.headers.authorization;
        var authData = await mongo.authenticateToken(authorization);
        if (authData) {
            var sensor_id = req.body.sensor_id;
            if (utils.isEmpty(sensor_id)) {
                res.status(400).send(new utils.Error(`sensor_id is empty!`));
            } else {
                var ownerKey = authData.owner;
                var sensorsRetrieved = await mongo.findDB(collection, {
                    sensor_id: sensor_id,
                    owner: ownerKey
                });
                if (!utils.isEmpty(sensorsRetrieved)) {
                    res.status(406).send(new utils.Error(`Sensor '${sensor_id}' is already in database!`));
                } else {
                    var fullRequest = new SensorInsert(req.body);
                    fullRequest.owner = ownerKey;
                    var data = await mongo.insertDB(collection, fullRequest);
                    if (data.result.n > 0) {
                        res.status(201).send(new utils.Success(`Sensor '${sensor_id}' inserted!`));
                    } else {
                        res.status(406).send(new utils.Error(`Sensor '${sensor_id}' failed to insert, contact an admin for help`));
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

async function updateSensor(req, res) {
    try {
        var authorization = req.headers.authorization;
        var authData = await mongo.authenticateToken(authorization);
        if (authData) {
            var sensor_id = req.params.sensor_id;
            var ownerKey = authData.owner;
            var data = await mongo.updateDB(collection, {
                sensor_id: sensor_id,
                owner: ownerKey
            }, {
                $set: new SensorUpdate(req.body)
            });
            if (data.result.nModified > 0 || data.result.n > 0) {
                res.send(new utils.Success(`Sensor '${sensor_id}' updated!`));
            } else {
                res.status(406).send(new utils.Error(`Sensor '${sensor_id}' failed to update, verify if the id is correct and try again`));
            }
        } else {
            res.status(401).send();
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(new utils.Error(err));
    }
}

async function deleteSensor(req, res) {
    try {
        var authorization = req.headers.authorization;
        var authData = await mongo.authenticateToken(authorization);
        if (authData) {
            var sensor_id = req.params.sensor_id;
            var ownerKey = authData.owner;
            var data = await mongo.deleteDB(collection, {
                sensor_id: sensor_id,
                owner: ownerKey
            });
            if (data.result.n > 0) {
                res.send(new utils.Success(`Sensor '${sensor_id}' deleted!`));
            } else {
                res.status(406).send(new utils.Error(`Sensor '${sensor_id}' failed to delete, verify if the id is correct and try again`));
            }
        } else {
            res.status(401).send();
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(new utils.Error(err));
    }
}

class SensorInsert {
    constructor(obj) {
        this.sensor_id  = obj.sensor_id;
        this.name       = obj.name;
        this.pos_x      = obj.pos_x;
	    this.pos_y      = obj.pos_y;
	    this.sector_id  = obj.sector_id;
    }
}
class SensorUpdate {
    constructor(obj) {
        this.name       = obj.name;
        this.pos_x      = obj.pos_x;
	    this.pos_y      = obj.pos_y;
	    this.sector_id  = obj.sector_id;
    }
}