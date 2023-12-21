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
    } catch (err) {
      if (err instanceof ValidationError) {
        ctx.body = { errors: err.errors };
        ctx.status = 422;
      } else {
        ctx.status = ctx.status || 500;
        ctx.body = {
          errors: (err as Record<string, unknown>).errors ?? [
            'Sorry, an error has occurred :(',
          ],
        };
      }
    }
  })
  .use(bodyParser())
  .use(lineageController.routes())
  .use(lineageController.allowedMethods())
  .use(onsiteController.routes())
  .use(onsiteController.allowedMethods());

export default app;
