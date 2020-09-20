const express = require('express'),
    mongo = require('mongo.js'),
    collection = 'tags';

var tags = {};

var router = express.Router();
router.get('/', getAllTags);
router.get('/:_id', getTag);
router.post('/', insertTag);
router.patch('/:_id', updateTag);
router.delete('/:_id', deleteTag);
module.exports = router;

function getAllTags(req, res) {
    res.send({
        all: "tags"
    });
}

function getTag(req, res) {
    res.send({
        tags
    });
}

function insertTag(req, res) {
    try {
        console.log(mongo.insert(collection, req.body));
        res.json(req.body);
    } catch (err) {
        console.log(err);
    }
}

function updateTag(req, res) {
    res.json(req.body);
}

function deleteTag(req, res) {
    res.json(req.body);
}

function Tag(_id, name) {
    this._id  = _id;
    this.name = name;
}