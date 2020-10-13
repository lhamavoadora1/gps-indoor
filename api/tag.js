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
    if (await mongo.authenticate(req.headers.authorization)) {
        var base64auth = utils.getBase64Auth(req.headers.authorization);
        var tagsRetrieved = await mongo.findDB(collection, {
            owner: base64auth
        });
        if (!utils.isEmpty(tagsRetrieved)) {
            res.send({
                tagsRetrieved
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
        if (await mongo.authenticate(req.headers.authorization)) {
            var tagsRetrieved = await mongo.findDB(collection, {
                tag_id: req.params.tag_id
            });
            if (!utils.isEmpty(tagsRetrieved)) {
                res.send({
                    tagsRetrieved
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
        if (await mongo.authenticate(authorization)) {
            var tag_id = req.body.tag_id;
            var owner = utils.getBase64Auth(authorization);
            var tagsRetrieved = await mongo.findDB(collection, {
                tag_id: tag_id,
                owner: owner
            });
            if (!utils.isEmpty(tagsRetrieved)) {
                res.send(new utils.Error(`Tag '${tag_id}' is already in database!`));
            } else {
                var fullRequest = req.body;
                fullRequest.owner = owner;
                var data = await mongo.insertDB(collection, fullRequest);
                if (data.result.n > 0) {
                    res.json(new utils.Success(`Tag '${tag_id}' inserted!`));
                } else {
                    res.json(new utils.Error(`Tag '${tag_id}' failed to insert, contact an admin for help`));
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

async function updateTag(req, res) {
    try {
        var authorization = req.headers.authorization;
        if (await mongo.authenticate(authorization)) {
            var tag_id = req.params.tag_id;
            var owner = utils.getBase64Auth(authorization);
            var data = await mongo.updateDB(collection, {
                tag_id: tag_id,
                owner: owner
            }, {
                $set: req.body
            });
            if (data.result.nModified > 0 || data.result.n > 0) {
                res.json(new utils.Success(`Tag '${tag_id}' updated!`));
            } else {
                res.json(new utils.Error(`Tag '${tag_id}' failed to update, verify if the id is correct and try again`));
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
        if (await mongo.authenticate(req.headers.authorization)) {
            var tag_id = req.params.tag_id;
            var data = await mongo.deleteDB(collection, {
                tag_id: tag_id
            });
            if (data.result.n > 0) {
                res.json(new utils.Success(`Tag '${tag_id}' deleted!`));
            } else {
                res.json(new utils.Error(`Tag '${tag_id}' failed to delete, verify if the id is correct and try again`));
            }
        } else {
            res.status(401).send();
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(new utils.Error(err));
    }
}

// function Tag(_id, name, owner) {
//     this._id = _id;
//     this.name = name;
//     this.owner = owner;
// }