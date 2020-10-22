require('rootpath')();
var express = require('express');
var cors = require('cors');


var app = express();
app.use(cors());

var bodyParser = require('body-parser'),
port = process.env.PORT || 5000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/tag', require('api/tag'));
app.use('/user', require('api/user'));

app.listen(port, () => console.log(`Listening on port ${port}`));

