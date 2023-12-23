import path from 'path';
import Router from '@koa/router';
import { string } from 'yup';
import type { RowDataPacket } from 'mysql2';
import crypto from 'crypto';
import { dragonSchema, validateLineageHash } from '../../shared/validation.js';
import config from '../config.js';
import pool from '../pool.js';
import type { RequestContext } from '../types';

const router = new Router({
  prefix: path.join(config.appUrl, '/api/lineage'),
});

router.post('/', async (ctx: RequestContext) => {
  if (!ctx.request.body.lineage) {
    ctx.abort(404);
  }

  const lineage = await dragonSchema
    .required()
    .validate(ctx.request.body.lineage);

  const jsonString = JSON.stringify(lineage);
  const hashCode = crypto
    .createHash('sha1')
    .update(config.salt + jsonString)
    .digest('hex');

  // insert if the hash isn't unique
  await pool.execute(
    'INSERT IGNORE INTO `saved_lineages` (`hash`, `last_view`, `content`) VALUES (?, CURDATE(), ?)',
    [hashCode, jsonString],
  );

  ctx.status = 201;
  ctx.body = {
    hash: hashCode,
  };
});

router.get('/:hash', async (ctx: RequestContext) => {
  const hashCode = await string()
    .required()
    .test(validateLineageHash)
    .validate(ctx.params.hash);

  const [[row]] = await pool.execute<RowDataPacket[]>(
    `SELECT content, last_view FROM saved_lineages WHERE hash = ?`,
    [hashCode],
  );

  if (!row) {
    ctx.abort(404);
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
    lineage: JSON.parse(row.content),
  };
});

export default router;
