import { string } from 'yup';
import type { RowDataPacket } from 'mysql2';
import { validateLineageHash } from '~/utils/validation';
import { pool } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  const hash = getRouterParam(event, 'hash');
  
  if (!hash) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Hash parameter required'
    });
  }

  const hashCode = await string()
    .required()
    .test(validateLineageHash)
    .validate(hash);

  const [[row]] = await pool().execute<RowDataPacket[]>(
    `SELECT content, last_view FROM saved_lineages WHERE hash = ?`,
    [hashCode],
  );

  if (!row) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Lineage not found'
    });
  }

  // update access time to reset it
  await pool().execute(
    `
      UPDATE saved_lineages
      SET last_view = CURDATE(), hits = hits+1
      WHERE hash = ?`,
    [hashCode],
  );

  return {
    lineage: JSON.parse(row.content),
  };
});