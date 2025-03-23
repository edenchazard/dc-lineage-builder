import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from '@koa/router';

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

const screenshotController = new Router();

screenshotController.post('/', (ctx) => {
  ctx.status = 201;

  ctx.body = {};
});

const app = new Koa()
  .use(bodyParser())
  .use(screenshotController.routes())
  .use(screenshotController.allowedMethods())
  .listen(3000, () => console.info(`Listening to http://localhost:3000 🚀`));

export default app;
