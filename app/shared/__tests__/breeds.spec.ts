import { describe, it, expect, vi } from 'vitest';
import {
  adjustTiles,
  listOfBreeds,
  malePortraits,
  placeholder,
  injectBreedList,
} from '../breeds.js';
import { getDCTime } from '../../app/utils.js';

vi.mock('../../app/utils', async () => {
  return {
    ...(await vi.importActual<typeof import('../../app/utils')>(
      '../../app/utils',
    )),
    getDCTime: vi.fn(() => [{ type: 'hour', value: '8' }]),
  };
});

await injectBreedList();

describe('breeds', () => {
  it('exports a list of breeds with placeholder as first in the list', () => {
    expect(Array.isArray(listOfBreeds)).to.be.true;
    expect(listOfBreeds[0]).to.be.eql(placeholder);
    expect(listOfBreeds.length).to.be.greaterThan(300);
  });

  it('exports a list of male portraits', () => {
    expect(Array.isArray(malePortraits)).to.be.true;
  });

  it('exports a list of female portraits', () => {
    expect(Array.isArray(malePortraits)).to.be.true;
  });

  describe('adjustTiles()', () => {
    it('adjusts nocturnes to day', () => {
      adjustTiles();

      const nocturne = listOfBreeds.find((breed) => breed.name === 'Nocturne');

      expect(nocturne).to.contain({
        male: 'OrTHo_day',
        female: 'OrTHo_day',
      });

      expect(getDCTime).toBeCalled();
    });
  });
});
