const router = require('express').Router();
const request = require('request');

router.get('/', (req, res) => {
  var options = getOptions('/v1/me', req.session.access_token); 
  if (!req.session.id) {
    request.get(options, (error, response, body) => {
      if (!error && response.statusCode == 200) { 
        req.session.id = body.id;
        console.log('User ID recieved');
      }
      else {
        res.send(body);
        return;
      }
    });
  }

  options = getOptions('/v1/me/player/current-playing', req.session.access_token);
  var playlistID;
  var trackURI;
  request.get(options, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      if (body.context.type == 'playlist') {
        var playlistURI = body.context.uri;
        playlistID = playlistURI.substr(playlistURI.lastIndexOf(':') + 1);
        trackURI = body.item.uri;
        console.log('Playlist and Track URI recieved');
      }
      else {
        console.log(body.context.type)
        console.log('that is not a playlist');
      }
    }
    else {
      console.log('Error');
      console.log(body);
      res.send('Currently playing broke');
      return;
    }
  });

  options = getOptions('/v1/users/' + req.session.id + '/playlists/' + playlistID + '/tracks', req.session.access_token); 
  delOptions = {
    'Content-Type': 'application/json',
    form: {
      tracks: [{ 'uri': trackURI }]
    }
  };
  options = Object.assign(options, delOptions);
  request.del(options, (error, response, body) => { 
    if (!error && response.statusCode === 200) {
      console.log('Song deleted');
    }
    else {
      console.log('Error');
      console.log(body);
      res.send('Deleting broke');
      return;
    }
  });
  
  options = getOptions('/v1/me/player/next', req.session.access_token);
  request.post(options, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      console.log('Song skipped');
    }
    else {
      console.log('Error');
      console.log(body);
      res.send('Skipping broke');
      return;
    }
  });
  res.send('Success');
});

function getOptions(URL, token) {
  return {
    url: 'https://api.spotify.com' + URL,
    headers: { 'Authorization': 'Bearer ' + token },
    json: true
  };
};

module.exports = router;
