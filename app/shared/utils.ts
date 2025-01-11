import {
  femalePortraits,
  listOfBreeds,
  malePortraits,
  syncPortraits,
} from './breeds.js';
import type {
  BreedEntry,
  DragonGender,
  PortraitData,
  MaybePartialLineageWithMetadata,
  PartialLineageWithMetadata,
} from './types.js';
import { BREEDNAMEREGEXP } from './validation.js';

export function validGenderForBreed(
  gender: DragonGender,
  breed: BreedEntry,
): boolean {
  // if the genderonly attribute is not false,
  // it means the breed is male only or female only
  // and will be specified in the value
  return breed.genderOnly === false || breed.genderOnly === gender;
}

export function throwBreedError(name: string): never {
  throw new Error(`Breed ${name} doesn't exist.`);
}

// returns undefined if breed isn't in the global list
export function getBreedData(breedName: string): BreedEntry | undefined {
  const entry = listOfBreeds.find((v) => v.name === breedName);

  return entry;
}

export function breedEntryToPortrait(
  breed: BreedEntry,
  gender: 'male' | 'female',
): PortraitData {
  if (gender in breed === false)
    throw new Error(`DragonGender isn't available for ${breed.name}`);

  const data: PortraitData = {
    name: breed.name,
    image: breed[gender] as string,
    metaData: breed.metaData,
  };

  return data;
}

/**
 * Expands m or f to male/female
 */
export function expandGender(gender: DragonGender) {
  return gender === 'm' ? 'male' : 'female';
}

export function getTable(gender: DragonGender): PortraitData[] {
  return gender === 'm' ? malePortraits : femalePortraits;
}

export function hasParents(
  dragon: MaybePartialLineageWithMetadata,
): dragon is MaybePartialLineageWithMetadata & {
  parents: { m: PartialLineageWithMetadata; f: PartialLineageWithMetadata };
} {
  return (
    typeof dragon.parents.f === 'object' && typeof dragon.parents.m === 'object'
  );
}

// Returns a list of breed entries filtered by gender
export function filterBreedTableByGender(
  breeds: BreedEntry[],
  gender: DragonGender,
) {
  const expandedGender = expandGender(gender);

  return breeds
    .filter((breed) => validGenderForBreed(gender, breed))
    .map((breed) => breedEntryToPortrait(breed, expandedGender));
}

export function isBreedInList(list: BreedEntry[], breedName: string) {
  //if(typeof breedName === 'string'){
  return list.findIndex((breed) => breed.name === breedName) > -1;
  //}
  /*else if (typeof breedName === 'object'){
        placeholder.log('r');
        return list.findIndex(breed => breed.name === breedName) > -1;
    }*/
  //throw new Error("not string or object of breeds, type "+typeof breedName);
}

export function addBreed(breedObj: BreedEntry, resort: boolean = true) {
  // trim whitespace from name
  const newBreed = { ...breedObj, name: breedObj.name.trim() };

  // Reject bad names
  if (!newBreed.name.match(BREEDNAMEREGEXP)) return false;

  // There's already a breed matching this name
  if (isBreedInList(listOfBreeds, newBreed.name)) return false;

  // TODO: We should add some tests to check metadata etc

  listOfBreeds.push(newBreed);

  if (resort) {
    // if required retain our alphabetical sort
    listOfBreeds.sort((b1, b2) => b1.name.localeCompare(b2.name));
  }
  // update gender tables
  syncPortraits();
  return true;
}

export function getDCTime() {
  return new Intl.DateTimeFormat('en-us', {
    timeZone: 'America/New_York',
    timeStyle: 'long',
    hour12: false,
  }).formatToParts();
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function debounce(
  callback: (...args: unknown[]) => unknown,
  timeout = 300,
) {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback.apply(window, args);
    }, timeout);
  };
}

export function createLineageLink(hash: string) {
  const origin = window.location.origin;
  const mountPath = import.meta.env.BASE_URL;
  return `${origin}${mountPath}/view/${hash}`;
}

const tagRegExp = /^(p:|s:)/g;
export function resolveLabel<T>(tag: string): T {
  return tag.replace(tagRegExp, '') as T;
}

export function slug(str: string) {
  return str.replaceAll(' ', '-').toLowerCase();
}
