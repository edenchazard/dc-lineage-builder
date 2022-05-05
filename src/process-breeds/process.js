
const files = require('fs');
const fs = files.promises;
const imagesLib = require("images");
const local_breeds = require('./local-breeds.js');
const fallback_breeds =  require('./fallback-breeds.js');

function entireBreedTable_FromLocals(){
    let entries = [];

    const createEntry = function(name, breed, spritedata){
        let entry = {
            name: name,
            genderOnly: breed.genderOnly,
            metaData: {
                category: breed.category
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

    for(let breedname in local_breeds){
        const breed = local_breeds[breedname];
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

function entireBreedTable_FromFallbacks(){
    let getImageData = (o, gender) => {
        const offset = (gender == 'm' ? 0 : 4);
        return {
            x: o[offset+1],
            y: o[offset+2],
            h: o[offset+3],
            link: "https://dragcave.net/image/"+o[offset]
        };
    };

    let createEntry = (sprite, name, genderOnly, metaData) => {
        // determines dimorphism
        const has_dimorphism = sprite.length > 4;
        let entry = { };
        if(has_dimorphism){
            entry = { male: getImageData(sprite, 'm'), female: getImageData(sprite, 'f')}
        }
        else{
            // if it has no dimorphism data, just duplicate the male
            // values for the female
            const d = getImageData(sprite, 'm');
            if(!genderOnly){
                entry = { male: d, female: d };
            }
            else{
                const gender = genderOnly == 'm' ? 'male' : 'female';
                entry[gender] = d;
            }
        }

        entry.name = name;
        entry.genderOnly = genderOnly;
        entry.metaData = metaData;
        return entry;
    };

    // create a flat list of breeds : alts
    let breeds = [];
    for(let breed in fallback_breeds){
        const spritedata = fallback_breeds[breed].sprites;

        // many breeds have alternating sprites and we need to
        // account for this  
        let name = breed;
        const has_alts = !Array.isArray(spritedata);

        if(has_alts){
            for(let alt in spritedata){
                let entry = createEntry(spritedata[alt], name + " " + alt, fallback_breeds[breed].genderOnly,
                {
                    category: fallback_breeds[breed].category
                });
                breeds.push(entry);
            }
        }
        else {
            let entry = createEntry(spritedata, name, fallback_breeds[breed].genderOnly, 
            {
                category: fallback_breeds[breed].category
            });
            breeds.push(entry);
        }
    }

    return breeds;
}

function getBreedsTable(){
    let table = entireBreedTable_FromFallbacks().concat(entireBreedTable_FromLocals());
    table.sort((a, b) => a.name.localeCompare(b.name));

    return table;
}

async function getTilesInFolder(dir){
    return fs.readdir(dir);
}

// combines multiple tiles into a single spritesheet to be used by CSS
function makeSpriteSheet(tiles, sizing, dir){
    const
        { width, height } = sizing,
        sheetWidth = width * tiles.length;

    const spritesheet = imagesLib(sheetWidth, height);

    let x = 0;

    for(let image of tiles){
        spritesheet.draw(imagesLib(dir + image), x, 0);
        x += width;
    }

    return spritesheet;
}

/*function CSSMods(mods){
    const
        classes = mods.map(mod => '.d-'+mod[0]).join(','),
        css = mods.map(mod => mod[1]()).join();

    return `${classes}{${css}}`;
}*/

function makeCSSSprites(tiles, width){
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
        x -= width;
    }

    //css += CSSMods(mods);
    return css;
}

async function createResolutionSet({CSSStep, locTiles, locSpriteSheet, locCSSFile, sizing}){
    const
        tiles = await getTilesInFolder(locTiles),
        { width, height } = sizing;
    tiles.sort();

    console.log(`Creating with sizes: ${width}w x ${height}h.`);
    console.log(`Found ${tiles.length} sprites in folder ${locTiles}`);

    // make and save sprite sheet
    makeSpriteSheet(tiles, sizing, locTiles)
        .save(locSpriteSheet, { quality: 100 });
    console.log("... saved sprite sheet.");

    // make and save CSS file
    let css = makeCSSSprites(tiles, CSSStep);
    css += `.local{background-image: url(../assets/breed-tiles-${width}x${height}.png);}`;

    await fs.writeFile(locCSSFile, css, 'utf8');
    console.log("... saved css stylesheet.");
    console.log("Done.")
}

async function missingSprites(folderA, folderB){
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

async function main(){
    try{
        const            
            definitionsJSON = "breed-definitions.json",
            breeds = getBreedsTable(),
            json = JSON.stringify(breeds),
            sprites72 = __dirname + '/sprites72/',
            sprites36 = __dirname + '/sprites36/';

        console.log(`${breeds.length} breeds.`);

        const spritesMissing = await missingSprites(sprites72, sprites36);

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
            sizing: { width: 72, height: 96 },
            CSSStep: 36
        });

        // 36 x 48 
        await createResolutionSet({
            locTiles: sprites36,
            locSpriteSheet: "./src/frontend/src/assets/breed-tiles-36x48.png",
            locCSSFile: './src/frontend/src/assets/sprites-36x48.css',
            sizing: { width: 36, height: 48 },
            CSSStep: 36
        });

        // make and save the definition file to frontend and backend
        await Promise.all([
            fs.writeFile('./src/frontend/src/'+definitionsJSON, json, 'utf8'),
            fs.writeFile('./src/backend/'+definitionsJSON, json, 'utf8')
        ]);

        console.log("... copied breed definitions to SPA and Server.");
        console.log("SCRIPT COMPLETE");
    }
    catch(err){
        console.log(err);
    }
}

main();