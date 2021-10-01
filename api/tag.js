const express = require('express'),
    mongo = require('mongo.js'),
    utils = require('utils.js'),
    collection = 'tags';

var tags = {};

var router = express.Router();
router.get('/', getAllTags);
router.get('/:tag_id', getTag);
router.post('/', insertTag);
router.patch('/:tag_id', updateTag);
router.delete('/:tag_id', deleteTag);
module.exports = router;

async function getAllTags(req, res) {
    var authorization = req.headers.authorization;
    var authData = await mongo.authenticateToken(authorization);
    if (authData) {
        var ownerKey = authData.owner;
        var tagsRetrieved = await mongo.findDB(collection, {
            owner: ownerKey
        });
        if (!utils.isEmpty(tagsRetrieved)) {
            res.send({
                response: tagsRetrieved
            });
        } else {
            res.status(204).send();
        }
    } else {
        res.status(401).send();
    }
}

async function getTag(req, res) {
    try {
        var authorization = req.headers.authorization;
        var authData = await mongo.authenticateToken(authorization);
        if (authData) {
            var ownerKey = authData.owner;
            var tagsRetrieved = await mongo.findDB(collection, {
                tag_id: req.params.tag_id,
                owner: ownerKey
            });
            if (!utils.isEmpty(tagsRetrieved)) {
                res.send({
                    response: tagsRetrieved
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

async function insertTag(req, res) {
    try {
        var authorization = req.headers.authorization;
        var authData = await mongo.authenticateToken(authorization);
        if (authData) {
            var tag_id = req.body.tag_id;
            if (utils.isEmpty(tag_id)) {
                res.status(400).send(new utils.Error(`tag_id is empty!`));
            } else {
                var ownerKey = authData.owner;
                var tagsRetrieved = await mongo.findDB(collection, {
                    tag_id: tag_id,
                    owner: ownerKey
                });
                if (!utils.isEmpty(tagsRetrieved)) {
                    res.status(406).send(new utils.Error(`Tag '${tag_id}' is already in database!`));
                } else {
                    var fullRequest = new TagInsert(req.body);
                    fullRequest.owner = ownerKey;
                    var data = await mongo.insertDB(collection, fullRequest);
                    if (data.result.n > 0) {
                        res.status(201).send(new utils.Success(`Tag '${tag_id}' inserted!`));
                    } else {
                        res.status(406).send(new utils.Error(`Tag '${tag_id}' failed to insert, contact an admin for help`));
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

async function updateTag(req, res) {
    try {
        var authorization = req.headers.authorization;
        var authData = await mongo.authenticateToken(authorization);
        if (authData) {
            var tag_id = req.params.tag_id;
            var ownerKey = authData.owner;
            var data = await mongo.updateDB(collection, {
                tag_id: tag_id,
                owner: ownerKey
            }, {
                $set: new TagUpdate(req.body)
            });
            if (data.result.nModified > 0 || data.result.n > 0) {
                res.send(new utils.Success(`Tag '${tag_id}' updated!`));
            } else {
                res.status(406).send(new utils.Error(`Tag '${tag_id}' failed to update, verify if the id is correct and try again`));
            }
        } else {
            res.status(401).send();
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(new utils.Error(err));
    }
}

async function deleteTag(req, res) {
    try {
        var authorization = req.headers.authorization;
        var authData = await mongo.authenticateToken(authorization);
        if (authData) {
            var tag_id = req.params.tag_id;
            var ownerKey = authData.owner;
            var data = await mongo.deleteDB(collection, {
                tag_id: tag_id,
                owner: ownerKey
            });
            if (data.result.n > 0) {
                res.send(new utils.Success(`Tag '${tag_id}' deleted!`));
            } else {
                res.status(406).send(new utils.Error(`Tag '${tag_id}' failed to delete, verify if the id is correct and try again`));
            }
        } else {
            res.status(401).send();
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(new utils.Error(err));
    }
}

class TagInsert {
    constructor(tag) {
        this.tag_id = tag.tag_id;
        this.name   = tag.name;
    }
}
class TagUpdate {
    constructor(tag) {
        this.name = tag.name;
    }
}