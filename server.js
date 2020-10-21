require('rootpath')();
const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  port = process.env.PORT || 5000
const cors = require('cors');
app.use((req, res, next) => {
	//Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", "*");
	//Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    app.use(cors());
    next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/tag', require('api/tag'));
app.use('/user', require('api/user'));

app.listen(port, () => console.log(`Listening on port ${port}`));