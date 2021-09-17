const { MongoClient } = require('mongodb'),
                utils = require('utils.js');

var config;
try {
    config = require('config.json');
} catch (error) {}

var database = process.env.mongoDatabase || config.mongoDatabase,
       dbUrl = process.env.mongoUrl || config.mongoUrl;

async function authenticate(authorization) {
    var basicData = utils.getBasicAuthData(authorization);
    // console.log('basicData')
    // console.log(basicData)
    var users = await findDB('users', basicData);
    // console.log('users')
    // console.log(users)
    return users.length;
}

async function authenticateToken(authorization) {
    var tokenData = utils.getBearerData(authorization);
    // console.log('tokenData')
    // console.log(tokenData)
    var oauth = await findDBRaw('oauth', tokenData);
    // console.log('oauth')
    // console.log(oauth)
    return oauth[0];
}

async function findDB(collection, data) {
    var result = await findDBRaw(collection, data);
    removeExclusiveData(result);
    return result;
}

async function findDBRaw(collection, data) {
    let client, db;
    try {
        client = await MongoClient.connect(dbUrl, {
            useUnifiedTopology: true
        });
        db = client.db(database);
        let dCollection = db.collection(collection);
        let result = await dCollection.find(data).toArray();
        return result;
    } catch (err) {
        console.error(err);
    } finally {
        if (!utils.isUndefined(client))
            client.close();
    }
}

async function insertDB(collection, data) {
    let client, db;
    try {
        client = await MongoClient.connect(dbUrl, {
            useUnifiedTopology: true
        });
        db = client.db(database);
        let dCollection = db.collection(collection);
        let result = await dCollection.insertOne(data);
        return result;
    } catch (err) {
        console.error(err);
    } finally {
        if (!utils.isUndefined(client))
            client.close();
    }
}

async function updateDB(collection, keyData, data) {
    let client, db;
    try {
        client = await MongoClient.connect(dbUrl, {
            useUnifiedTopology: true
        });
        db = client.db(database);
        let dCollection = db.collection(collection);
        let result = await dCollection.updateOne(keyData, data);
        return result;
    } catch (err) {
        console.error(err);
    } finally {
        if (!utils.isUndefined(client))
            client.close();
    }
}

async function deleteDB(collection, keyData) {
    let client, db;
    try {
        client = await MongoClient.connect(dbUrl, {
            useUnifiedTopology: true
        });
        db = client.db(database);
        let dCollection = db.collection(collection);
        let result = await dCollection.deleteOne(keyData);
        return result;
    } catch (err) {
        console.error(err);
    } finally {
        if (!utils.isUndefined(client))
            client.close();
    }
}

async function deleteManyDB(collection, keyData) {
    let client, db;
    try {
        client = await MongoClient.connect(dbUrl, {
            useUnifiedTopology: true
        });
        db = client.db(database);
        let dCollection = db.collection(collection);
        let result = await dCollection.deleteMany(keyData);
        return result;
    } catch (err) {
        console.error(err);
    } finally {
        if (!utils.isUndefined(client))
            client.close();
    }
}

function removeExclusiveData(json) {
    if (utils.isIterable(json)) {
        for (var index in json) {
            delete json[index]['_id'];
            delete json[index]['owner'];
        }
    } else {
        delete json['_id'];
        delete json['owner'];
    }
}

module.exports = {
    authenticate,
    authenticateToken,
    findDB,
    insertDB,
    updateDB,
    deleteDB,
    deleteManyDB
};