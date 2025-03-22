import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import app from '../../app';
import request from 'supertest';
import { DragonBuilder } from '../../../shared/dragonBuilder.js';
import pool from '../../pool';
import crypto from 'crypto';
import type { RowDataPacket } from 'mysql2/promise';
import config from '../../useConfig';

// eslint-disable-next-line @typescript-eslint/no-misused-promises
const rq = request(app.callback());
const con = await pool.getConnection();

describe('lineageController', () => {
  beforeEach(async () => await con.beginTransaction());

  afterEach(async () => {
    await con.rollback();
    con.release();
  });

  describe('/lineage/{hash}', () => {
    it("404 when a lineage hash isn't found", async () => {
      await rq
        .get('/lineage/a1c6b9e0fa6157dd694525fcdb0be99e14110174')
        .expect(404);
    });

    it('returns a lineage json', async () => {
      const dragon = DragonBuilder.create();
      const json = JSON.stringify(dragon);
      const hashCode = crypto.createHash('sha1').update(json).digest('hex');

      await con.query(
        'INSERT INTO `saved_lineages` (`hash`, `last_view`, `content`) VALUES (?, CURDATE(), ?)',
        [hashCode, json],
      );

      const res = await rq
        .get(`/dc/lineage-builder/api/lineage/${hashCode}`)
        .expect(200);

      expect(res.body).to.eql({
        lineage: dragon,
      });
    });

    describe.todo('sets the last_view to now');
  });

  describe('/lineage/create', () => {
    it("404 when json isn't present", async () => {
      await rq.post('/dc/lineage-builder/api/lineage').expect(404);
    });

    describe.todo('sets the last_view to now if already exists');

    it('fails validation when given a bad dragon', async () => {
      const lineage = DragonBuilder.create({ code: 'nanawo akari MY QUEEN' });

      const res = await rq
        .post(`/dc/lineage-builder/api/lineage`)
        .send({ lineage })
        .expect(422);

      expect(res.body).to.have.key('errors');
    });

    it('stores a new lineage and returns unique hash', async () => {
      const lineage = DragonBuilder.create();
      const hashCode = crypto
        .createHash('sha1')
        .update(config.salt + JSON.stringify(lineage))
        .digest('hex');

      const res = await rq
        .post(`/dc/lineage-builder/api/lineage`)
        .send({ lineage })
        .expect(201);

      expect(res.body.hash).to.eql(hashCode);

      const [[row]] = await con.query<RowDataPacket[]>(
        'SELECT * FROM saved_lineages WHERE hash = ?',
        [res.body.hash],
      );

      expect(JSON.parse(row.content)).to.eql(lineage);
    });
  });
});
