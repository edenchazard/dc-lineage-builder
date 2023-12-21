import { object, boolean } from 'yup';
import { codeValidator } from '../../shared/validation';
import {
  getDataForPair,
  checkDragonsMatchGender,
  OnsiteError,
} from '../onsite';
import Router from '@koa/router';
import type { RequestContext } from '../types';
import config from '../config';

const router = new Router({
  prefix: config.apiPath + '/onsite',
});

router.post('/', async (ctx: RequestContext) => {
  const { male, female, doChecks } = await object()
    .shape({
      doChecks: boolean().default(false),
      male: codeValidator.required(),
      female: codeValidator.required(),
    })
    .validate(ctx.request.body, {
      abortEarly: false,
    });

  // do checks if applicable, such as ensuring the dragons match the gender
  if (doChecks) {
    const genderChecks = await checkDragonsMatchGender([male, female]);

    const errors = [];

    for (const dragon of genderChecks) {
      if (dragon.correct === false) {
        errors.push({
          type: 'warning',
          message: `${dragon.code} is not the correct gender.`,
        });
      } else if (dragon.correct === null) {
        errors.push({
          type: 'error',
          message: `${dragon.code} couldn't be looked at for gender check. It may not exist.`,
        });
      }
    }

    if (errors.length) {
      // try to fetch the html for both codes as long as neither were an outright
      // failure
      if (errors.find((e) => e.type === 'error')) {
        ctx.throw(404, { errors });
      }

      ctx.body = { errors };
    }
  }

  try {
    const pair = await getDataForPair([male, female]);
    ctx.body = {
      ...(ctx.body ?? {}),
      ...pair,
    };
  } catch (err) {
    if (err instanceof OnsiteError) {
      if (err.message.startsWith('Dragon not found')) {
        ctx.throw(404);
      }
    }
  }
});

export default router;
