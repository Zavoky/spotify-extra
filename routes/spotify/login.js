const router = require('express').Router()
const config = require('../../config');

var client_id = config.CLIENT_ID;
var redirect_uri = config.REDIRECT_URI;

router.get('/', (req, res) => {
  var scope = 'playlist-modify-public playlist-modify-private user-modify-playback-state user-read-currently-playing';
  res.redirect('https://accounts.spotify.com/authorize?response_type=code' +
    '&client_id=' + client_id +
    '&scope=' + scope +
    '&redirect_uri=' + redirect_uri);
});

module.exports = router;
