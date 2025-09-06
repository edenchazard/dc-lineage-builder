import { d as defineEventHandler, a as getMethod, c as createError, r as readBody, s as setResponseStatus } from '../../nitro/nitro.mjs';
import require$$1 from 'crypto';
import { d as dragonSchema } from '../../_/validation.mjs';
import { c as config, g as getPool } from '../../_/db.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'yup';
import 'unique-names-generator';
import 'mysql2/promise';

const index_post = defineEventHandler(async (event) => {
  if (getMethod(event) !== "POST") {
    throw createError({
      statusCode: 405,
      statusMessage: "Method Not Allowed"
    });
  }
  const body = await readBody(event);
  if (!body.lineage) {
    throw createError({
      statusCode: 404,
      statusMessage: "Lineage data required"
    });
  }
  const lineage = await dragonSchema.required().validate(body.lineage);
  const jsonString = JSON.stringify(lineage);
  const hashCode = require$$1.createHash("sha1").update(config.salt + jsonString).digest("hex");
  await getPool().execute(
    "INSERT IGNORE INTO `saved_lineages` (`hash`, `last_view`, `content`) VALUES (?, CURDATE(), ?)",
    [hashCode, jsonString]
  );
  setResponseStatus(event, 201);
  return {
    hash: hashCode
  };
});

export { index_post as default };
//# sourceMappingURL=index.post.mjs.map
