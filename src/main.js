//console.log("Nothing here yet!");
const express = require('express');
const path = require('path');
const app = express();
const entries = require('./entries.json');

app.get('/', function (req, res) {
    res.send(entries);
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
