const express = require('express'),
    mongo = require('mongo.js'),
    utils = require('utils.js'),
    collection = 'images';

var router = express.Router();
router.get('/:image_name', getImage);
router.post('/', insertImage);
router.patch('/:image_name', updateImage);
router.delete('/:image_name', deleteImage);
module.exports = router;

async function getImage(req, res) {
    try {
        var authorization = req.headers.authorization;
        if (await mongo.authenticate(authorization)) {
            var ownerKey = utils.getOwnerKey(authorization);
            var imagesRetrieved = await mongo.findDB(collection, {
                image_name: req.params.image_name,
                owner: ownerKey
            });
            if (!utils.isEmpty(imagesRetrieved)) {
                res.send({
                    imagesRetrieved
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

async function insertImage(req, res) {
    try {
        if (utils.checkSizeInBytes(JSON.stringify(new ImageInsert(req.body)))) {
            var authorization = req.headers.authorization;
            if (await mongo.authenticate(authorization)) {
                var image_name = req.body.image_name;
                if (utils.isEmpty(image_name)) {
                    res.status(400).send(new utils.Error(`image_name is empty!`));
                } else {
                    var ownerKey = utils.getOwnerKey(authorization);
                    var imagesRetrieved = await mongo.findDB(collection, {
                        image_name: image_name,
                        owner: ownerKey
                    });
                    if (!utils.isEmpty(imagesRetrieved)) {
                        res.status(406).send(new utils.Error(`Image '${image_name}' is already in database!`));
                    } else {
                        var fullRequest = new ImageInsert(req.body);
                        fullRequest.owner = ownerKey;
                        var data = await mongo.insertDB(collection, fullRequest);
                        if (data.result.n > 0) {
                            res.status(201).send(new utils.Success(`Image '${image_name}' inserted!`));
                        } else {
                            res.status(406).send(new utils.Error(`Image '${image_name}' failed to insert, contact an admin for help`));
                        }
                    }
                }
            } else {
                res.status(401).send();
            }
        } else {
            res.status(413).send();
        }
    } catch (err) {
        console.log('Body from request may be in the wrong format:');
        console.log(req.body)
        console.error(err);
        res.status(500).send(new utils.Error(err));
    }
}

async function updateImage(req, res) {
    try {
        if (utils.checkSizeInBytes(JSON.stringify(new ImageInsert(req.body)))) {
            var authorization = req.headers.authorization;
            if (await mongo.authenticate(authorization)) {
                var image_name = req.params.image_name;
                var ownerKey = utils.getOwnerKey(authorization);
                var data = await mongo.updateDB(collection, {
                    image_name: image_name,
                    owner: ownerKey
                }, {
                    $set: new ImageUpdate(req.body)
                });
                if (data.result.nModified > 0 || data.result.n > 0) {
                    res.send(new utils.Success(`Image '${image_name}' updated!`));
                } else {
                    res.status(406).send(new utils.Error(`Image '${image_name}' failed to update, verify if the id is correct and try again`));
                }
            } else {
                res.status(401).send();
            }
        } else {
            res.status(413).send();
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(new utils.Error(err));
    }
}

async function deleteImage(req, res) {
    try {
        var authorization = req.headers.authorization;
        if (await mongo.authenticate(authorization)) {
            var image_name = req.params.image_name;
            var ownerKey = utils.getOwnerKey(authorization);
            var data = await mongo.deleteDB(collection, {
                image_name: image_name,
                owner: ownerKey
            });
            if (data.result.n > 0) {
                res.send(new utils.Success(`Image '${image_name}' deleted!`));
            } else {
                res.status(406).send(new utils.Error(`Image '${image_name}' failed to delete, verify if the id is correct and try again`));
            }
        } else {
            res.status(401).send();
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(new utils.Error(err));
    }
}

class ImageInsert {
    constructor(image) {
        this.image_name = image.image_name;
        this.blob_value = image.blob_value;
    }
}
class ImageUpdate {
    constructor(image) {
        this.blob_value = image.blob_value;
    }
}