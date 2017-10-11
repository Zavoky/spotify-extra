const router = require('express').Router();
const request = require('request');

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;

router.get('/', (req, res) => {
  const code = req.query.code;

  const authOptions = {
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
