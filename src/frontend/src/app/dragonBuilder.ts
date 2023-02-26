import {
  uniqueNamesGenerator,
  names,
  colors,
  animals,
} from 'unique-names-generator';

import GLOBALS from './globals';
import { DragonParents, DragonType, EmptyParents } from './types';
import { getBreedData } from './utils';

export function generateCode() {
  const characters =
    '1234567890ABCDEFGHIJKLMNOPQRTUVWXYZabcdefghijklmnopqrstuvwyz';
  let str = '';
  for (let i = 0; i < 5; ++i) {
    str += characters[~~(Math.random() * characters.length)];
  }
  return str;
}

export function generateName() {
  return uniqueNamesGenerator({
    dictionaries: [names, colors, animals],
    length: 2,
    separator: ' ',
    style: 'capital',
  });
}

export function createDragonProperties(changes?: Partial<DragonType>) {
  const defaults: DragonType = {
    code: generateCode(),
    name: generateName(),
    parents: {},
    breed: GLOBALS.placeholder.name,
    gender: 'm',
    display: 1,
    selected: false,
  };

  return changes === undefined ? defaults : { ...defaults, ...changes };
}

export function cloneDragon(dragon: DragonType) {
  return {
    ...dragon,
    selected: false,
  };
}

// Takes a parents object and switches the two
// If null, returns null
export function switchParents(parents: DragonParents | EmptyParents) {
  // check it has parents
  if (parents === null) return {};

  const switchGender = (dragon: DragonType) => {
    const newGender = dragon.gender === 'f' ? 'm' : 'f';

    const breed = getBreedData(dragon.breed);

    // todo
    if (breed!.genderOnly) dragon.breed = GLOBALS.placeholder.name;

    dragon.gender = newGender;
  };

  // make a new branch with the parents switched
  const newParents: DragonParents = {
    m: parents.f,
    f: parents.m,
  };

  switchGender(newParents.m);
  switchGender(newParents.f);

  return newParents;
}
