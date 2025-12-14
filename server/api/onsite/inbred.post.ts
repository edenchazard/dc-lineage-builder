import { array, object } from 'yup';
import { chunkArray } from '~~/shared/utils';
import { codeValidator } from '~~/shared/validation';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { codes } = await object()
    .shape({
      codes: array().of(codeValidator).min(1).required(),
    })
    .validate(body);

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

  return { checks: inbredChecks };
});
