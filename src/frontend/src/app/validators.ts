import { isBreedInList, countGenerations, getBreedData } from './utils';
import GLOBALS from './globals';
import settings from './settings';
import {
  DragonDisplay,
  DragonParents,
  DragonType,
  Gender,
  LineageRoot,
  EmptyParents,
} from './types';
import { createTester } from './minitester';

const NAMEREGEXP = /^^[a-zA-Z0-9]([a-zA-Z0-9 '-]{1,32})[a-zA-Z0-9]$/;
const CODEREGEXP = /^[a-zA-Z0-9]{4,5}$/;

function validateGenderFitsBreed(dragon: DragonType) {
  const breed = getBreedData(dragon.breed);

  // breed doesn't exist
  if (!breed) return false;
  // dragon's gender doesn't match the available genders
  // for this breed
  else if (breed.genderOnly) return dragon.gender === breed.genderOnly;

  return true;
}

function validateName(str: string) {
  return NAMEREGEXP.test(str);
}

function validateCode(str: string) {
  return CODEREGEXP.test(str);
}

function validateDisplay(value: DragonDisplay) {
  return value === 0 || value === 1;
}

function validateGender(value: Gender) {
  return value === 'm' || value === 'f';
}

function hasEmptyParents(parents: DragonParents | EmptyParents) {
  return Object.keys(parents).length === 0;
}

// This will also include ghost breeds.
function validateBreed(breed: string) {
  return !!getBreedData(breed);
}

function hasBothParents(parents: DragonParents | EmptyParents) {
  if (Object.keys(parents).length === 2 && 'f' in parents && 'm' in parents) {
    //check the dragon objects for each parent actually match
    return parents.m.gender === 'm' && parents.f.gender === 'f';
  }
  return false;
}

// The dragon MUST be supplied without the vue-specific keys applied
// such as selected, disabled
function hasAllKeys(dragon: DragonType) {
  const dragonKeys: string[] = [
    'parents',
    'name',
    'code',
    'display',
    'gender',
    'breed',
  ];
  if (Object.getOwnPropertyNames(dragon).length !== dragonKeys.length)
    return false;

  // run a test to check undefined for each key
  const tests = dragonKeys.map((key) => key in dragon);
  return !tests.includes(false);
}

function isLineageHash(str: string) {
  return /^[a-z0-9]{40}$/.test(str);
}
/* enum SaveReqs {
    Success,
    GenericFail,
    GhostsPresent,
    GenerationTooHigh,
    GenerationTooLow,

} */
/*  This is an extra test to check whether
    a lineage can be saved to the server.
    It assumes an integrity check has been run first.
*/
function meetsSaveRequirements(root: LineageRoot, supressReasoning = false) {
  const [tester, failedTests] = createTester(supressReasoning);

  // fetch ghosties 👻
  const ghostList = GLOBALS.breeds.entire.filter(
    (breed) => breed.metaData.src === 'ghost',
  );

  function notGhost(breed: string) {
    return !isBreedInList(ghostList, breed);
  }
  function genRange(count: number) {
    return count >= settings.gens.min && count <= settings.gens.max;
  }

  const analyseDragon = (dragon: DragonType) => {
    // check failed, don't even bother
    if (tester.failed) return;

    // Check if the breed name is a ghost breed
    tester.runTest(notGhost, dragon.breed);

    if (hasBothParents(dragon.parents)) {
      analyseDragon(dragon.parents.m);
      analyseDragon(dragon.parents.f);
    }
  };

  tester.begin();

  // gen count check
  tester.runTest(genRange, countGenerations(root));

  // If everything is ok generation wise,
  // then we can proceed to analysing the lineage
  // for ghost breeds
  if (!tester.failed) analyseDragon(root);

  return {
    failed: tester.failed,
    failedTests: failedTests,
  };
}

// this operates on a fail first policy. we check the pass
// variable every phase and if it's false,
// it means we failed a check somewhere and should stop
// checking.
function verifyIntegrity(root: LineageRoot, supressReasoning = false) {
  const [tester, failedTests] = createTester(supressReasoning);

  // basic tests
  const tests: Array<(dragon: DragonType) => boolean> = [
    function breed(dragon) {
      return validateBreed(dragon.breed);
    },
    // Some of these tests will also fail if the above breed test fails
    function name(dragon) {
      return validateName(dragon.name);
    },
    function code(dragon) {
      return validateCode(dragon.code);
    },
    function display(dragon) {
      return validateDisplay(dragon.display);
    },
    function gender(dragon) {
      return validateGender(dragon.gender);
    },
    function genderFitsBreed(dragon) {
      return validateGenderFitsBreed(dragon);
    },
  ];

  const analyseDragon = (dragon: DragonType) => {
    // we failed somewhere, skip
    if (tester.failed) return;

    // fail first if not all the keys are present
    if (!tester.runTest(hasAllKeys, dragon)) return;

    // execute basic tests
    tests.forEach((test) => tester.runTest(test, dragon));

    // parents tests should be handled separately
    if (hasEmptyParents(dragon.parents))
      return; // no issues here and no parents to analyse
    else if (hasBothParents(dragon.parents)) {
      // this particular dragon has passed the test.
      // but we still need to check parent dragons.
      analyseDragon(dragon.parents.m);
      analyseDragon(dragon.parents.f);
    }
    // parents are not empty OR doesn't contain both parent keys
    else return tester.testFail('parents', dragon);
  };

  tester.begin();
  analyseDragon(root);

  return {
    failed: tester.failed,
    failedTests: failedTests,
  };
}

export {
  NAMEREGEXP,
  CODEREGEXP,
  validateCode,
  validateName,
  validateBreed,
  validateDisplay,
  validateGenderFitsBreed,
  isLineageHash,
  meetsSaveRequirements,
  verifyIntegrity,
};
