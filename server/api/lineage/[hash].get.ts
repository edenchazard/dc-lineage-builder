import type { RowDataPacket } from 'mysql2';
import type { Pool } from 'mysql2/promise';
import { string } from 'yup';

import { validateLineageHash } from '../../../app/shared/validation.js';
import { pool } from '../../db.js';
import { abort, handleApiError } from '../../utils/errors.js';

/** A pool or a checked-out connection (useful for transactional tests). */
type SqlExecutor = Pick<Pool, 'execute'>;

export async function loadLineage(
  db: SqlExecutor,
  hashInput: unknown,
): Promise<{ lineage: unknown }> {
  const hashCode = await string()
    .required()
    .test(validateLineageHash)
    .validate(hashInput);

  const [[row]] = await db.execute<RowDataPacket[]>(
    `SELECT content, last_view FROM saved_lineages WHERE hash = ?`,
    [hashCode],
  );

  if (!row) {
    abort(404, [{ type: 'error', message: 'Not found' }]);
  }

  // update access time to reset it
  await db.execute(
    `
      UPDATE saved_lineages
      SET last_view = CURDATE(), hits = hits+1
      WHERE hash = ?`,
    [hashCode],
  );

  return { lineage: JSON.parse(row.content) };
}

export default async function (event: InstanceType<typeof H3Event>) {
  try {
    return await loadLineage(pool, getRouterParam(event, 'hash'));
  } catch (err) {
    return handleApiError(event, err);
  }
}
