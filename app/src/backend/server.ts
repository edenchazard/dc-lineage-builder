import GLOBALS from '../shared/globals';
import config from './config.js';
import mysql from 'mysql2/promise';

import Koa from 'koa';
/*const serve = require('koa-static');
const mount = require('koa-mount');
const send  = require('koa-send');*/
import bodyParser from 'koa-bodyparser';

import apirouter from './router-api';

const app = new Koa();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (ex) {
    // catch all for errors that aren't handled in the routes
    console.log(ex);
    ctx.body = {
      // give default error
      errors: [{ type: 'Error', message: GLOBALS.default_error }],
    };
  }
});

//app.use(serve("/frontend"));
app.use(bodyParser()).use(apirouter.routes()).use(apirouter.allowedMethods());

GLOBALS.pool = mysql.createPool({
  ...config.db,
  waitForConnections: true,
});

app.listen(config.port);

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});
