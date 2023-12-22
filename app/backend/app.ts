import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';
import { ValidationError } from 'yup';
import lineageController from './controllers/lineageController.js';
import onsiteController from './controllers/onsiteController.js';
import { ServerError, type ErrorArray } from './serverError.js';
import { injectBreedList } from '../shared/breeds.js';

injectBreedList();

const app = new Koa();

app.context.abort = function (status: number, errors: ErrorArray) {
  this.status = status;
  throw new ServerError(errors);
};

app
  .use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      if (err instanceof ValidationError) {
        ctx.status = 422;
        ctx.body = { errors: err.errors };
      } else if (err instanceof ServerError) {
        ctx.body = {
          errors: err.errors ?? [{ type: 'error', message: 'Not found' }],
        };
      } else {
        ctx.status = ctx.status || 500;
        ctx.body = {
          errors: (err as Record<string, unknown>)?.errors ?? [
            { type: 'error', message: 'Sorry, an error has occurred :(' },
          ],
        };
      }
    }
  })
  .use(serve('./index.html'))
  .use(serve('./assets'))
  .use(bodyParser())
  .use(lineageController.routes())
  .use(lineageController.allowedMethods())
  .use(onsiteController.routes())
  .use(onsiteController.allowedMethods());

export default app;
