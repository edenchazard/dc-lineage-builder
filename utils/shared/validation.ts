import { object, string, number, lazy } from 'yup';
import type { ObjectSchema } from 'yup';
import type {
  BreedEntry,
  DragonDisplay,
  DragonGender,
  NoDragonParents,
  PartialLineage,
} from './types';
import settings from './settings.js';
import { listOfBreeds, placeholder } from './breeds.js';
import { DragonBuilder } from './dragonBuilder.js';

export const NAMEREGEXP = /^[a-zA-Z0-9]([a-zA-Z0-9― —’–'-]+)[a-zA-Z0-9]$/;
export const CODEREGEXP = /[a-zA-Z0-9]+/;
export const BREEDNAMEREGEXP = /[a-zA-Z0-9 ]{1,32}/;

export const codeValidator = string()
  .default('')
  .test(
    'code',
    ({ value }) =>
      `Codes must be 4 to 5 characters and alphanumeric.
  ${value} was given.`,
    validateCode,
  );

export const nameValidator = string()
  .default('')
  .test(
    'name',
    ({ value }) =>
      `Names must be 1 to 32 characters in length and only contain
    alphanumeric characters, spaces apostrophes and dashes.
    Additionally non-alphanumeric characters must not be
    present at the start and end of name. ${value} was given.`,
    validateName,
  );

export const dragonSchema: ObjectSchema<PartialLineage> = object()
  .shape({
    name: nameValidator.required().default(() => DragonBuilder.generateName()),
    code: codeValidator.required().default(() => DragonBuilder.generateCode()),
    display: number<DragonDisplay>().required().oneOf([0, 1]).default(0),
    breed: lazy(() =>
      string()
        .required()
        .matches(
          BREEDNAMEREGEXP,
          ({ value }) =>
            `Breed names must be 1 to 32 characters in length and only contain
          alphanumeric characters or spaces. ${value} was given.`,
        )
        .oneOf(
          getTrueBreeds(),
          ({ value }) => `Breed names must be official. ${value} was given.`,
        )
        .default(placeholder.name),
    ),
    gender: string<DragonGender>().required().oneOf(['m', 'f']),
    parents: object()
      .required()
      .default({})
      .shape({
        m: lazy(() => dragonSchema.default(undefined)),
        f: lazy(() => dragonSchema.default(undefined)),
      })
      .shape({} as NoDragonParents),
  })
  .noUnknown();

export function validateName(name: string) {
  return NAMEREGEXP.test(name) && name.length >= 1 && name.length <= 32;
}

export function validateCode(code: string) {
  return CODEREGEXP.test(code) && code.length >= 4 && code.length <= 5;
}

export function validateGenerationCount(count: number): boolean {
  return count >= settings.gens.min && count <= settings.gens.max;
}

export function validateLineageHash(str: string): boolean {
  return /^[a-f0-9]{40}$/.test(str);
}

function getTrueBreeds(): BreedEntry['name'][] {
  return listOfBreeds
    .filter((breed) => breed.metaData.src !== 'ghost')
    .map((breed) => breed.name);
}
