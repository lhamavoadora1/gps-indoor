const express = require('express'),
    mongo = require('mongo.js'),
    collection = 'users';

var router = express.Router();

router.get('/', getAllUsers);
router.get('/:_id', getUser);
router.patch('/:_id', updateUser);

module.exports = router;

function getAllUsers(req, res) {
    res.send({
        all: "users"
    });
}

function getUser(req, res) {
    var dbResponse = mongo.find(collection, req.body)
    console.log(dbResponse);
    res.json(
        dbResponse
    );
}

function updateUser(req, res) {
    res.json(req.body);
}