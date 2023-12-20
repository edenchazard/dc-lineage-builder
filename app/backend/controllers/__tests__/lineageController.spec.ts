import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import app from '../../app';
import request from 'supertest';
import { DragonBuilder } from '../../../shared/dragonBuilder';
import pool from '../../pool';
import crypto from 'crypto';
import type { PoolConnection } from 'mysql2/promise';

const rq = request(app.callback());
const con: PoolConnection = await pool.getConnection();

describe('app', () => {
  describe('lineageController', async () => {
    beforeEach(async () => await con.beginTransaction());

    afterEach(async () => {
      await con.rollback();
      con.release();
    });

    describe('/lineage/${hash}', () => {
      it("404s when a lineage hash isn't found", async () => {
        await rq.get('/lineage/blah/show').expect(404);
      });

      it('returns a lineage json', async () => {
        const dragon = DragonBuilder.create();
        const json = JSON.stringify(dragon);
        const hashCode = crypto.createHash('sha1').update(json).digest('hex');

        await con.execute(
          'INSERT INTO `saved_lineages` (`hash`, `last_view`, `content`) VALUES (?, CURDATE(), ?)',
          [hashCode, json],
        );

        const res = await rq
          .get(`/dc/lineage-builder/api/lineage/${hashCode}`)
          .expect(200);

        expect(res.body).to.be.eqls({
          lineage: dragon,
        });
      });

      describe.todo('sets the last_view to now');
    });

    describe('/lineage/create', () => {
      it("404s when json isn't present", async () => {
        await rq.post('/dc/lineage-builder/api/lineage').expect(404);
      });

      describe.todo('sets the last_view to now if already exists');

      it('fails validation when given a bad dragon', async () => {
        const dragon = DragonBuilder.create({ code: 'nanawo akari MY QUEEN' });

        const res = await rq
          .post(`/dc/lineage-builder/api/lineage`)
          .send({ dragon })
          .expect(200);

        expect(res.body).to.has.key('errors');
      });

      it('stores a new lineage and returns unique hash', async () => {
        const dragon = DragonBuilder.create();

        const res = await rq
          .post(`/dc/lineage-builder/api/lineage`)
          .send({ dragon })
          .expect(200);

        expect(res.body).to.has.key('hash');
      });
    });
  });
});
