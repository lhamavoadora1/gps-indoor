const express = require('express'),
    mongo = require('mongo.js'),
    utils = require('utils'),
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
    if (await mongo.authenticate(req)) {
        res.send({
            all: "tags"
        });
    } else {
        res.status(401).send();
    }
}

async function getTag(req, res) {
    if (await mongo.authenticate(req)) {
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
}

async function insertTag(req, res) {
    if (await mongo.authenticate(req)) {
        var tag_id = req.body.tag_id;
        var data = await mongo.insertDB(collection, req.body);
        if (data.result.n > 0) {
            res.json(new utils.Success(`Tag '${tag_id}' inserted!`));
        } else {
            res.json(new utils.Error(`Tag '${tag_id}' failed to insert, contact an admin for help`));
        }
    } else {
        res.status(401).send();
    }
}

async function updateTag(req, res) {
    if (await mongo.authenticate(req)) {
        var tag_id = req.params.tag_id;
        var data = await mongo.updateDB(collection, {
            tag_id: tag_id
        }, {
            $set: req.body
        });
        if (data.result.nModified > 0) {
            res.json(new utils.Success(`Tag '${tag_id}' updated!`));
        } else {
            res.json(new utils.Error(`Tag '${tag_id}' failed to update, verify if the id is correct and try again`));
        }
    } else {
        res.status(401).send();
    }
}

async function deleteTag(req, res) {
    if (await mongo.authenticate(req)) {
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
}

// function Tag(_id, name, owner) {
//     this._id = _id;
//     this.name = name;
//     this.owner = owner;
// }