import path from 'path';
import Router from '@koa/router';
import { array, number, object } from 'yup';
import { codeValidator } from '../../shared/validation.js';
import {
  getDataForPair,
  checkDragonsMatchGender,
  OnsiteDragonNotFoundError,
  getDragonCodesFromHTML,
  grabHTML,
} from '../onsite.js';
import type { RequestContext } from '../types';
import config from '../config.js';
import {
  dcApiFetch,
  type DragonData,
  type GetDragonsBulkResponse,
} from '../dcApiFetch.js';
import { chunkArray } from '../../shared/utils.js';

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

router.post('/inbred', async (ctx: RequestContext) => {
  const { codes } = await object()
    .shape({
      codes: array().of(codeValidator).required(),
    })
    .validate(ctx.request.body);

  const codesPresent = await Promise.all(
    codes.map(async (code) => {
      const onsite = await grabHTML(code);
      return {
        code,
        codesInAncestry: getDragonCodesFromHTML(onsite.html).slice(1),
      };
    }),
  );

  const completeCodes = Array.from(
    new Set(codesPresent.map((dragon) => dragon.codesInAncestry).flat()),
  );

  // Resolve dragons in mass view chunks of 400.
  const resolvedDragons = (
    await Promise.all(
      chunkArray(completeCodes, 400).map(async (chunk) => {
        return dcApiFetch<GetDragonsBulkResponse>(`/dragons`, {
          method: 'POST',
          body: new URLSearchParams({
            ids: chunk.join(','),
          }),
          onResponseError() {
            throw new Error('Error in response.');
          },
        });
      }),
    )
  ).reduce((acc, chunk) => {
    return { ...acc, ...chunk.dragons };
  }, {}) as Record<string, DragonData>;

  const inbredChecks = codesPresent.map((dragon) => {
    return {
      code: dragon.code,
      codesInAncestry: dragon.codesInAncestry.map((code) => ({
        code,
        observable: code in resolvedDragons,
        name: resolvedDragons?.[code]?.name,
        conflictiveWith: (() => {
          const conflictiveAgainst: string[] = [];
          codesPresent.forEach((otherDragon) => {
            if (otherDragon.code === dragon.code) return;
            if (otherDragon.codesInAncestry.includes(code)) {
              conflictiveAgainst.push(otherDragon.code);
            }
          });
          return conflictiveAgainst;
        })(),
      })),
    };
  });

  ctx.body = { codesPresent, inbredChecks };
});

export default router;
