import crypto from 'crypto';
import type { RowDataPacket } from 'mysql2';
import { dragonSchema } from '~/utils/validation';
import { pool } from '~/server/utils/db';
import config from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed'
    });
  }

  const body = await readBody(event);
  
  if (!body.lineage) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Lineage data required'
    });
  }

  const lineage = await dragonSchema
    .required()
    .validate(body.lineage);

  const jsonString = JSON.stringify(lineage);
  const hashCode = crypto
    .createHash('sha1')
    .update(config.salt + jsonString)
    .digest('hex');

  // insert if the hash isn't unique
  await pool().execute(
    'INSERT IGNORE INTO `saved_lineages` (`hash`, `last_view`, `content`) VALUES (?, CURDATE(), ?)',
    [hashCode, jsonString],
  );

  setResponseStatus(event, 201);

  return {
    hash: hashCode,
  };
});