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
import path from 'path';
import { fileURLToPath } from 'url';

import {
    saveResolutionStylesheet,
    missingSprites,
    getBreedTable as localBreedTable
} from "./local-handling.js";

import localJSON from "./local-breeds.json" assert { type: "json" };

import {
    makeCSSStyleSheet,
    getBreedTable as fallbackBreedTable,
} from "./fallback-handling.js";

import fallbackJSON from "./fallback-breeds.json" assert { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getBreedsTable() {
    let table = fallbackBreedTable(fallbackJSON).concat(localBreedTable(localJSON));
    table.sort((a, b) => a.name.localeCompare(b.name));

    return table;
}

async function main() {
    try {
        const
            definitionsJSON = "breed-definitions.json",
            breeds = getBreedsTable(),
            json = JSON.stringify(breeds),
            sprites72 = __dirname + '/sprites72/',
            sprites36 = __dirname + '/sprites36/';

        console.log(`${breeds.length} breeds.`);

        const spritesMissing = await missingSprites([sprites72, sprites36]);

        if (spritesMissing) {
            console.log("Script cancelled: sprites missing.");
            process.exit(1);
        }

        // 72 x 96 high dpi
        await saveResolutionStylesheet({
            locTiles: sprites72,
            locCSSFile: '../frontend/src/assets/tile-rendering/sprites-72x96.css',
            sizing: { width: 72, height: 96 }
        });

        // 36 x 48 
        await saveResolutionStylesheet({
            locTiles: sprites36,
            locCSSFile: '../frontend/src/assets/tile-rendering/sprites-36x48.css',
            sizing: { width: 36, height: 48 }
        });

        // make and save the definition file to frontend and backend
        await Promise.all([
            fs.writeFile('../frontend/src/' + definitionsJSON, json, 'utf8'),
            fs.writeFile('../backend/src/' + definitionsJSON, json, 'utf8')
        ]);
        console.log("... copied breed definitions to SPA and Server.");

        // make and save the fallbacks stylesheet
        await fs.writeFile('../frontend/src/assets/tile-rendering/fallbacks.css', makeCSSStyleSheet(fallbackJSON), 'utf8');
        console.log("... saved fallbacks css.");
        console.log("SCRIPT COMPLETE");
    }
    catch (err) {
        console.log(err);
    }
}

main();