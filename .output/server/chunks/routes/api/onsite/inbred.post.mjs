import { d as defineEventHandler, a as getMethod, c as createError, r as readBody } from '../../../nitro/nitro.mjs';
import { object, array } from 'yup';
import { c as codeValidator } from '../../../_/validation.mjs';
import { g as grabHTML, a as getDragonCodesFromHTML, c as createDcApiFetch } from '../../../_/onsite.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'unique-names-generator';
import 'node-html-parser';

function chunkArray(arr, size) {
  return Array.from(
    { length: Math.ceil(arr.length / size) },
    (_, i) => arr.slice(i * size, i * size + size)
  );
}

const inbred_post = defineEventHandler(async (event) => {
  if (getMethod(event) !== "POST") {
    throw createError({
      statusCode: 405,
      statusMessage: "Method Not Allowed"
    });
  }
  const body = await readBody(event);
  const { codes } = await object().shape({
    codes: array().of(codeValidator).min(1).required()
  }).validate(body);
  const checks = await Promise.all(
    codes.map(async (code) => {
      const onsite = await grabHTML(code);
      return {
        code,
        codesInAncestry: getDragonCodesFromHTML(onsite.html)
      };
    })
  );
  const allAncestryCodes = Array.from(
    new Set(checks.map((dragon) => dragon.codesInAncestry).flat())
  );
  const dcApiFetch = createDcApiFetch();
  const resolvedDragons = (await Promise.all(
    chunkArray(allAncestryCodes, 400).map(async (chunk) => {
      return dcApiFetch(`/dragons`, {
        method: "POST",
        body: new URLSearchParams({
          ids: chunk.join(",")
        }),
        onResponseError() {
          throw new Error("Error in response.");
        }
      });
    })
  )).reduce((acc, chunk) => {
    return { ...acc, ...chunk.dragons };
  }, {});
  const inbredChecks = checks.map((dragon) => {
    var _a;
    const problems = dragon.codesInAncestry.map((ancestorCode) => {
      var _a2;
      return {
        code: ancestorCode,
        name: (_a2 = resolvedDragons == null ? void 0 : resolvedDragons[ancestorCode]) == null ? void 0 : _a2.name,
        conflicts: (() => {
          const conflictiveAgainst = [];
          checks.forEach((otherDragon) => {
            if (dragon.code === ancestorCode || ancestorCode === "0" || otherDragon.code === dragon.code || otherDragon.code in resolvedDragons === false)
              return;
            if (otherDragon.codesInAncestry.includes(ancestorCode)) {
              conflictiveAgainst.push(otherDragon.code);
            }
          });
          return conflictiveAgainst;
        })()
      };
    }).filter((ancestor) => ancestor.conflicts.length > 0);
    const selfProblems = (() => {
      const conflictiveWithin = [];
      const uniqueAncestry = new Set(dragon.codesInAncestry);
      uniqueAncestry.forEach((ancestorCode) => {
        if (ancestorCode === "0" || ancestorCode === dragon.code || ancestorCode in resolvedDragons === false)
          return;
        if (dragon.codesInAncestry.filter((code) => code === ancestorCode).length > 1) {
          conflictiveWithin.push(ancestorCode);
        }
      });
      return conflictiveWithin.map((ancestorCode) => {
        var _a2;
        return {
          code: ancestorCode,
          name: (_a2 = resolvedDragons == null ? void 0 : resolvedDragons[ancestorCode]) == null ? void 0 : _a2.name
        };
      });
    })();
    return {
      // The dragon we're checking.
      code: dragon.code,
      name: (_a = resolvedDragons == null ? void 0 : resolvedDragons[dragon.code]) == null ? void 0 : _a.name,
      // The ancestry of this checked dragon.
      problems: problems.map((ancestor) => {
        var _a2;
        return {
          code: ancestor.code,
          name: (_a2 = resolvedDragons == null ? void 0 : resolvedDragons[ancestor.code]) == null ? void 0 : _a2.name,
          conflicts: ancestor.conflicts
        };
      }),
      // Inbreed conflicts within dragon itself.
      selfProblems: selfProblems.map((ancestor) => {
        var _a2;
        return {
          code: ancestor.code,
          name: (_a2 = resolvedDragons == null ? void 0 : resolvedDragons[ancestor.code]) == null ? void 0 : _a2.name
        };
      }),
      failed: [dragon.code, ...dragon.codesInAncestry].filter(
        (ancestor) => ancestor in resolvedDragons === false
      ).length
    };
  });
  return { checks: inbredChecks };
});

export { inbred_post as default };
//# sourceMappingURL=inbred.post.mjs.map
