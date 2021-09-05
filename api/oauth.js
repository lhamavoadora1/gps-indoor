const express = require('express'),
    mongo = require('mongo.js'),
    utils = require('utils.js'),
    collection = 'oauth';

var router = express.Router();
router.get('/', getToken);
module.exports = router;

async function getToken(req, res) {
    try {
        var authorization = req.headers.authorization;
        if (await mongo.authenticate(authorization)) {
            var ownerKey = utils.getOwnerKey(authorization);
            var hash = utils.createHash();
            var fullRequest = {
                hash: hash,
                owner: ownerKey
            };
            var dataRetrieved = await mongo.findDB(collection, {
                owner: ownerKey
            });
            var data;
            if (!utils.isEmpty(dataRetrieved)) {
                data = await mongo.updateDB(collection, {
                    owner: ownerKey
                }, {
                    $set: fullRequest
                });
            } else {
                data = await mongo.insertDB(collection, fullRequest);
            }
            if (data.result.n > 0) {
                res.status(201).send({
                    hash: hash
                });
            } else {
                res.status(406).send(new utils.Error(`Token failed to insert, contact an admin for help`));
            }
        } else {
            res.status(401).send();
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(new utils.Error(err));
    }
}