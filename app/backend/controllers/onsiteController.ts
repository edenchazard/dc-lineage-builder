import path from 'path';
import Router from '@koa/router';
import { number, object } from 'yup';
import { codeValidator } from '../../shared/validation.js';
import {
  getDataForPair,
  checkDragonsMatchGender,
  OnsiteDragonNotFoundError,
} from '../onsite.js';
import type { RequestContext } from '../types';
import config from '../config.js';

const router = new Router({
  prefix: path.join(config.apiUrl, '/onsite'),
});

router.post('/', async (ctx: RequestContext) => {
  const { male, female, options } = await object()
    .shape({
      male: codeValidator.required(),
      female: codeValidator.required(),
      options: object().shape({
        dpr: number().default(1),
      }),
    })
    .validate(ctx.request.body, {
      abortEarly: false,
    });

  try {
    // do checks such as ensuring the dragons match the gender
    const [genderChecks, pair] = await Promise.all([
      checkDragonsMatchGender([male, female]),
      getDataForPair([male, female], options),
    ]);

    const errors = [];

    for (const dragon of genderChecks) {
      if (dragon.correct === false) {
        errors.push({
          type: 'warning',
          message: `${dragon.code} is not the correct gender.`,
        });
      } else if (dragon.correct === null) {
        throw new OnsiteDragonNotFoundError(dragon.code);
      }
    }

    ctx.body = {
      errors,
      ...pair,
    };
  } catch (err) {
    console.log(err);
    if (err instanceof OnsiteDragonNotFoundError) {
      ctx.abort(404, [
        {
          type: 'error',
          message: `The dragon ${err.message} could not be found. If you're sure it exists, then it may be hidden.`,
        },
      ]);
    }

    ctx.abort(500, [
      {
        type: 'error',
        message: 'A problem occurred when contacting DragCave.',
      },
    ]);
  }
});

export default router;
