import { string } from 'yup';
import type { RowDataPacket } from 'mysql2';
import { dragonSchema, validateLineageHash } from '../../shared/validation';
import config from '../config';
import Router from '@koa/router';
import crypto from 'crypto';
import pool from '../pool';
import type { RequestContext } from '../types';

const router = new Router({
  prefix: config.apiPath + '/lineage',
});

router.use(async (ctx, next) => {
  await next();
});

// Save a new lineage
router.post('/', async (ctx: RequestContext) => {
  if (!ctx.request.body.dragon) {
    ctx.status = 404;
    return;
  }

  const dragon = await dragonSchema
    .required()
    .validate(ctx.request.body.dragon);

  const jsonString = JSON.stringify(dragon);
  const hashCode = crypto
    .createHash('sha1')
    .update(config.salt + jsonString)
    .digest('hex');

  // insert if the hash isn't unique
  await pool.execute(
    'INSERT IGNORE INTO `saved_lineages` (`hash`, `last_view`, `content`) VALUES (?, CURDATE(), ?)',
    [hashCode, jsonString],
  );

  ctx.body = {
    hash: hashCode,
  };
});

// return a lineage
router.get('/:hash', async (ctx: RequestContext) => {
  const hashCode = await string()
    .required()
    .test(validateLineageHash)
    .validate(ctx.params.hash);

  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT content, last_view FROM saved_lineages WHERE hash = ?`,
    [hashCode],
  );

  if (!rows[0]) {
    ctx.status = 404;
    return;
  }

  // update access time to reset it
  await pool.execute(
    `
      UPDATE saved_lineages
      SET last_view = CURDATE(), hits = hits+1
      WHERE hash = ?`,
    [hashCode],
  );

  ctx.body = {
    lineage: JSON.parse(rows[0].content),
  };
});

export default router;
