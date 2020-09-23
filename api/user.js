const express = require('express'),
    mongo = require('mongo.js'),
    utils = require('utils.js'),
    collection = 'users';

var router = express.Router();
router.get('/', getUser);
router.patch('/', updateUser);
module.exports = router;

async function getUser(req, res) {
    try {
        if (await mongo.authenticate(req.headers.authorization)) {
            res.json(new utils.Success('User found!'))
        } else {
            res.status(204).send();
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(new utils.Error(err));
    }
}

async function updateUser(req, res) {
    try {
        if (await mongo.authenticate(req.headers.authorization)) {
            var basicData = utils.getBasicAuthData(req.headers.authorization);
            var data = await mongo.updateDB(collection, basicData, {
                $set: req.body
            });
            console.log(data);
            if (data.result.nModified > 0 || data.result.n > 0) {
                res.json(new utils.Success(`Password updated!`));
            } else {
                res.json(new utils.Error(`Password failed to update, contact an admin for help`));
            }
        } else {
            res.status(401).send();
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(new utils.Error(err));
    }
}

// function User(_id, user, pass) {
//     this._id = _id;
//     this.username = user;
//     this.password = pass;
// }