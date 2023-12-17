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
import { cache36, cache72, ignoreFile } from './files.js';
import { portraitCache } from './cache.js';

import {
  saveResolutionStylesheet,
  getBreedTable as localBreedTable,
  checkCache,
} from './local-handling.js';

import localJSON from './local-breeds.json' assert { type: 'json' };

import {
  makeCSSStyleSheet,
  getBreedTable as fallbackBreedTable,
} from './fallback-handling.js';

import fallbackJSON from './fallback-breeds.json' assert { type: 'json' };

const { __dirname, __filename } = getFileAndDirName();

function getBreedsTable() {
  // check for duplicate breed name keys in both sets, and warn
  // if they exist.
  const mapNames = (breed) => breed.name;
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
    const dupeCheck = (name) => name === uniqueName;

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

  const [driver36, driver72] = await Promise.all([
    portraitCache.load(cache36.folder),
    portraitCache.load(cache72.folder),
  ]);

  // prettify our json files
  await Promise.all([
    prettyPrintJSONFile(__dirname + '/local-breeds.json'),
    prettyPrintJSONFile(__dirname + '/fallback-breeds.json'),
  ]);

  // 36 x 48
  await checkCache(localJSON, driver36, cache36.device, ignoreFile);

  await saveResolutionStylesheet({
    locTiles: cache36.folder,
    locCSSFile: '../frontend/src/assets/tile-rendering/sprites-36x48.css',
    sizing: { width: 36, height: 48 },
    injectFolder: cache36.inject,
  });

  // 72 x 96 high dpi
  await checkCache(localJSON, driver72, cache72.device, ignoreFile);

  await saveResolutionStylesheet({
    locTiles: cache72.folder,
    locCSSFile: '../frontend/src/assets/tile-rendering/sprites-72x96.css',
    sizing: { width: 72, height: 96 },
    injectFolder: cache72.inject,
  });

  // make and save the definition file to frontend and backend
  await Promise.all([
    fs.writeFile('../frontend/src/' + definitionsJSON, json, 'utf8'),
    fs.writeFile('../backend/src/' + definitionsJSON, json, 'utf8'),
  ]);

  console.log('Synced breed definitions to backend and frontend.');

  // make and save the fallbacks stylesheet
  await fs.writeFile(
    '../frontend/src/assets/tile-rendering/fallbacks.css',
    makeCSSStyleSheet(fallbackJSON),
    'utf8',
  );
  console.log('Saved fallbacks css.');
  console.log('SCRIPT COMPLETE');
}

main();
