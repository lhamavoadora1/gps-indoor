require('rootpath')();
var express = require('express');
var cors = require('cors');

var config;
try {
    config = require('config.json');
} catch (error) {}

var app = express();
app.use(cors());

var port = process.env.PORT || config.PORT;

app.use(express.json({limit: '16mb'}));
app.use(express.urlencoded({limit: '16mb', extended: false}));

app.use('/map', require('api/map'));
app.use('/notification', require('api/notification'));
app.use('/oauth', require('api/oauth'));
app.use('/sector', require('api/sector'));
app.use('/sensor', require('api/sensor'));
app.use('/tag', require('api/tag'));
app.use('/user', require('api/user'));
app.use('/report', require('api/report'));

app.listen(port, () => console.log(`Listening on port ${port}`));