const { MongoClient } = require('mongodb'),
                utils = require('utils.js');
var dbUrl = "",
    config = "",
    database = "";

try {
    config = require('config.json');
    database = config.mongoDatabase;
    dbUrl = config.mongoUrl;
} catch (error) {
    database = process.env.mongoDatabase;
    dbUrl = process.env.mongoUrl;
}

async function authenticate(authorization) {

    var basicData = utils.getBasicAuthData(authorization);
    // console.log('basicData')
    // console.log(basicData)

    var users = await findDB('users', basicData);
    // console.log('users')
    // console.log(users)

    return users.length;

}

async function findDB(collection, data) {
    let client, db;
    try {
        client = await MongoClient.connect(dbUrl, {
            useUnifiedTopology: true
        });

        db = client.db(database);

        let dCollection = db.collection(collection);

        let result = await dCollection.find(data).toArray();

        removeExclusiveData(result);

        return result;

    } catch (err) {
        console.error(err);
    } finally {
        if (!utils.isUndefined(client))
            client.close();
    }
}

async function insertDB(collection, data) {
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
    findDB,
    insertDB,
    updateDB,
    deleteDB,
    deleteManyDB
};