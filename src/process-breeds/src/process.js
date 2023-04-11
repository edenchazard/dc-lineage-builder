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

import { cache36, cache72, ignoreFile } from './files.js';

import {
    saveResolutionStylesheet,
    getBreedTable as localBreedTable,
    checkCache
} from "./local-handling.js";

import localJSON from "./local-breeds.json" assert { type: "json" };

import {
    makeCSSStyleSheet,
    getBreedTable as fallbackBreedTable,
} from "./fallback-handling.js";

import fallbackJSON from "./fallback-breeds.json" assert { type: "json" };
import { portraitCache } from './cache.js';

function getBreedsTable() {
    let table = fallbackBreedTable(fallbackJSON).concat(localBreedTable(localJSON));
    table.sort((a, b) => a.name.localeCompare(b.name));

    return table;
}

async function main() {
    const
        definitionsJSON = "breed-definitions.json",
        breeds = getBreedsTable(),
        json = JSON.stringify(breeds);

    console.log(`Found ${breeds.length} breed entries.`);

    const [driver36, driver72] = await Promise.all([
        portraitCache.load(cache36.folder),
        portraitCache.load(cache72.folder),
    ]);

    // 36 x 48 
    await checkCache(localJSON, driver36, cache36.device, ignoreFile);

    await saveResolutionStylesheet({
        locTiles: cache36.folder,
        locCSSFile: '../frontend/src/assets/tile-rendering/sprites-36x48.css',
        sizing: { width: 36, height: 48 },
        injectFolder: cache36.inject
    });

    // 72 x 96 high dpi
    await checkCache(localJSON, driver72, cache72.device, ignoreFile);

    await saveResolutionStylesheet({
        locTiles: cache72.folder,
        locCSSFile: '../frontend/src/assets/tile-rendering/sprites-72x96.css',
        sizing: { width: 72, height: 96 },
        injectFolder: cache72.inject
    });

    // make and save the definition file to frontend and backend
    await Promise.all([
        fs.writeFile('../frontend/src/' + definitionsJSON, json, 'utf8'),
        fs.writeFile('../backend/src/' + definitionsJSON, json, 'utf8')
    ]);

    console.log("Synced breed definitions to backend and frontend.");

    // make and save the fallbacks stylesheet
    await fs.writeFile('../frontend/src/assets/tile-rendering/fallbacks.css', makeCSSStyleSheet(fallbackJSON), 'utf8');
    console.log("Saved fallbacks css.");
    console.log("SCRIPT COMPLETE");
}

main();