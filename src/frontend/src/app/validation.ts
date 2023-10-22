import { object, string, number, lazy } from 'yup';
import type { ObjectSchema } from 'yup';
import type {
  BreedEntry,
  DragonDisplay,
  DragonGender,
  DragonType,
  NoDragonParents,
} from './types';
import settings from './settings';
import GLOBALS from './globals';
import { DragonBuilder } from './dragonBuilder';

export const NAMEREGEXP = /^[a-zA-Z0-9]([a-zA-Z0-9 '-]+)[a-zA-Z0-9]$/;
export const CODEREGEXP = /[a-zA-Z0-9]+/;
export const BREEDNAMEREGEXP = /[a-zA-Z0-9 ]{1,32}/;

export const dragonSchema: ObjectSchema<DragonType> = object().shape({
  name: string()
    .required()
    .test('name', validateName)
    .default(DragonBuilder.generateName()),
  code: string()
    .required()
    .test('code', validateCode)
    .default(DragonBuilder.generateCode()),
  display: number<DragonDisplay>().required().min(0).max(1).default(0),
  breed: lazy(() =>
    string()
      .required()
      .matches(BREEDNAMEREGEXP)
      .oneOf(getTrueBreeds())
      .default(GLOBALS.placeholder.name),
  ),
  gender: string<DragonGender>().required().oneOf(['m', 'f']),
  parents: object()
    .shape({
      m: lazy(() => dragonSchema.default(undefined)),
      f: lazy(() => dragonSchema.default(undefined)),
    })
    .shape({} as NoDragonParents)
    .default({})
    .required(),
});

export function validateName(name: string) {
  return NAMEREGEXP.test(name) && name.length >= 1 && name.length <= 32;
}

export function validateCode(code: string) {
  return NAMEREGEXP.test(code) && code.length >= 4 && code.length <= 5;
}

export function validateGenerationCount(count: number): boolean {
  return count >= settings.gens.min && count <= settings.gens.max;
}

function getTrueBreeds(): BreedEntry['name'][] {
  return GLOBALS.breeds.entire
    .filter((breed) => ['local', 'dc'].includes(breed.metaData.src))
    .map((breed) => breed.name);
}
