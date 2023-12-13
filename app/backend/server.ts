import config from './config';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';

import apiRouter from './router-api';

const app = new Koa();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (ex) {
    // catch all for errors that aren't handled in the routes
    console.log(ex);
    ctx.body = {
      // give default error
      errors: [{ type: 'Error', message: config.default_error }],
    };
  }
});

//app.use(serve("/frontend"));
app.use(bodyParser()).use(apiRouter.routes()).use(apiRouter.allowedMethods());

app.listen(config.port);
process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});
