const express = require('express'),
    mongo = require('mongo.js'),
    utils = require('utils.js'),
    collection = 'sectors';

var router = express.Router();
router.get('/:map_id', getAllSectors);
router.get('/:map_id/:sector_id', getSector);
router.post('/', insertSector);
router.patch('/:map_id/:sector_id', updateSector);
router.delete('/:map_id/:sector_id', deleteSector);
module.exports = router;

async function getAllSectors(req, res) {
    try {
        var authorization = req.headers.authorization;
        var authData = await mongo.authenticateToken(authorization);
        if (authData) {
            var map_id = req.params.map_id;
            var ownerKey = authData.owner;
            var mapRetrieved = await mongo.findDB('maps', {
                map_id: map_id,
                owner: ownerKey
            });
            if (!utils.isEmpty(mapRetrieved)) {
                var sectorsRetrieved = await mongo.findDB(collection, {
                    map_id: map_id
                });
                if (!utils.isEmpty(sectorsRetrieved)) {
                    res.send({
                        sectorsRetrieved
                    });
                } else {
                    res.status(204).send();
                }
            } else {
                res.status(406).send(new utils.Error(`No map '${map_id}' found!`));
            }
        } else {
            res.status(401).send();
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(new utils.Error(err));
    }
}

async function getSector(req, res) {
    try {
        var authorization = req.headers.authorization;
        var authData = await mongo.authenticateToken(authorization);
        if (authData) {
            var map_id = req.params.map_id;
            var ownerKey = authData.owner;
            var mapRetrieved = await mongo.findDB('maps', {
                map_id: map_id,
                owner: ownerKey
            });
            if (!utils.isEmpty(mapRetrieved)) {
                var sectorsRetrieved = await mongo.findDB(collection, {
                    sector_id: req.params.sector_id,
                    map_id: map_id
                });
                if (!utils.isEmpty(sectorsRetrieved)) {
                    res.send({
                        sectorsRetrieved
                    });
                } else {
                    res.status(204).send();
                }
            } else {
                res.status(406).send(new utils.Error(`No map '${map_id}' found!`));
            }
        } else {
            res.status(401).send();
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(new utils.Error(err));
    }
}

async function insertSector(req, res) {
    try {
        var authorization = req.headers.authorization;
        var authData = await mongo.authenticateToken(authorization);
        if (authData) {
            var sector_id = req.body.sector_id;
            var map_id = req.body.map_id;
            if (utils.isEmpty(sector_id) || utils.isEmpty(map_id)) {
                if (utils.isEmpty(sector_id))
                    res.status(400).send(new utils.Error(`sector_id is empty!`));
                else if (utils.isEmpty(map_id)) {
                    res.status(400).send(new utils.Error(`map_id is empty!`));
                }
            } else {
                var ownerKey = authData.owner;
                var mapRetrieved = await mongo.findDB('maps', {
                    map_id: map_id,
                    owner: ownerKey
                });
                var sectorRetrieved = await mongo.findDB(collection, {
                    sector_id: sector_id,
                    map_id: map_id
                });
                if (utils.isEmpty(mapRetrieved)) {
                    res.status(406).send(new utils.Error(`No map ${map_id} found!`));
                } else if (!utils.isEmpty(sectorRetrieved)) {
                    res.status(406).send(new utils.Error(`Sector '${sector_id}' on map '${map_id}' is already in database!`));
                } else {
                    var fullRequest = new SectorInsert(req.body);
                    var data = await mongo.insertDB(collection, fullRequest);
                    if (data.result.n > 0) {
                        res.status(201).send(new utils.Success(`Sector '${sector_id}' inserted!`));
                    } else {
                        res.status(406).send(new utils.Error(`Sector '${sector_id}' failed to insert, contact an admin for help`));
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

async function updateSector(req, res) {
    try {
        var authorization = req.headers.authorization;
        var authData = await mongo.authenticateToken(authorization);
        if (authData) {
            var sector_id = req.params.sector_id;
            var map_id = req.params.map_id;
            var ownerKey = authData.owner;
            var mapRetrieved = await mongo.findDB('maps', {
                map_id: map_id,
                owner: ownerKey
            });
            if (utils.isEmpty(mapRetrieved)) {
                res.status(406).send(new utils.Error(`No map '${map_id}' found!`));
            } else {
                var data = await mongo.updateDB(collection, {
                    sector_id: sector_id,
                    map_id: map_id
                }, {
                    $set: new SectorUpdate(req.body)
                });
                if (data.result.nModified > 0 || data.result.n > 0) {
                    res.send(new utils.Success(`Sector '${sector_id}' updated!`));
                } else {
                    res.status(406).send(new utils.Error(`Sector '${sector_id}' failed to update, verify if the id is correct and try again`));
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

async function deleteSector(req, res) {
    try {
        var authorization = req.headers.authorization;
        var authData = await mongo.authenticateToken(authorization);
        if (authData) {
            var sector_id = req.params.sector_id;
            var map_id = req.params.map_id;
            var ownerKey = authData.owner;
            var mapRetrieved = await mongo.findDB('maps', {
                map_id: map_id,
                owner: ownerKey
            });
            if (utils.isEmpty(mapRetrieved)) {
                res.status(406).send(new utils.Error(`No map '${map_id}' found!`));
            } else {
                var data = await mongo.deleteDB(collection, {
                    sector_id: sector_id,
                    map_id: map_id
                });
                if (data.result.n > 0) {
                    res.send(new utils.Success(`Sector '${sector_id}' deleted!`));
                } else {
                    res.status(406).send(new utils.Error(`Sector '${sector_id}' failed to delete, verify if the id is correct and try again`));
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

class SectorInsert {
    constructor(obj) {
        this.sector_id = obj.sector_id;
        this.blob_value = obj.blob_value;
        this.map_id = obj.map_id;
    }
}
class SectorUpdate {
    constructor(obj) {
        this.blob_value = obj.blob_value;
    }
}