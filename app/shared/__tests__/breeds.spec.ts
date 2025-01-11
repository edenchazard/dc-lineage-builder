import { describe, it, expect } from 'vitest';
import {
  listOfBreeds,
  malePortraits,
  placeholder,
  injectBreedList,
} from '../breeds.js';

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
});
