require('rootpath')();
const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  port = process.env.PORT || 5000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/tag', require('api/tag'));
app.use('/user', require('api/user'));

app.listen(port, () => console.log(`Listening on port ${port}`));