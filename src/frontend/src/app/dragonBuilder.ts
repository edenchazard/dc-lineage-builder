import GLOBALS from './globals';
import { DragonType, MaybePartialLineageWithMetadata } from './types';
import { getBreedData, hasParents } from './utils';

export function cloneDragon(dragon: DragonType) {
  return {
    ...dragon,
    selected: false,
  };
}

// Takes a parents object and switches the two
// If null, returns null
export function switchParents(
  dragon: MaybePartialLineageWithMetadata,
): MaybePartialLineageWithMetadata {
  // check it has parents
  if (!hasParents(dragon)) return dragon;

  const switched = (
    dragon: MaybePartialLineageWithMetadata,
  ): MaybePartialLineageWithMetadata => {
    const newGender = dragon.gender === 'f' ? 'm' : 'f';

    const breed = getBreedData(dragon.breed);

    // todo
    if (breed!.genderOnly) dragon.breed = GLOBALS.placeholder.name;

    Object.assign(dragon.gender, newGender);
    return dragon;
  };

  // make a new branch with the parents switched
  const newParents = {
    ...dragon,
    parents: {
      m: switched(dragon.parents.f),
      f: switched(dragon.parents.m),
    },
  };

  return newParents;
}
