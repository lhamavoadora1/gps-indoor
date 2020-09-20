const {MongoClient} = require('mongodb'),
      config = require('config.json');

// async function listDatabases(client) {
//     databasesList = await client.db().admin().listDatabases();

//     console.log("Databases:");
//     databasesList.databases.forEach(db => console.log(` - ${db.name}`));
// }

async function find(collection, data) {

    const url = config.mongoUrl;

    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {

        if (err) throw err;
        var database = db.db("GPSIndoor");

        database.collection(collection).find(data).toArray(function (err, res) {
            if (err) throw err;
            console.log(res);
            db.close();
            return res;
        });
    });
}

async function insert(collection, data) {

    const url = config.mongoUrl;

    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {

        if (err) throw err;
        var database = db.db("GPSIndoor");

        database.collection(collection).insertOne(data, function (err, res) {
            if (err) throw err;
            console.log(collection + " inserted");
            db.close();
            return res;
        });
    });
}

module.exports = {find, insert};