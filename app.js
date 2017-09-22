const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const path = require('path');

const spotify = require('./routes/spotify/index')

var app = express();
app.engine('.html', require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html')
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'hehexd',
  store: new RedisStore()
}));

app.use('/spotify', spotify);

app.listen(3000)
