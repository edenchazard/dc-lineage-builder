import { describe, it, expect, vi, afterEach } from 'vitest';
import app from '../../app';
import request from 'supertest';
import { OnsiteError } from '../../onsite';

const rq = request(app.callback());

const mocks = vi.hoisted(() => {
  return {
    checkDragonsMatchGender: vi.fn(),
    getDataForPair: vi.fn(),
  };
});

vi.mock('../../onsite', async () => {
  return {
    ...(await vi.importActual<typeof import('../../onsite')>('../../onsite')),
    checkDragonsMatchGender: mocks.checkDragonsMatchGender,
    getDataForPair: mocks.getDataForPair,
  };
});

describe('onsiteController', async () => {
  describe('/', () => {
    afterEach(() => {
      vi.clearAllMocks();
    });

    it('422 when missing male or female', async () => {
      await rq.post('/dc/lineage-builder/api/onsite').send({}).expect(422);
    });

    it("errors when one dragon's html can't be found", async () => {
      mocks.checkDragonsMatchGender.mockReturnValue([
        { code: '0COCk', correct: true },
        { code: 'BbOOB', correct: true },
      ]);

      mocks.getDataForPair.mockImplementation(async () => {
        throw new OnsiteError('Dragon not found.');
      });

      await rq
        .post('/dc/lineage-builder/api/onsite')
        .send({
          male: '0COCk',
          female: 'BbOOB',
          doChecks: true,
        })
        .expect(404);
    });

    it("errors when doChecks enabled and one dragon can't be found", async () => {
      mocks.checkDragonsMatchGender.mockReturnValue([
        { code: '0COCk', correct: null },
        { code: 'BbOOB', correct: null },
      ]);

      mocks.getDataForPair.mockReturnValue({
        male: {
          code: '0COCk',
          html: '<p></p>',
          gen: 3,
        },
        female: {
          code: 'BbOOB',
          html: '<p></p>',
          gen: 3,
        },
      });

      const res = await rq
        .post('/dc/lineage-builder/api/onsite')
        .send({
          male: '0COCk',
          female: 'BbOOB',
          doChecks: true,
        })
        .expect(404);

      expect(res.body.errors).length(2);
    });

    it('fails if invalid codes given', async () => {
      const res = await rq
        .post('/dc/lineage-builder/api/onsite')
        .send({
          male: 'gojo satoru',
          female: 'nanamin',
        })
        .expect(422);

      expect(res.body).to.have.key('errors');
      expect(res.body.errors).length(2);
      expect(res.body.errors[0]).to.contain('Codes must be');
      expect(res.body.errors[1]).to.contain('Codes must be');
    });

    it('returns two good dragons after checks', async () => {
      const data = {
        male: {
          code: '0COCk',
          html: '<p></p>',
          gen: 3,
        },
        female: {
          code: 'BbOOB',
          html: '<p></p>',
          gen: 3,
        },
      };

      mocks.checkDragonsMatchGender.mockReturnValue([
        { code: '0COCk', correct: true },
        { code: 'BbOOB', correct: true },
      ]);

      mocks.getDataForPair.mockReturnValue(data);

      const res = await rq
        .post('/dc/lineage-builder/api/onsite')
        .send({
          male: '0COCk',
          female: 'BbOOB',
          doChecks: true,
        })
        .expect(200);

      expect(mocks.checkDragonsMatchGender).toHaveBeenCalledOnce();
      expect(res.body).to.eql(data);
    });

    it('returns two good dragons without checks', async () => {
      const data = {
        male: {
          code: '0COCk',
          html: '<p></p>',
          gen: 3,
        },
        female: {
          code: 'BbOOB',
          html: '<p></p>',
          gen: 3,
        },
      };

      mocks.checkDragonsMatchGender.mockReturnValue([
        { code: '0COCk', correct: true },
        { code: 'BbOOB', correct: true },
      ]);

      mocks.getDataForPair.mockReturnValue(data);

      const res = await rq
        .post('/dc/lineage-builder/api/onsite')
        .send({
          male: '0COCk',
          female: 'BbOOB',
        })
        .expect(200);

      expect(mocks.checkDragonsMatchGender).not.toHaveBeenCalled();
      expect(res.body).to.contain.all.keys(data);
      expect(res.body).to.not.contain.keys('errors');
    });

    it('warns when dragons ok but checks enabled and wrong gender', async () => {
      const data = {
        male: {
          code: '0COCk',
          html: '<p></p>',
          gen: 3,
        },
        female: {
          code: 'BbOOB',
          html: '<p></p>',
          gen: 3,
        },
      };

      mocks.checkDragonsMatchGender.mockReturnValue([
        { code: '0COCk', correct: false },
        { code: 'BbOOB', correct: false },
      ]);

      mocks.getDataForPair.mockReturnValue(data);

      const res = await rq
        .post('/dc/lineage-builder/api/onsite')
        .send({
          male: '0COCk',
          female: 'BbOOB',
          doChecks: true,
        })
        .expect(200);

      expect(mocks.checkDragonsMatchGender).toHaveBeenCalledOnce();
      expect(res.body).to.contain.all.keys(data);
      expect(res.body.errors).to.eql([
        { type: 'warning', message: '0COCk is not the correct gender.' },
        { type: 'warning', message: 'BbOOB is not the correct gender.' },
      ]);
    });
  });
});
