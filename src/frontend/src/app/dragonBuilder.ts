import {
  uniqueNamesGenerator,
  names,
  colors,
  animals,
} from 'unique-names-generator';
import GLOBALS from './globals';
import type {
  PartialLineageWithMetadata,
  MaybePartialLineageWithMetadata,
  DragonTypeWithMetadata,
  DragonType,
} from './types';
import { getBreedData, hasParents } from './utils';

export class DragonBuilder {
  public static createWithMetadata(
    attributes: Partial<DragonTypeWithMetadata> = {},
  ): PartialLineageWithMetadata {
    return {
      ...this.create(),
      selected: false,
      ...attributes,
    } as DragonTypeWithMetadata;
  }

  public static create(attributes: Partial<DragonType> = {}) {
    return {
      code: this.generateCode(),
      name: this.generateName(),
      parents: {},
      breed: GLOBALS.placeholder.name,
      gender: 'm',
      display: 1,
      ...attributes,
    } as DragonType;
  }

  public static generateCode(): string {
    const characters =
      '1234567890ABCDEFGHIJKLMNOPQRTUVWXYZabcdefghijklmnopqrstuvwyz';
    let str = '';
    for (let i = 0; i < 5; ++i) {
      str += characters[~~(Math.random() * characters.length)];
    }
    return str;
  }

  public static generateName(): string {
    return uniqueNamesGenerator({
      dictionaries: [names, colors, animals],
      length: 2,
      separator: ' ',
      style: 'capital',
    });
  }

  public static clone(dragon: DragonType) {
    return {
      ...dragon,
      selected: false,
    };
  }

  // Takes a parents object and switches the two
  // If null, returns null
  public static switchParents(
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
}
