import _breedList from './breed-definitions.json';
import type { BreedEntry, PortraitData } from './types';
import { getDCTime, filterBreedTableByGender } from '../app/utils';

const placeholder: BreedEntry = {
  name: 'Placeholder',
  male: 'place',
  female: 'place',
  genderOnly: false,
  metaData: {
    group: '*',
    src: 'local',
    tags: [],
  },
};

const breedList = _breedList as BreedEntry[];

// different breed tables for different needs
const listOfBreeds = [placeholder, ...breedList];
const malePortraits: PortraitData[] = [];
const femalePortraits: PortraitData[] = [];

function syncPortraits() {
  Object.assign(malePortraits, filterBreedTableByGender(listOfBreeds, 'm'));
  Object.assign(femalePortraits, filterBreedTableByGender(listOfBreeds, 'f'));
}

function adjustTiles() {
  // In the daytime, nocturnes
  // have a different position.
  const isNocturneActive = (() => {
    const hours = parseInt(
      getDCTime().find((part) => part.type === 'hour')?.value ?? '',
    );
    return hours >= 18 || hours < 6;
  })();

  // modify to daytime positioning
  if (!isNocturneActive) {
    const nocturne = listOfBreeds.findIndex(
      (breed) => breed.name === 'Nocturne',
    );

    if (nocturne !== -1) {
      listOfBreeds[nocturne].female = 'OrTHo_day';
      listOfBreeds[nocturne].male = 'OrTHo_day';
    }

    syncPortraits();
  }
}

export {
  placeholder,
  listOfBreeds,
  malePortraits,
  femalePortraits,
  adjustTiles,
  syncPortraits,
};
