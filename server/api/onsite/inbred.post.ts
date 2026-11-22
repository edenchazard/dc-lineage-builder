import { array, object } from 'yup';

import { chunkArray } from '../../../app/shared/utils.js';
import { codeValidator } from '../../../app/shared/validation.js';
import { dragCaveFetch } from '../../utils/dcApiFetch.js';
import type {
  DcApiFetch,
  DragonData,
  GetDragonsBulkResponse,
} from '../../utils/dcApiFetch.js';
import { handleApiError } from '../../utils/errors.js';
import { getDragonCodesFromHTML, grabHTML } from '../../utils/onsite.js';

export async function checkInbred(
  api: DcApiFetch,
  body: unknown,
): Promise<{ checks: unknown[] }> {
  const { codes } = await object()
    .shape({
      codes: array().of(codeValidator).min(1).required(),
    })
    .validate(body);

  const checks = await Promise.all(
    codes.map(async (code: string) => {
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
        return api<GetDragonsBulkResponse>(`/dragons`, {
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
      code: dragon.code,
      name: resolvedDragons?.[dragon.code]?.name,

      problems: problems.map((ancestor) => ({
        code: ancestor.code,
        name: resolvedDragons?.[ancestor.code]?.name,
        conflicts: ancestor.conflicts,
      })),

      selfProblems: selfProblems.map((ancestor) => ({
        code: ancestor.code,
        name: resolvedDragons?.[ancestor.code]?.name,
      })),

      failed: [dragon.code, ...dragon.codesInAncestry].filter(
        (ancestor) => ancestor in resolvedDragons === false,
      ).length,
    };
  });

  return { checks: inbredChecks };
}

export default async function (event: InstanceType<typeof H3Event>) {
  try {
    return await checkInbred(dragCaveFetch(), await readBody(event));
  } catch (err) {
    return handleApiError(event, err);
  }
}
