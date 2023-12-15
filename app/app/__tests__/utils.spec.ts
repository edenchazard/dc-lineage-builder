import { describe, it, expect } from 'vitest';
import {
  breedEntryToPortrait,
  createLineageLink,
  expandGender,
  getBreedData,
  validGenderForBreed,
} from '../utils';
import type { BreedEntry } from 'app/shared/types';

describe('utils', () => {
  describe('#validGenderForBreed', () => {
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

  describe('#getBreedData', () => {
    it("breed name returns the breed's data", () => {
      expect(getBreedData('Aegis Enraged')).to.have.all.keys(
        'name',
        'genderOnly',
        'metaData',
        'male',
      );
    });

    it('invalid breed name returns undefined', () => {
      expect(getBreedData('Satoro Gojo')).to.be.undefined;
    });
  });

  describe('#breedEntryToPortrait', () => {
    it('returns the portrait for breed available as male with male wanted', () => {
      expect(
        breedEntryToPortrait(getBreedData('Aria') as BreedEntry, 'male'),
      ).to.have.all.keys('name', 'image', 'metaData');
    });

    it('returns the portrait for breed available as female with female wanted', () => {
      expect(
        breedEntryToPortrait(getBreedData('Aria') as BreedEntry, 'female'),
      ).to.have.all.keys('name', 'image', 'metaData');
    });
  });

  describe('#expandGender', () => {
    it('m expands to male', () => {
      expect(expandGender('m')).to.be.eq('male');
    });
    it('f expands to female', () => {
      expect(expandGender('f')).to.be.eq('female');
    });
  });

  describe('#createLineageLink', () => {
    it('returns a link to the view lineage with a given hash', async () => {
      const originalWindowLocation = window.location;

      Object.defineProperty(window, 'location', {
        configurable: true,
        enumerable: true,
        value: new URL('http://example.com/'),
      });

      expect(createLineageLink('test')).to.be.equal(
        'http://example.com/view/test',
      );

      Object.defineProperty(window, 'location', {
        configurable: true,
        enumerable: true,
        value: originalWindowLocation,
      });
    });
  });
});
