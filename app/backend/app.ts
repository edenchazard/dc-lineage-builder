import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { ValidationError } from 'yup';
import lineageController from './controllers/lineageController';
import onsiteController from './controllers/onsiteController';

const app = new Koa();

app
  .use(async (ctx, next) => {
    try {
      await next();
    } catch (ex) {
      if (ex instanceof ValidationError) {
        ctx.body = {
          errors: ex.errors,
        };
      } else {
        ctx.status = 403;
      }
    }
  })
  .use(bodyParser())
  .use(lineageController.routes())
  .use(lineageController.allowedMethods())
  .use(onsiteController.routes())
  .use(onsiteController.allowedMethods());

export default app;
