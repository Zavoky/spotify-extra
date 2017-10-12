const router = require('express').Router();
const api = require('./api/index');

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

router.get('/', (req, res) => {
  res.redirect('/spotify/login');
});

router.use('/login', require('./login'));
router.use('/auth', require('./auth'));
router.use('/main', isAuthenticated, require('./main'));
router.use('/api', isAuthenticated, api);

function isAuthenticated(req, res, next) {
  if (req.session.access_token) {
    // Check if token is expired
    const current_time = Math.floor(Date.now() / 1000);
    const expired = (current_time - req.session.time) > req.session.expires_in;
    if (expired) { 
      const refreshOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic '+ (new Buffer(client_id + ':' + client_secret).toString('base64')) },
        form: {
          grant_type: 'refresh_token',
          refresh_token: req.session.refresh_token
        },
        json: true
      };
      
      request.post(refreshOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          req.session.access_token = body.access_token;
          return next();
        }
        else {
          console.log('Error: Refresh token');
          console.log(error);
          res.sendStatus(response.statusCode);
        }
      });
    }
    else {
      return next();
    }
  }
  res.redirect('/spotify/login');
}; 

module.exports = router;
