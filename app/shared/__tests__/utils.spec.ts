import { describe, it, expect, expectTypeOf } from 'vitest';
import {
  breedEntryToPortrait,
  createLineageLink,
  expandGender,
  getBreedData,
  validGenderForBreed,
} from '../utils.js';
import type { BreedEntry, PortraitData } from '../types.js';
import { injectBreedList } from '../breeds.js';

await injectBreedList();

describe('utils', () => {
  describe('validGenderForBreed', () => {
    it('true when both genders and male given', () => {
      const val = getBreedData('Aria');
      expect(val).to.have.property('genderOnly', false);
      expect(validGenderForBreed('m', val as BreedEntry)).to.be.true;
    });

    it('true when both genders and female given', () => {
      const val = getBreedData('Aria');
      expect(val).to.have.property('genderOnly', false);
      expect(validGenderForBreed('f', val as BreedEntry)).to.be.true;
    });

    it('fails if the breed is female only and male given', () => {
      const val = getBreedData('Amarignis');
      expect(val).to.have.property('genderOnly', 'f');
      expect(validGenderForBreed('m', val as BreedEntry)).to.be.false;
    });

    it('fails if the breed is male only and female given', () => {
      const val = getBreedData('Heartseeker');
      expect(val).to.have.property('genderOnly', 'm');
      expect(validGenderForBreed('f', val as BreedEntry)).to.be.false;
    });
  });

  describe('getBreedData', () => {
    it("breed name returns the breed's data", () => {
      expect(getBreedData('Aegis Enraged')).to.have.all.keys(
        'name',
        'genderOnly',
        'metaData',
        'male',
        'releaseDate',
      );
    });

    it('invalid breed name returns undefined', () => {
      expect(getBreedData('Satoro Gojo')).to.be.undefined;
    });
  });

  describe('breedEntryToPortrait', () => {
    it('returns the portrait for breed available as male with male wanted', () => {
      expectTypeOf(
        breedEntryToPortrait(getBreedData('Aria') as BreedEntry, 'male'),
      ).toEqualTypeOf<PortraitData>();
    });

    it('returns the portrait for breed available as female with female wanted', () => {
      expectTypeOf(
        breedEntryToPortrait(getBreedData('Aria') as BreedEntry, 'female'),
      ).toEqualTypeOf<PortraitData>();
    });
  });

  describe('expandGender', () => {
    it('m expands to male', () => {
      expect(expandGender('m')).to.be.eq('male');
    });
    it('f expands to female', () => {
      expect(expandGender('f')).to.be.eq('female');
    });
  });

  describe('createLineageLink', () => {
    it('returns a link to the view lineage with a given hash', () => {
      const originalWindowLocation = window.location;

      Object.defineProperty(window, 'location', {
        configurable: true,
        enumerable: true,
        value: {
          origin: 'http://example.com',
        },
      });
      expect(createLineageLink('test')).to.be.equal(
        new URL(import.meta.env.BASE_URL + '/view/test', 'http://example.com')
          .href,
      );

      Object.defineProperty(window, 'location', {
        configurable: true,
        enumerable: true,
        value: originalWindowLocation,
      });
    });
  });
});
