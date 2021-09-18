const express = require('express'),
    mongo = require('mongo.js'),
    utils = require('utils.js'),
    collection = 'users';

var router = express.Router();
router.patch('/', updateUser);
module.exports = router;

async function updateUser(req, res) {
    try {
        var authorization = req.headers.authorization;
        var authData = await mongo.authenticateToken(authorization);
        if (authData) {
            var data = await mongo.updateDB(collection, {
                username: utils.getOwnerName(authData.owner)
            }, {
                $set: new UserUpdate(req.body)
            });
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

class UserUpdate {
    constructor(user) {
        this.password = user.password;
    }
}