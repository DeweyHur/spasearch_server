import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import _ from 'lodash';
import mongoose from 'mongoose';
import path from 'path';
import util from 'util';
import config from './config/local.mjs';

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
  console.log(`${req.method} ${req.url} ${util.inspect(req.body, { colors: true }).replace(/\n/g, '')}`);
  next(null, req, res);
});

let connection = `mongodb+srv://${config.mongodb.username}:${config.mongodb.password}@cluster0-zcgfb.gcp.mongodb.net/test?retryWrites=true`;
console.log(`Connecting to DB.. ${connection}`);
let db = mongoose.connection;
db.on('error', (err) => {
  console.log('connection error:', err);
});
db.once('open', (callback) => {
  console.log('db open');
  const { address, port } = config;
  app.listen(port, () => {
    console.log(`Listening from ${address}:${port}`);
  });
});
mongoose.connect(connection, { useNewUrlParser: true });

let router = express.Router();
app.get('/', (req, res) => {

});