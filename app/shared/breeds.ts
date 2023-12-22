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

const malePortraits: PortraitData[] = [];
const femalePortraits: PortraitData[] = [];
const listOfBreeds: BreedEntry[] = [placeholder];

async function injectBreedList() {
  listOfBreeds.push(
    ...((await import('./breed-definitions.json')).default as BreedEntry[]),
  );

  syncPortraits();
}

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
  injectBreedList,
};
