const {
    MongoClient
} = require('mongodb'),
    config = require('config.json'),
    cluster = 'GPSIndoor';

// async function listDatabases(client) {
//     databasesList = await client.db().admin().listDatabases();

//     console.log("Databases:");
//     databasesList.databases.forEach(db => console.log(` - ${db.name}`));
// }

async function find(collection, data) {

    const url = config.mongoUrl;

    console.log('checkpoint 1');

    let client, db;
    try {
        console.log('checkpoint 2');
        client = await MongoClient.connect(url, {
            useUnifiedTopology: true
        });
        console.log('checkpoint 3');

        db = client.db(cluster);

        let dCollection = db.collection(collection);

        let result = await dCollection.find(data).toArray();
        console.log('checkpoint 4');

        return result;

    } catch (err) {
        console.error(err);
    } finally {
        client.close();
    }

    // MongoClient.connect(url, { useUnifiedTopology: true })
    //     .then(function (db) {
    //         console.log('checkpoint 2');

    //         var database = db.db(cluster);

    //         database.collection(collection).find(data).toArray(function (err, res) {
    //             console.log('checkpoint 3');
    //             db.close();
    //             if (err) throw err;
    //             console.log(res);
    //             return res;
    //         });
    //         console.log('checkpoint 3.1');
    //     })
    //     .catch(function(err) {
    //         console.log(err);
    //         throw err;
    //     });

    console.log('checkpoint 3.2');
}

function insert(collection, data) {

    const url = config.mongoUrl;

    MongoClient.connect(url, {
        useUnifiedTopology: true
    }, function (err, db) {

        if (err) throw err;
        var database = db.db(cluster);

        database.collection(collection).insertOne(data, function (err, res) {
            db.close();
            if (err) throw err;
            console.log(collection + " inserted");
            return res;
        });
    });
}

module.exports = {
    find,
    insert
};