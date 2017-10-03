const router = require('express').Router()
const request = require('request');
const path = require('path');
const config = require('../../config');

const client_id = config.CLIENT_ID;
const client_secret = config.CLIENT_SECRET;

router.get('/', (req, res) => {
  if (req.session.access_token) {
    if (token_expired(req.session.expires_in, req.session.time)) {
      console.log('Token expired, refreshing');
      var refreshOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
        form: {
          grant_type: 'refresh_token',
          refresh_token: req.session.refresh_token
        },
        json: true
      };
      
      request.post(refreshOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          req.session.access_token = body.access_token;
          res.sendFile(path.join(__dirname, '../../public/html/main.html'));
        }
        else {
          console.log('Error: Refresh token');
          console.log(error);
          res.sendStatus(response.statusCode);
        }
      });
    }
    else {
      res.sendFile(path.join(__dirname, '../../public/html/main.html'));
    }
  }
  else {
    res.redirect('/spotify/login');
  }
});

function token_expired(expires_in, time) {
  current_time = Math.floor(Date.now() / 1000);
  return (current_time - time) > expires_in;
};

module.exports = router;
