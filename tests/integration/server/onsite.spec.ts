import { afterEach, describe, expect, it, vi } from 'vitest';
import { ValidationError } from 'yup';

import { getOnsitePair } from '../../../server/api/onsite/index.post.js';
import type { DcApiFetch } from '../../../server/utils/dcApiFetch.js';
import {
  OnsiteDragonNotFoundError,
  type DragonOnsite,
} from '../../../server/utils/onsite.js';

const api = {} as DcApiFetch;

const mocks = vi.hoisted(() => ({
  checkDragonsMatchGender: vi.fn(),
  getDataForPair: vi.fn(),
}));

vi.mock('../../../server/utils/onsite.js', async () => ({
  ...(await vi.importActual('../../../server/utils/onsite.js')),
  checkDragonsMatchGender: mocks.checkDragonsMatchGender,
  getDataForPair: mocks.getDataForPair,
}));

const pair: { male: DragonOnsite; female: DragonOnsite } = {
  male: { code: '0COCk', html: '<p></p>', gen: 3 },
  female: { code: 'BbOOB', html: '<p></p>', gen: 3 },
};

describe('onsite service', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('fails validation when male or female is missing', async () => {
    await expect(getOnsitePair(api, {})).rejects.toBeInstanceOf(
      ValidationError,
    );
  });

  it("errors when one dragon's html can't be found", async () => {
    mocks.checkDragonsMatchGender.mockReturnValue([
      { code: '0COCk', correct: true },
      { code: 'BbOOB', correct: true },
    ]);
    mocks.getDataForPair.mockImplementation(() => {
      throw new OnsiteDragonNotFoundError('BbOOB');
    });

    await expect(
      getOnsitePair(api, { male: '0COCk', female: 'BbOOB' }),
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it("errors when checkDragonsMatchGender can't find a dragon", async () => {
    mocks.checkDragonsMatchGender.mockReturnValue([
      { code: '0COCk', correct: null },
      { code: 'BbOOB', correct: null },
    ]);
    mocks.getDataForPair.mockReturnValue(pair);

    await expect(
      getOnsitePair(api, { male: '0COCk', female: 'BbOOB' }),
    ).rejects.toMatchObject({
      statusCode: 404,
      errors: [
        {
          type: 'error',
          message: expect.stringContaining('could not be found.'),
        },
      ],
    });
  });

  it('fails if invalid codes given', async () => {
    await expect(
      getOnsitePair(api, { male: 'gojo satoru', female: 'nanamin' }),
    ).rejects.toMatchObject({
      errors: [
        expect.stringContaining('Codes must be'),
        expect.stringContaining('Codes must be'),
      ],
    });
  });

  it('returns two good dragons', async () => {
    mocks.checkDragonsMatchGender.mockReturnValue([
      { code: '0COCk', correct: true },
      { code: 'BbOOB', correct: true },
    ]);
    mocks.getDataForPair.mockReturnValue(pair);

    await expect(
      getOnsitePair(api, { male: '0COCk', female: 'BbOOB' }),
    ).resolves.toEqual({ errors: [], ...pair });

    expect(mocks.checkDragonsMatchGender).toHaveBeenCalledOnce();
  });

  it('warns when dragons are ok but the wrong gender', async () => {
    mocks.checkDragonsMatchGender.mockReturnValue([
      { code: '0COCk', correct: false },
      { code: 'BbOOB', correct: false },
    ]);
    mocks.getDataForPair.mockReturnValue(pair);

    await expect(
      getOnsitePair(api, {
        male: '0COCk',
        female: 'BbOOB',
        doChecks: true,
      }),
    ).resolves.toEqual({
      ...pair,
      errors: [
        { type: 'warning', message: '0COCk is not the correct gender.' },
        { type: 'warning', message: 'BbOOB is not the correct gender.' },
      ],
    });

    expect(mocks.checkDragonsMatchGender).toHaveBeenCalledOnce();
  });
});
