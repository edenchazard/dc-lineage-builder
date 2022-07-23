import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import {
    createResolutionSet,
    missingSprites,
    getBreedTable as localBreedTable
} from "./local-handling.js";

import {
    makeCSSStyleSheet,
    getBreedTable as fallbackBreedTable,
} from "./fallback-handling.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getBreedsTable(){
    let table = fallbackBreedTable().concat(localBreedTable());
    table.sort((a, b) => a.name.localeCompare(b.name));

    return table;
}

async function main(){
    try{
        const            
            definitionsJSON = "breed-definitions.json",
            breeds = getBreedsTable(),
            json = JSON.stringify(breeds),
            sprites72 = __dirname + '/sprites72/',
            sprites36 = __dirname + '/sprites36/';

        console.log(`${breeds.length} breeds.`);

        const spritesMissing = await missingSprites([sprites72, sprites36]);

        if(spritesMissing){
            console.log("Script cancelled: sprites missing.");
            process.exit(1);
        }
        // 72 x 96 high dpi
        await createResolutionSet({
            // where to find the sprites
            locTiles: sprites72,
            // where to save the finished spritesheet
            locSpriteSheet: "./src/frontend/src/assets/breed-tiles-72x96.png",
            // where to save the css file
            locCSSFile: './src/frontend/src/assets/sprites-72x96.css',
            sizing: { width: 72, height: 96, spacing: 0},
            CSSStep: 36
        });

        // 36 x 48 
        await createResolutionSet({
            locTiles: sprites36,
            locSpriteSheet: "./src/frontend/src/assets/breed-tiles-36x48.png",
            locCSSFile: './src/frontend/src/assets/sprites-36x48.css',
            sizing: { width: 36, height: 48, spacing: 0 },
            CSSStep: 36
        });

        // make and save the definition file to frontend and backend
        await Promise.all([
            fs.writeFile('./src/frontend/src/'+definitionsJSON, json, 'utf8'),
            fs.writeFile('./src/backend/'+definitionsJSON, json, 'utf8')
        ]);
        console.log("... copied breed definitions to SPA and Server.");

        // make and save the fallbacks stylesheet
        await fs.writeFile('./src/frontend/src/assets/fallbacks.css', makeCSSStyleSheet(), 'utf8');
        console.log("... saved fallbacks css.");
        console.log("SCRIPT COMPLETE");
    }
    catch(err){
        console.log(err);
    }
}

main();