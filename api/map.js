const express = require('express'),
    mongo = require('mongo.js'),
    utils = require('utils.js'),
    collection = 'maps';

var router = express.Router();
router.get('/', getAllMaps);
router.get('/:map_id', getMap);
router.post('/', insertMap);
router.patch('/:map_id', updateMap);
router.delete('/:map_id', deleteMap);
module.exports = router;

async function getAllMaps(req, res) {
    try {
        var authorization = req.headers.authorization;
        var authData = await mongo.authenticateToken(authorization);
        if (authData) {
            var ownerKey = authData.owner;
            var mapsRetrieved = await mongo.findDB(collection, {
                owner: ownerKey
            });
            if (!utils.isEmpty(mapsRetrieved)) {
                res.send({
                    response: mapsRetrieved
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

async function getMap(req, res) {
    try {
        var authorization = req.headers.authorization;
        var authData = await mongo.authenticateToken(authorization);
        if (authData) {
            var ownerKey = authData.owner;
            var mapsRetrieved = await mongo.findDB(collection, {
                map_id: req.params.map_id,
                owner: ownerKey
            });
            if (!utils.isEmpty(mapsRetrieved)) {
                res.send({
                    response: mapsRetrieved
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

async function insertMap(req, res) {
    try {
        var authorization = req.headers.authorization;
        var authData = await mongo.authenticateToken(authorization);
        if (authData) {
            var map_id = req.body.map_id;
            if (utils.isEmpty(map_id)) {
                res.status(400).send(new utils.Error(`map_id is empty!`));
            } else {
                var ownerKey = authData.owner;
                var mapsRetrieved = await mongo.findDB(collection, {
                    map_id: map_id,
                    owner: ownerKey
                });
                if (!utils.isEmpty(mapsRetrieved)) {
                    res.status(406).send(new utils.Error(`Map '${map_id}' is already in database!`));
                } else {
                    var fullRequest = new MapInsert(req.body);
                    fullRequest.owner = ownerKey;
                    var data = await mongo.insertDB(collection, fullRequest);
                    if (data.result.n > 0) {
                        res.status(201).send(new utils.Success(`Map '${map_id}' inserted!`));
                    } else {
                        res.status(406).send(new utils.Error(`Map '${map_id}' failed to insert, contact an admin for help`));
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

async function updateMap(req, res) {
    try {
        var authorization = req.headers.authorization;
        var authData = await mongo.authenticateToken(authorization);
        if (authData) {
            var map_id = req.params.map_id;
            var ownerKey = authData.owner;
            var data = await mongo.updateDB(collection, {
                map_id: map_id,
                owner: ownerKey
            }, {
                $set: new MapUpdate(req.body)
            });
            if (data.result.nModified > 0 || data.result.n > 0) {
                res.send(new utils.Success(`Map '${map_id}' updated!`));
            } else {
                res.status(406).send(new utils.Error(`Map '${map_id}' failed to update, verify if the id is correct and try again`));
            }
        } else {
            res.status(401).send();
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(new utils.Error(err));
    }
}

async function deleteMap(req, res) {
    try {
        var authorization = req.headers.authorization;
        var authData = await mongo.authenticateToken(authorization);
        if (authData) {
            var map_id = req.params.map_id;
            var ownerKey = authData.owner;
            var data = await mongo.deleteDB(collection, {
                map_id: map_id,
                owner: ownerKey
            });
            if (data.result.n > 0) {
                res.send(new utils.Success(`Map '${map_id}' deleted!`));
            } else {
                res.status(406).send(new utils.Error(`Map '${map_id}' failed to delete, verify if the id is correct and try again`));
            }
        } else {
            res.status(401).send();
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(new utils.Error(err));
    }
}

class MapInsert {
    constructor(obj) {
        this.map_id = obj.map_id;
        this.blob_value = obj.blob_value;
    }
}
class MapUpdate {
    constructor(obj) {
        this.blob_value = obj.blob_value;
    }
}