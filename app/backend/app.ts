import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFile } from 'fs/promises';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';
import mount from 'koa-mount';
import Router from '@koa/router';
import { ValidationError } from 'yup';
import lineageController from './controllers/lineageController.js';
import onsiteController from './controllers/onsiteController.js';
import { ServerError, type ErrorArray } from './ServerError.js';
import { injectBreedList } from '../shared/breeds.js';
import useConfig from './useConfig.js';

const config = useConfig();

const __dirname = dirname(fileURLToPath(import.meta.url));

void injectBreedList();

const app = new Koa();

app.context.abort = function (status: number, errors: ErrorArray) {
  this.status = status;
  throw new ServerError(errors);
};

function controller(controller: Router) {
  return [controller.routes(), controller.allowedMethods()];
}

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
  .use(bodyParser())
  .use(
    new Router()
      .prefix(config.apiUrl)
      .use('/lineage', ...controller(lineageController))
      .use('/onsite', ...controller(onsiteController))
      .routes(),
  )
  .use(mount(config.appUrl, serve(join(__dirname, '/static'))))
  .use(async (ctx) => {
    if (ctx.body) return;

    ctx.body = await readFile(join(__dirname, '/static/index.html'), {
      encoding: 'utf8',
    });
  });

export default app;
