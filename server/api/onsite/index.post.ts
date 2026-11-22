import { number, object } from 'yup';

import { codeValidator } from '../../../app/shared/validation.js';
import { dragCaveFetch } from '../../utils/dcApiFetch.js';
import type { DcApiFetch } from '../../utils/dcApiFetch.js';
import { abort, handleApiError } from '../../utils/errors.js';
import type { ErrorArray } from '../../utils/errors.js';
import {
  OnsiteDragonNotFoundError,
  checkDragonsMatchGender as fetchGenderChecks,
  getDataForPair as fetchPairData,
} from '../../utils/onsite.js';

export async function getOnsitePair(
  api: DcApiFetch,
  body: unknown,
): Promise<{ errors: ErrorArray; male: unknown; female: unknown }> {
  const { male, female, options } = await object()
    .shape({
      male: codeValidator.required(),
      female: codeValidator.required(),
      options: object().shape({
        dpr: number().default(1),
      }),
    })
    .validate(body, { abortEarly: false });

  try {
    const [genderChecks, pair] = await Promise.all([
      fetchGenderChecks([male, female], api),
      fetchPairData([male, female], options),
    ]);

    const errors: ErrorArray = [];

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

    return { errors, ...pair };
  } catch (err) {
    if (err instanceof OnsiteDragonNotFoundError) {
      abort(404, [
        {
          type: 'error',
          message: `The dragon ${err.message} could not be found. If you're sure it exists, then it may be hidden.`,
        },
      ]);
    }

    abort(500, [
      {
        type: 'error',
        message: 'A problem occurred when contacting DragCave.',
      },
    ]);
  }
}

export default async function (event: InstanceType<typeof H3Event>) {
  try {
    return await getOnsitePair(dragCaveFetch(), await readBody(event));
  } catch (err) {
    return handleApiError(event, err);
  }
}
