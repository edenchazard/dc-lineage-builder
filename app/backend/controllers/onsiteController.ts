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
  prefix: path.join(config.api, '/onsite'),
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
      codes: array().of(codeValidator).min(1).required(),
    })
    .validate(ctx.request.body);

  const checks = await Promise.all(
    codes.map(async (code) => {
      const onsite = await grabHTML(code);
      return {
        code,
        codesInAncestry: getDragonCodesFromHTML(onsite.html),
      };
    }),
  );

  const allAncestryCodes = Array.from(
    new Set(checks.map((dragon) => dragon.codesInAncestry).flat()),
  );

  // Resolve dragons in mass view chunks of 400.
  const resolvedDragons = (
    await Promise.all(
      chunkArray(allAncestryCodes, 400).map(async (chunk) => {
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

  const inbredChecks = checks.map((dragon) => {
    const problems = dragon.codesInAncestry
      .map((ancestorCode) => ({
        code: ancestorCode,
        name: resolvedDragons?.[ancestorCode]?.name,
        conflicts: (() => {
          const conflictiveAgainst: string[] = [];
          checks.forEach((otherDragon) => {
            if (
              dragon.code === ancestorCode ||
              ancestorCode === '0' ||
              otherDragon.code === dragon.code ||
              otherDragon.code in resolvedDragons === false
            )
              return;

            if (otherDragon.codesInAncestry.includes(ancestorCode)) {
              conflictiveAgainst.push(otherDragon.code);
            }
          });
          return conflictiveAgainst;
        })(),
      }))
      .filter((ancestor) => ancestor.conflicts.length > 0);

    const selfProblems = (() => {
      const conflictiveWithin: string[] = [];

      // Check the dragon itself to check if a dragon appears multiple times in its ancestry.
      const uniqueAncestry = new Set(dragon.codesInAncestry);

      uniqueAncestry.forEach((ancestorCode) => {
        if (
          ancestorCode === '0' ||
          ancestorCode === dragon.code ||
          ancestorCode in resolvedDragons === false
        )
          return;

        if (
          dragon.codesInAncestry.filter((code) => code === ancestorCode)
            .length > 1
        ) {
          conflictiveWithin.push(ancestorCode);
        }
      });

      return conflictiveWithin.map((ancestorCode) => ({
        code: ancestorCode,
        name: resolvedDragons?.[ancestorCode]?.name,
      }));
    })();

    return {
      // The dragon we're checking.
      code: dragon.code,
      name: resolvedDragons?.[dragon.code]?.name,

      // The ancestry of this checked dragon.
      problems: problems.map((ancestor) => ({
        code: ancestor.code,
        name: resolvedDragons?.[ancestor.code]?.name,
        conflicts: ancestor.conflicts,
      })),

      // Inbreed conflicts within dragon itself.
      selfProblems: selfProblems.map((ancestor) => ({
        code: ancestor.code,
        name: resolvedDragons?.[ancestor.code]?.name,
      })),

      failed: [dragon.code, ...dragon.codesInAncestry].filter(
        (ancestor) => ancestor in resolvedDragons === false,
      ).length,
    };
  });

  ctx.body = { checks: inbredChecks };
});

export default router;
