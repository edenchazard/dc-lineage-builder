import { array, number, object } from 'yup';
import { codeValidator } from '~/utils/validation';
import {
  getDataForPair,
  checkDragonsMatchGender,
  OnsiteDragonNotFoundError,
} from '~/server/utils/onsite';

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed'
    });
  }

  const body = await readBody(event);

  const { male, female, options } = await object()
    .shape({
      male: codeValidator.required(),
      female: codeValidator.required(),
      options: object().shape({
        dpr: number().default(1),
      }),
    })
    .validate(body, {
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

    return {
      errors,
      ...pair,
    };
  } catch (err) {
    if (err instanceof OnsiteDragonNotFoundError) {
      throw createError({
        statusCode: 404,
        statusMessage: `The dragon ${err.message} could not be found. If you're sure it exists, then it may be hidden.`,
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'A problem occurred when contacting DragCave.',
    });
  }
});