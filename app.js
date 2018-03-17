require('dotenv').config();
const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const path = require('path');

const spotify = require('./routes/spotify/index')

const app = express();
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'hehexd',
  store: new RedisStore({ host: 'redis', port: 6379 })
}));

app.use('/spotify', spotify);

app.listen(3000)
