import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import crypto from 'node:crypto';
import type { RowDataPacket } from 'mysql2';
import { ValidationError } from 'yup';

import { injectBreedList } from '../../../app/shared/breeds.js';
import { DragonBuilder } from '../../../app/shared/dragonBuilder.js';
import { loadLineage } from '../../../server/api/lineage/[hash].get.js';
import { saveLineage } from '../../../server/api/lineage/index.post.js';
import { pool } from '../../../server/db.js';
import { freshDatabase } from '../../../server/utils/dbSetup.js';

const salt = process.env.NUXT_LINEAGE_HASH_SALT ?? 'salt';
let con: Awaited<ReturnType<typeof pool.getConnection>>;

beforeAll(async () => {
  await freshDatabase();
  await injectBreedList();
});

describe('lineage service', () => {
  beforeEach(async () => {
    con = await pool.getConnection();
    await con.beginTransaction();
  });

  afterEach(async () => {
    await con.rollback();
    con.release();
  });

  describe('loadLineage', () => {
    it("throws a 404 when a lineage hash isn't found", async () => {
      await expect(
        loadLineage(con, 'a1c6b9e0fa6157dd694525fcdb0be99e14110174'),
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it('returns a lineage json', async () => {
      const dragon = DragonBuilder.create();
      const json = JSON.stringify(dragon);
      const hashCode = crypto.createHash('sha1').update(json).digest('hex');

      await con.query(
        'INSERT INTO `saved_lineages` (`hash`, `last_view`, `content`) VALUES (?, CURDATE(), ?)',
        [hashCode, json],
      );

      await expect(loadLineage(con, hashCode)).resolves.toEqual({
        lineage: dragon,
      });
    });
  });

  describe('saveLineage', () => {
    it("throws a 404 when lineage data isn't present", async () => {
      await expect(saveLineage(con, salt, null)).rejects.toMatchObject({
        statusCode: 404,
      });
    });

    it('fails validation when given a bad dragon', async () => {
      const lineage = DragonBuilder.create({ code: 'nanawo akari MY QUEEN' });

      await expect(saveLineage(con, salt, lineage)).rejects.toBeInstanceOf(
        ValidationError,
      );
    });

    it('stores a new lineage and returns unique hash', async () => {
      const lineage = DragonBuilder.create();
      const hashCode = crypto
        .createHash('sha1')
        .update(salt + JSON.stringify(lineage))
        .digest('hex');

      await expect(saveLineage(con, salt, lineage)).resolves.toEqual({
        hash: hashCode,
      });

      const [[row]] = await con.query<RowDataPacket[]>(
        'SELECT * FROM saved_lineages WHERE hash = ?',
        [hashCode],
      );

      if (!row) throw new Error('Saved lineage row not found');

      expect(JSON.parse(row.content)).toEqual(lineage);
    });
  });
});
