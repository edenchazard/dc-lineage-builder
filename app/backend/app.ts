import { fileURLToPath } from 'url';
import path from 'path';
import { readFile } from 'fs/promises';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';
import mount from 'koa-mount';
import { ValidationError } from 'yup';
import lineageController from './controllers/lineageController.js';
import onsiteController from './controllers/onsiteController.js';
import { ServerError, type ErrorArray } from './ServerError.js';
import { injectBreedList } from '../shared/breeds.js';
import config from './config.js';

void injectBreedList();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = new Koa();

app.context.abort = function (status: number, errors: ErrorArray) {
  this.status = status;
  throw new ServerError(errors);
};

app
  .use(mount(config.appUrl, serve(path.join(__dirname, '/static'))))
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
  .use(bodyParser())
  .use(lineageController.routes())
  .use(lineageController.allowedMethods())
  .use(onsiteController.routes())
  .use(onsiteController.allowedMethods())
  .use(async (ctx) => {
    if (ctx.body) return;

    ctx.body = await readFile(path.join(__dirname, '/static/index.html'), {
      encoding: 'utf8',
    });
  });

export default app;
