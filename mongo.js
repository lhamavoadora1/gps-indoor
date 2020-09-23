const {
    MongoClient
} = require('mongodb'),
    utils = require('utils.js'),
    dbUrl,
    config,
    cluster;
    try {
        config = require('config.json');
        cluster = config.mongoCluster;
        dbUrl = config.url;
    } catch (error) {
        cluster = process.env.mongoCluster;
        dbUrl = process.env.mongoUrl;
    }

async function authenticate(authorization) {

    var basicData = utils.getBasicAuthData(authorization);

    var users = await findDB('users', basicData);

    return users.length;

}

async function findDB(collection, data) {

    const url = dbUrl;

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

    const url =dbUrl;

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

    const url = dbUrl;

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

    const url = dbUrl;

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