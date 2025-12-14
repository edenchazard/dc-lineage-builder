import crypto from 'crypto';
import { dragonSchema } from '~~/shared/validation';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  if (!body.lineage) {
    throw createError({
      statusCode: 404,
      message: 'Lineage not provided',
    });
  }

  const lineage = await dragonSchema.required().validate(body.lineage);

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

  setResponseStatus(event, 201);

  return {
    hash: hashCode,
  };
});
