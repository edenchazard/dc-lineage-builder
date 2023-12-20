import { object, boolean } from 'yup';
import { codeValidator } from '../../shared/validation';
import {
  OnsiteError,
  getDataForPair,
  checkDragonsMatchGender,
  type DragonOnsite,
} from '../onsite';
import Router from '@koa/router';
import type { RequestContext } from '../types';
import config from '../config';

const router = new Router({
  prefix: config.apiPath + '/onsite',
});

router.post('/show', async (ctx: RequestContext) => {
  const { doChecks, male, female } = await object()
    .shape({
      doChecks: boolean().default(false),
      male: codeValidator,
      female: codeValidator,
    })
    .validate(ctx.request.body);

  ctx.body.data.dragons = {};

  const codesAsArray: [string, string] = [male, female];

  // do our checks, such as ensuring the dragons match the gender
  if (doChecks) {
    const genderChecks = await checkDragonsMatchGender(codesAsArray);

    genderChecks.forEach((dragon) => {
      if (dragon.correct === false)
        ctx.body.errors.push({
          type: 'Warning',
          message: `Dragon ${dragon.code} is not the correct gender.`,
        });
      else if (dragon.correct === null)
        ctx.body.errors.push({
          type: 'Error',
          message: `Dragon ${dragon.code} couldn't be looked at for gender check. It may not exist.`,
        });
    });
  }

  // try to fetch the html for both codes
  const dragons = await getDataForPair(codesAsArray);

  const action = (dragon: DragonOnsite, gender: 'male' | 'female') => {
    // handle error'd dragon
    if (dragon instanceof OnsiteError) {
      // add the error
      ctx.body.errors.push({ type: 'Warning', message: dragon.message });
      // nullify dragon data
      ctx.body.data.dragons[gender] = null;
    } else ctx.body.data.dragons[gender] = dragon;
  };

  action(dragons.male, 'male');
  action(dragons.female, 'female');
});

export default router;
