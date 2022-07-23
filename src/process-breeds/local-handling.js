import { promises as fs } from 'fs';
import imagesLib from "images";
import localBreeds from './local-breeds.json';

export function getBreedTable(){
    let entries = [];

    const createEntry = function(name, breed, spritedata){
        let entry = {
            name: name,
            genderOnly: breed.genderOnly,
            metaData: {
                category: breed.category,
                src: "local"
            }
        };

        if(breed.dimorphism){
            entry.male = spritedata[0];
            entry.female = spritedata[1];
        }
        else{
            if(!breed.genderOnly){
                entry.male = entry.female = spritedata;
            }
            else{
                const gender = breed.genderOnly == 'm' ? 'male' : 'female';
                entry[gender] = spritedata;
            }
        }

        return entry;
    }

    for(let breedname in localBreeds){
        const breed = localBreeds[breedname];
        const has_alts = Object.getPrototypeOf(breed.sprites) === Object.prototype;

        if(has_alts){
            for(let altname in breed.sprites){
                const altdata = breed.sprites[altname];
                let entry = createEntry(breedname + " " + altname, breed, altdata);
                entries.push(entry);
            }
        }
        else {
            let entry = createEntry(breedname, breed, breed.sprites);
            entries.push(entry);
        }
    }

    return entries;
}

async function getTilesInFolder(dir){
    return fs.readdir(dir);
}

// combines multiple tiles into a single spritesheet to be used by CSS
function makeSpriteSheet(tiles, sizing, dir){
    const
        { width, height, spacing } = sizing,
        sheetWidth = width * tiles.length;

    const spritesheet = imagesLib(sheetWidth, height);

    let x = 0;

    for(let image of tiles){
        spritesheet.draw(imagesLib(dir + image), x, 0);
        x += width + spacing;
    }

    return spritesheet;
}

/*function CSSMods(mods){
    const
        classes = mods.map(mod => '.d-'+mod[0]).join(','),
        css = mods.map(mod => mod[1]()).join();

    return `${classes}{${css}}`;
}*/

function makeCSSSprites(tiles, width, spacing){
/*    const mods = [
        ['9IM3', () => "image-rendering: pixelated"]
    ];
*/
    let
        css = '',
        x = 0; // positioning x-axis

    for(let image of tiles){
        const fileWithoutPNG = image.slice(0, -4);

        css += `.d-${fileWithoutPNG}{background-position-x:${x}px}`;
        x -= width - spacing;
    }

    //css += CSSMods(mods);
    return css;
}

export async function createResolutionSet({CSSStep, locTiles, locSpriteSheet, locCSSFile, sizing}){
    const
        tiles = await getTilesInFolder(locTiles),
        { width, height, spacing } = sizing;
    tiles.sort();

    console.log(`Creating with sizes: ${width}w x ${height}h.`);
    console.log(`Found ${tiles.length} sprites in folder ${locTiles}`);

    // make and save sprite sheet
    makeSpriteSheet(tiles, sizing, locTiles)
        .save(locSpriteSheet, { quality: 100 });
    console.log("... saved sprite sheet.");

    // make and save CSS file
    let css = makeCSSSprites(tiles, CSSStep, spacing);
    css += `.local{background-image: url(../assets/breed-tiles-${width}x${height}.png);}`;

    await fs.writeFile(locCSSFile, css, 'utf8');
    console.log("... saved css stylesheet.");
    console.log("Done.")
}

export async function missingSprites(folderA, folderB){
    const
        [ spritesA, spritesB ] = await Promise.all([
            getTilesInFolder(folderA),
            getTilesInFolder(folderB)
        ]);

    const missing = (src, target) => {
        const sprites = [];

        for(let file of src){
            if(target.indexOf(file) === -1){
                sprites.push(file);
            }
        }

        return sprites;
    }

    console.log("Checking folders for missing sprites.");

    // sprites missing
    // check both folders for the missing sprites
    const
        a = missing(spritesA, spritesB),
        b = missing(spritesB, spritesA);
    let fail = false;

    if(a.length > 0){
        console.log(`Missing sprites in ${folderA}`);
        console.log(a.join(', '));
        fail = true;
    }
    if(b.length > 0){
        console.log(`Missing sprites in ${folderB}`);
        console.log(b.join(', '));
        fail = true;
    }

    return fail;
}