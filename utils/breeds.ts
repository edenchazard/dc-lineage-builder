import type { BreedEntry, PortraitData } from './types';
import { filterBreedTableByGender } from './utils.js';

const placeholder: BreedEntry = {
  name: 'Placeholder',
  male: 'place',
  female: 'place',
  genderOnly: false,
  metaData: {
    src: 'local',
    tags: [],
  },
};

const malePortraits: PortraitData[] = [];
const femalePortraits: PortraitData[] = [];
const listOfBreeds: BreedEntry[] = [placeholder];

async function injectBreedList() {
  listOfBreeds.push(...(await import('./breed-definitions')).default);

  syncPortraits();
}

function syncPortraits() {
  Object.assign(malePortraits, filterBreedTableByGender(listOfBreeds, 'm'));
  Object.assign(femalePortraits, filterBreedTableByGender(listOfBreeds, 'f'));
}

export {
  placeholder,
  listOfBreeds,
  malePortraits,
  femalePortraits,
  syncPortraits,
  injectBreedList,
};
