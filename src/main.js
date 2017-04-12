//console.log("Nothing here yet!");
const entries = require('./entries.json');

var express = require('express');
var path = require('path'); // модуль для парсинга пути
var app = express();


app.get('/api', function (req, res) {
    res.send('API is running');
});

app.post('/', function (req, res) {
  res.send('Got a POST request');
});

app.put('/user', function (req, res) {
  res.send('Got a PUT request at /user');
});

app.delete('/user', function (req, res) {
  res.send('Got a DELETE request at /user');
});

app.listen(1337, function(){
    console.log('Express server listening on port 1337');
});
