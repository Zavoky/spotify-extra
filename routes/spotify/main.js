const router = require('express').Router()

router.get('/', (req, res) => {
  if (req.session.access_token) {
    var options = {
      url: 'https://api.spotify.com/v1/me/playlists',
      headers: { 'Authorization': 'Bearer ' + req.session.access_token },
      json: true
    };
    request.get(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        res.send(body);
      }
      else {
        console.log('Error');
        console.log(error);
      }
    });
  }
  else {
    res.send('not authorized for this');
  }
});

module.exports = router;
