const router = require('express').Router();
const request = require('request');

router.get('/', (req, res) => {
  const options = getOptions('/v1/me', req.session.access_token); 
  if (!req.session.userID) {
    request.get(options, (error, response, body) => {
      if (!error && response.statusCode == 200) { 
        req.session.userID = body.id;
        console.log('User ID recieved');
      }
      else {
      	console.log('User ID not recieved');
        res.sendStatus(response.statusCode);
      }
    });
  }
  getCurrentlyPlaying(req, res, () => { deleteSong(req, res, () => { skipSong(req, res) }) });
});

function getOptions(URL, token) {
  return {
    url: 'https://api.spotify.com' + URL,
    headers: { 'Authorization': 'Bearer ' + token },
    json: true
  };
};

function getCurrentlyPlaying(req, res, callback) {
  const options = getOptions('/v1/me/player/currently-playing', req.session.access_token);
  request.get(options, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      if (body.context.type == 'playlist') {
        const playlistURI = body.context.uri;
        req.session.playlistID = playlistURI.substr(playlistURI.lastIndexOf(':') + 1);
        req.session.trackURI = body.item.uri;
        console.log('Playlist and Track URI recieved');
      	callback();
      }
      else {
        console.log('Not a playlist');
	      console.log(body);
      }
    }
    else {
      console.log('Current playback not recieved');
      res.sendStatus(response.statusCode);
    }
  });
};

function deleteSong(req, res, callback) {
  const options = getOptions('/v1/users/' + req.session.userID + '/playlists/' + req.session.playlistID + '/tracks', req.session.access_token); 
  const delOptions = {
    'Content-Type': 'application/json',
    body: {
      tracks: [{ 'uri': req.session.trackURI }]
    }
  };
  options = Object.assign(options, delOptions);
  request.del(options, (error, response, body) => { 
    if (!error && response.statusCode === 200) {
      console.log('Song deleted');
      callback();
    }
    else {
      console.log('Song not deleted');
      res.sendStatus(response.statusCode);
    }
  });
};

function skipSong(req, res) {
  const options = getOptions('/v1/me/player/next', req.session.access_token);
  request.post(options, (error, response, body) => {
    if (!error && response.statusCode === 204) {
      console.log('Song skipped');
      res.sendStatus(204);
    }
    else {
      console.log('Song not skipped');
      res.sendStatus(response.statusCode);
    }
  });
};

module.exports = router;
