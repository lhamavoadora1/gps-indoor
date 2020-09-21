const express = require('express'),
    mongo = require('mongo.js'),
    collection = 'users';

var router = express.Router();

router.get('/', getUser);
// router.get('/:_id', getUser);
router.patch('/:_id', updateUser);

module.exports = router;

// function getAllUsers(req, res) {
//     res.send({
//         all: "users"
//     });
// }

async function getUser(req, res) {
    var dbResponse = await mongo.find(collection, req.body);
    console.log('checkpoint 5');
    console.log(dbResponse);
    res.json(
        dbResponse
    );
}

function updateUser(req, res) {
    res.json(req.body);
}