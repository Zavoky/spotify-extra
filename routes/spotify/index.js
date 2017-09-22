const router = require('express').Router()

router.get('/', (req, res) => {
  res.redirect('/spotify/main');
});

router.use('/login', require('./login'));
router.use('/callback', require('./callback'));
router.use('/main', require('./main'));

module.exports = router;
