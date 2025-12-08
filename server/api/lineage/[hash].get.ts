import { string } from 'yup';
import type { RowDataPacket } from 'mysql2';
import { validateLineageHash } from '~/utils/shared/validation';
import pool from '~/server/utils/pool';

export default defineEventHandler(async (event) => {
  const hash = getRouterParam(event, 'hash');

  const hashCode = await string()
    .required()
    .test(validateLineageHash)
    .validate(hash);

  const [[row]] = await pool.execute<RowDataPacket[]>(
    `SELECT content, last_view FROM saved_lineages WHERE hash = ?`,
    [hashCode],
  );

  if (!row) {
    throw createError({
      statusCode: 404,
      message: 'Lineage not found',
    });
  }

  // update access time to reset it
  await pool.execute(
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
