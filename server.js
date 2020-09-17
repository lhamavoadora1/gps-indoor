const express = require('express');
const {MongoClient} = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.get('/api/mensagem', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.listen(port, () => console.log(`Listening on port ${port}`));

const uri = "mongouri";
const mongo = new MongoClient(uri);
await mongo.connect();