const express = require('express'),
    mongo = require('mongo.js'),
    utils = require('utils.js'),
    collection = 'users';


var router = express.Router();
// router.post('/', insertUser);
router.patch('/', updateUser);
module.exports = router;

async function insertUser(req, res) {
    try {
        var pass = req.body.password;
        var username = req.body.username;
        var encryptedPassword = utils.encryptRSA(pass);
        var usersRetrieved = await mongo.findDB(collection, {username:username});
        if (!utils.isEmpty(usersRetrieved)) {
            res.status(406).send(new utils.Error(`User '${username}' is already in database!`));
        } else {
            var data = await mongo.insertDB(collection, new UserInsert({
                username: username,
                password: encryptedPassword
            }));
            if (data.result.n > 0) {
                res.send(new utils.Success(`User inserted!`));
            } else {
                res.status(406).send(new utils.Error(`Password failed to update, contact an admin for help`));
            }
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(new utils.Error(err));
    }
}

async function updateUser(req, res) {
    try {
        var authorization = req.headers.authorization;
        var authData = await mongo.authenticateToken(authorization);
        if (authData) {
            var username = utils.getOwnerName(authData.owner);
            var password = utils.encryptRSA(req.body.password);
            var data = await mongo.updateDB(collection, {
                username: username
            }, {
                $set: new UserUpdate({
                    username: username,
                    password: password
                })
            });
            if (data.result.nModified > 0 || data.result.n > 0) {
                res.send(new utils.Success(`Password updated!`));
            } else {
                res.status(406).send(new utils.Error(`Password failed to update, contact an admin for help`));
            }
        } else {
            res.status(401).send();
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(new utils.Error(err));
    }
}

class UserInsert {
    constructor(user) {
        this.username = user.username;
        this.password = user.password;
    }
}

class UserUpdate {
    constructor(user) {
        this.password = user.password;
    }
}