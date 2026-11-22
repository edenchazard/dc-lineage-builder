import crypto from 'node:crypto';
import type { Pool } from 'mysql2/promise';

import { dragonSchema } from '../../../app/shared/validation.js';
import { pool } from '../../db.js';
import { abort, handleApiError } from '../../utils/errors.js';

/** A pool or a checked-out connection (useful for transactional tests). */
type SqlExecutor = Pick<Pool, 'execute'>;

export async function saveLineage(
  db: SqlExecutor,
  salt: string,
  lineageInput: unknown,
): Promise<{ hash: string }> {
  if (!lineageInput) {
    abort(404, [{ type: 'error', message: 'Not found' }]);
  }

  const lineage = await dragonSchema.required().validate(lineageInput);
  const jsonString = JSON.stringify(lineage);
  const hashCode = crypto
    .createHash('sha1')
    .update(salt + jsonString)
    .digest('hex');

  // insert if the hash isn't already in use
  await db.execute(
    'INSERT IGNORE INTO `saved_lineages` (`hash`, `last_view`, `content`) VALUES (?, CURDATE(), ?)',
    [hashCode, jsonString],
  );

  return { hash: hashCode };
}

export default async function (event: InstanceType<typeof H3Event>) {
  try {
    const config = useRuntimeConfig(event);
    const body = await readBody<{ lineage?: unknown }>(event);

    const result = await saveLineage(
      pool,
      config.lineageHashSalt,
      body?.lineage,
    );

    setResponseStatus(event, 201);
    return result;
  } catch (err) {
    return handleApiError(event, err);
  }
}
