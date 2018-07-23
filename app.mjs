import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { inspect } from 'util';
import db from './db.mjs';
import registerSpotRoute from './routes/spot.mjs';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'SPASeeker',
  resave: false,
  saveUninitialized: true
}));
app.use(cookieParser());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} ${inspect(req.body, { colors: true }).replace(/\n/g, '')}`);
  next(null, req, res);
});

(async () => {
  db.connect();
  registerSpotRoute('/spot', app);

  const { listeningUri, listeningPort } = process.env;
  app.listen(listeningPort, () => {
    console.log(`Listening from ${listeningUri}:${listeningPort}`);
  });

})().catch(err => {
  console.error(err);
});