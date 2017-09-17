const config = require('./config');
const express = require('express');
const request = require('request');

var client_id = config.CLIENT_ID;
var client_secret = config.CLIENT_SECRET;
var redirect_uri = config.REDIRECT_URI;

var app = express();

app.get('/login', function(req, res) {
  var scope = 'playlist-modify-public playlist-modify-private user-modify-playback-state user-read-currently-playing';
  res.redirect('https://accounts.spotify.com/authorize?response_type=code' +
    '&client_id=' + client_id +
    '&scope=' + scope +
    '&redirect_uri=' + redirect_uri);
});


app.listen(3000)
