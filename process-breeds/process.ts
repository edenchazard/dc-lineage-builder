/*
    This script is to be run every time a new breed is added in development.
    It creates:
    1)  breed-definitions.json
        File containing information about all breeds
    2)  fallbacks.css
        File containing left, top and height css data for breeds
        rendered with the fallback method (dc src)
    3)  sprites-36x48.css
        CSS spritesheet for locally rendered breeds, individual images are inline
        using base64 data uris.

        3.1) sprites-72x96.css
            72x96 high definition sprite set.
*/
import { promises as fs } from 'fs';

import { getFileAndDirName, prettyPrintJSONFile } from './utils.js';
import { caches, ignoreFile } from './files';

import {
  saveResolutionStylesheet,
  getBreedTable as localBreedTable,
  checkCache,
  type LocalBreedsJSON,
} from './local-handling.js';

import _localJSON from './local-breeds.json';

import {
  makeCSSStyleSheet,
  getBreedTable as fallbackBreedTable,
  type FallbackBreedsJSON,
} from './fallback-handling.js';

import _fallbackJSON from './fallback-breeds.json' assert { type: 'json' };
import type { BreedEntry } from '../app/shared/types';

const { __dirname } = getFileAndDirName();

const fallbackJSON = _fallbackJSON as unknown as FallbackBreedsJSON;

const localJSON = _localJSON as unknown as LocalBreedsJSON;

function getBreedsTable() {
  // check for duplicate breed name keys in both sets, and warn
  // if they exist.
  const mapNames = (breed: BreedEntry) => breed.name;
  const fallbacks = fallbackBreedTable(fallbackJSON);
  const locals = localBreedTable(localJSON);
  const fallbackNames = fallbacks.map(mapNames);
  const localNames = locals.map(mapNames);
  const uniqueNames = new Set([...fallbackNames, ...localNames]);

  uniqueNames.forEach((uniqueName) => {
    // check if the fully computed name exists in both lists
    if (fallbackNames.includes(uniqueName) && localNames.includes(uniqueName)) {
      throw new Error(`Err: Breed name ${uniqueName} exists in both lists.`);
    }
    const dupeCheck = (name: string) => name === uniqueName;

    // check for dupes of each computed name in lists
    if (fallbackNames.filter(dupeCheck).length > 1) {
      throw new Error(`Err: Duplicate name in fallback list: ${uniqueName}`);
    }

    if (localNames.filter(dupeCheck).length > 1) {
      throw new Error(`Err: Duplicate name in local list: ${uniqueName}`);
    }
  });

  // return our full breed table sorted alphabetically
  return [...fallbacks, ...locals].sort((a, b) => a.name.localeCompare(b.name));
}

async function main() {
  const definitionsJSON = 'breed-definitions.json';
  const breeds = getBreedsTable();
  const json = JSON.stringify(breeds);
  const localNumber = breeds.filter(
    (breed) => breed.metaData.src === 'local',
  ).length;
  const fallbackNumber = breeds.filter(
    (breed) => breed.metaData.src === 'dc',
  ).length;

  console.log(
    `Found ${breeds.length} total breed entries (${localNumber} local and ${fallbackNumber} fallbacks.)`,
  );

  // prettify our json files
  await Promise.all([
    prettyPrintJSONFile(__dirname + '/local-breeds.json'),
    prettyPrintJSONFile(__dirname + '/fallback-breeds.json'),
  ]);

  await Promise.all(Object.values(caches).map((cache) => cache.tryAccess()));

  // 36 x 48
  await checkCache(localJSON, caches.cache36, ignoreFile);

  await saveResolutionStylesheet({
    locTiles: caches.cache36.settings.folder,
    locCSSFile: './app/assets/tile-rendering/sprites-36x48.css',
    sizing: { width: 36, height: 48 },
    injectFolder: caches.cache36.settings.inject,
  });

  // 72 x 96 high dpi
  await checkCache(localJSON, caches.cache72, ignoreFile);

  await saveResolutionStylesheet({
    locTiles: caches.cache72.settings.folder,
    locCSSFile: './app/assets/tile-rendering/sprites-72x96.css',
    sizing: { width: 72, height: 96 },
    injectFolder: caches.cache72.settings.inject,
  });

  // make and save the definition file
  await fs.writeFile('./app/shared/' + definitionsJSON, json, 'utf8');

  console.log('Synced breed definitions.');

  // make and save the fallbacks stylesheet
  await fs.writeFile(
    './app/assets/tile-rendering/fallbacks.css',
    makeCSSStyleSheet(fallbackJSON),
    'utf8',
  );
  console.log('Saved fallbacks css.');
  console.log('SCRIPT COMPLETE');
}

main();
