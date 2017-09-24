const router = require('express').Router();
const api = require('./api/index');

router.get('/', (req, res) => {
  res.redirect('/spotify/main');
});

router.use('/login', require('./login'));
router.use('/callback', require('./callback'));
router.use('/main', require('./main'));
router.use('/api', api);

module.exports = router;
