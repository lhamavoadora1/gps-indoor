const {
    MongoClient
} = require('mongodb'),
    utils = require('utils.js'),
    config = require('config.json'),
    cluster = config.mongoCluster;

async function authenticate(authorization) {

    var basicData = utils.getBasicAuthData(authorization);

    var users = await findDB('users', basicData);

    return users.length;

}

async function findDB(collection, data) {

    const url = config.mongoUrl;

    let client, db;
    try {
        client = await MongoClient.connect(url, {
            useUnifiedTopology: true
        });

        db = client.db(cluster);

        let dCollection = db.collection(collection);

        let result = await dCollection.find(data).toArray();

        return result;

    } catch (err) {
        console.error(err);
    } finally {
        client.close();
    }
}

async function insertDB(collection, data) {

    const url = config.mongoUrl;

    try {
        client = await MongoClient.connect(url, {
            useUnifiedTopology: true
        });

        db = client.db(cluster);

        let dCollection = db.collection(collection);

        let result = await dCollection.insertOne(data);

        return result;

    } catch (err) {
        console.error(err);
    } finally {
        client.close();
    }
}

async function updateDB(collection, keyData, data) {

    const url = config.mongoUrl;

    try {
        client = await MongoClient.connect(url, {
            useUnifiedTopology: true
        });

        db = client.db(cluster);

        let dCollection = db.collection(collection);

        let result = await dCollection.updateOne(keyData, data);

        return result;

    } catch (err) {
        console.error(err);
    } finally {
        client.close();
    }
}

async function deleteDB(collection, keyData) {

    const url = config.mongoUrl;

    try {
        client = await MongoClient.connect(url, {
            useUnifiedTopology: true
        });

        db = client.db(cluster);

        let dCollection = db.collection(collection);

        let result = await dCollection.deleteOne(keyData);

        return result;

    } catch (err) {
        console.error(err);
    } finally {
        client.close();
    }
}

module.exports = {
    authenticate,
    findDB,
    insertDB,
    updateDB,
    deleteDB
};