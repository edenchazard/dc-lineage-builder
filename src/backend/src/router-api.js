const GLOBALS = require('./globals.js');
const validators = require('./validators.js');
const config = require('./config.js');
const Router = require('@koa/router');
const crypto = require('crypto');
const {
  OnsiteError,
  getDataForPair,
  checkDragonsMatchGender,
} = require('./onsite.js');

const router = new Router({
  prefix: config.apiPath,
});

router.use(async (ctx, next) => {
  ctx.body = {
    errors: [],
    data: {},
  };

  await next();
});

router.get('/', async (ctx) => {
  ctx.body.errors.push({ type: 'Warning', message: ':)' });
  ctx.body.data.message =
    "REST API for the lineage builder. You shouldn't be here!";
});

// return a lineage
router.get('/lineage/:hash', async (ctx) => {
  ctx.body.data.lineage = {};

  const hashCode = ctx.params.hash;
  if (!validators.isLineageHash(hashCode)) {
    ctx.body.errors.push({
      type: 'Error',
      message: 'The lineage could not be found.',
    });
    return;
  }

  try {
    const con = await GLOBALS.pool.getConnection();
    const [row] = await con.execute(
      `SELECT content, last_view
            FROM saved_lineages
            WHERE hash = ?
            LIMIT 1`,
      [hashCode],
    );

    const lineageExists = row[0];
    if (lineageExists) {
      // update access time to reset it
      await con.execute(
        `UPDATE saved_lineages
                SET last_view = CURDATE(),
                    hits = hits+1
                WHERE hash = ?`,
        [hashCode],
      );

      const jsonContent = row[0].content;
      ctx.body.data.lineage = JSON.parse(jsonContent);
    } else {
      ctx.body.errors.push({
        type: 'Error',
        message: 'This lineage could not be found.',
      });
    }
    con.release();
  } catch (ex) {
    // bubble up stack
    throw ex;
  }
});

// Save a new lineage
router.post('/lineage/create', async (ctx) => {
  try {
    /* handle integrity check to stop clever abusers uploading
        any json they want */
    const dragon = ctx.request.body;
    if (
      !validators.verifyIntegrity(dragon) ||
      !validators.meetsSaveRequirements(dragon)
    ) {
      ctx.body.errors.push({
        type: 'Error',
        message: "Lineage doesn't meet requirements.",
      });
      return;
    }

    let hash = crypto.createHash('sha1');
    const jsonString = JSON.stringify(dragon);
    hash.update(config.salt + jsonString);
    const hashCode = hash.digest('hex');

    const con = await GLOBALS.pool.getConnection();
    // Check duplicate hash. If it already exists, just return that.
    const [row] = await con.execute(
      'SELECT 1 FROM `saved_lineages` WHERE `hash`= ? LIMIT 1',
      [hashCode],
    );

    const lineageExists = row[0];
    if (!lineageExists) {
      // hash not in db, which means this lineage is unique. insert it
      await con.execute(
        'INSERT INTO `saved_lineages` (`hash`, `last_view`, `content`) VALUES (?, CURDATE(), ?)',
        [hashCode, jsonString],
      );
    }

    con.release();
    ctx.body.data.hash = hashCode;
  } catch (ex) {
    throw ex;
  }
});

router.post('/onsite-preview', async (ctx) => {
  const doChecks = !!ctx.request.body.doChecks;
  const codesAsArray = [ctx.request.body.male, ctx.request.body.female];

  try {
    ctx.body.data.dragons = {};

    // validate both are valid code syntax
    if (!codesAsArray.every(validators.code)) {
      ctx.body.errors.push({
        type: 'Error',
        message: 'A code has an invalid format.',
      });
      return;
    }
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

    const action = (dragon, gender) => {
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
  } catch (ex) {
    throw ex;
  }
});

module.exports = router;
