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
                // data = await mongo.updateDB(collection, {
                //     owner: ownerKey
                // }, {
                //     $set: new OauthUpsert(fullRequest)
                // });
                res.status(201).send({
                    hash: dataRetrieved[0].hash
                });
            } else {
                data = await mongo.insertDB(collection, new OauthUpsert(fullRequest));
                if (data.result.n > 0) {
                    res.status(201).send({
                        hash: hash
                    });
                } else {
                    res.status(406).send(new utils.Error(`Token failed to insert, contact an admin for help`));
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

class OauthUpsert {
    constructor(obj) {
        this.hash = obj.hash
        this.owner = obj.owner
        this.timestamp = new Date().getTime()
    }
}

async function resetTokens() {
    var dataRetrieved = await mongo.findDB(collection, {});
    for (var oauth of dataRetrieved) {
        var daysDifference = getDayDifference(new Date().getTime(), oauth.timestamp);
        if (daysDifference > 1) {
            mongo.deleteDB(collection, {hash:oauth.hash});
        }
    }
}

function getDayDifference(now, before) {
    var difference = now - before;
    var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
    return daysDifference;
}

const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler');
const scheduler = new ToadScheduler();
const task = new Task('Reset Tokens', () => {
    console.log('Resetting Tokens...');
    resetTokens();
});
const job = new SimpleIntervalJob({ hours: 1, }, task);
scheduler.addSimpleIntervalJob(job);
// when stopping your app
// scheduler.stop()