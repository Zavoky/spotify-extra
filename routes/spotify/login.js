const router = require('express').Router()

const client_id = process.env.CLIENT_ID;
const redirect_uri = process.env.REDIRECT_URI;

router.get('/', (req, res) => {
  const scope = 'playlist-modify-public playlist-modify-private user-modify-playback-state user-read-currently-playing user-read-playback-state';
  res.redirect('https://accounts.spotify.com/authorize?response_type=code' +
    '&client_id=' + client_id +
    '&scope=' + scope +
    '&redirect_uri=' + redirect_uri);
});

module.exports = router;
