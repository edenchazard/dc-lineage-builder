import { d as defineEventHandler, a as getMethod, c as createError, r as readBody } from '../../nitro/nitro.mjs';
import { object, number } from 'yup';
import { c as codeValidator } from '../../_/validation.mjs';
import { b as checkDragonsMatchGender, d as getDataForPair, O as OnsiteDragonNotFoundError } from '../../_/onsite.mjs';
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

const index_post = defineEventHandler(async (event) => {
  if (getMethod(event) !== "POST") {
    throw createError({
      statusCode: 405,
      statusMessage: "Method Not Allowed"
    });
  }
  const body = await readBody(event);
  const { male, female, options } = await object().shape({
    male: codeValidator.required(),
    female: codeValidator.required(),
    options: object().shape({
      dpr: number().default(1)
    })
  }).validate(body, {
    abortEarly: false
  });
  try {
    const [genderChecks, pair] = await Promise.all([
      checkDragonsMatchGender([male, female]),
      getDataForPair([male, female], options)
    ]);
    const errors = [];
    for (const dragon of genderChecks) {
      if (dragon.correct === false) {
        errors.push({
          type: "warning",
          message: `${dragon.code} is not the correct gender.`
        });
      } else if (dragon.correct === null) {
        throw new OnsiteDragonNotFoundError(dragon.code);
      }
    }
    return {
      errors,
      ...pair
    };
  } catch (err) {
    if (err instanceof OnsiteDragonNotFoundError) {
      throw createError({
        statusCode: 404,
        statusMessage: `The dragon ${err.message} could not be found. If you're sure it exists, then it may be hidden.`
      });
    }
    throw createError({
      statusCode: 500,
      statusMessage: "A problem occurred when contacting DragCave."
    });
  }
});

export { index_post as default };
//# sourceMappingURL=index.post2.mjs.map
