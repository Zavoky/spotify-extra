const router = require('express').Router();
const request = require('request');
const config = require('../../config');

var client_id = config.CLIENT_ID;
var client_secret = config.CLIENT_SECRET;
var redirect_uri = config.REDIRECT_URI;

router.get('/', (req, res) => {
  var code = req.query.code;
  req.session.code = code;
  req.session.save();

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
      res.redirect('/spotify/main');
    }
    else {
      console.log('oauth error');
      console.log(error);
      res.send('error in authentication');
    }
  });
});

module.exports = router;
