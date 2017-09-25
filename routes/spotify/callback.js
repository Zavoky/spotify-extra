const router = require('express').Router();
const request = require('request');
const config = require('../../config');

var client_id = config.CLIENT_ID;
var client_secret = config.CLIENT_SECRET;
var redirect_uri = config.REDIRECT_URI;

router.get('/', (req, res) => {
  var code = req.query.code;

  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    json: true
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      req.session.access_token = body.access_token;
      req.session.refresh_token = body.refresh_token;
      req.session.expires_in = body.expires_in;
      req.session.time = Math.floor(Date.now() / 1000);
      res.redirect('/spotify/main');
    }
    else {
      console.log('Error: Auth');
      console.log(body);
    }
  });
});

module.exports = router;
