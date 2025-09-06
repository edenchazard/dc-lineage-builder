import { d as defineEventHandler, g as getRouterParam, c as createError } from '../../../nitro/nitro.mjs';
import { string } from 'yup';
import { v as validateLineageHash } from '../../../_/validation.mjs';
import { g as getPool } from '../../../_/db.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'unique-names-generator';
import 'mysql2/promise';

const _hash__get = defineEventHandler(async (event) => {
  const hash = getRouterParam(event, "hash");
  if (!hash) {
    throw createError({
      statusCode: 400,
      statusMessage: "Hash parameter required"
    });
  }
  const hashCode = await string().required().test(validateLineageHash).validate(hash);
  const [[row]] = await getPool().execute(
    `SELECT content, last_view FROM saved_lineages WHERE hash = ?`,
    [hashCode]
  );
  if (!row) {
    throw createError({
      statusCode: 404,
      statusMessage: "Lineage not found"
    });
  }
  await getPool().execute(
    `
      UPDATE saved_lineages
      SET last_view = CURDATE(), hits = hits+1
      WHERE hash = ?`,
    [hashCode]
  );
  return {
    lineage: JSON.parse(row.content)
  };
});

export { _hash__get as default };
//# sourceMappingURL=_hash_.get.mjs.map
