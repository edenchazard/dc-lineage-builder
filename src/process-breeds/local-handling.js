import { promises as fs } from 'fs';
// import imagesLib from "images";

export function getBreedTable(json) {
    let entries = [];

    const createEntry = function (name, breed, spritedata) {
        let entry = {
            name: name,
            genderOnly: breed.genderOnly,
            metaData: {
                group: breed.group,
                tags: breed.tags,
                src: "local"
            }
        };

        if (breed.dimorphism) {
            entry.male = spritedata[0];
            entry.female = spritedata[1];
        }
        else {
            if (!breed.genderOnly) {
                entry.male = entry.female = spritedata;
            }
            else {
                const gender = breed.genderOnly == 'm' ? 'male' : 'female';
                entry[gender] = spritedata;
            }
        }

        return entry;
    }

    for (let breedname in json) {
        const breed = json[breedname];
        const has_alts = Object.getPrototypeOf(breed.sprites) === Object.prototype;

        if (has_alts) {
            for (let altname in breed.sprites) {
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

async function getTilesInFolder(dir) {
    return fs.readdir(dir);
}

/* // combines multiple tiles into a single spritesheet to be used by CSS
function _makeSpriteSheet(tiles, sizing, dir) {
    const
        { width, height, spacing } = sizing,
        sheetWidth = width * tiles.length;

    const spritesheet = imagesLib(sheetWidth, height);

    let x = 0;

    for (let image of tiles) {
        spritesheet.draw(imagesLib(dir + image), x, 0);
        x += width + spacing;
    }

    return spritesheet;
} */

/*function CSSMods(mods){
    const
        classes = mods.map(mod => '.d-'+mod[0]).join(','),
        css = mods.map(mod => mod[1]()).join();

    return `${classes}{${css}}`;
}*/

/* function _makeCSSSprites(tiles, width, spacing) {
    /*    const mods = [
            ['9IM3', () => "image-rendering: pixelated"]
        ];
    
let
    css = '',
    x = 0; // positioning x-axis

for (let image of tiles) {
    const fileWithoutPNG = image.slice(0, -4);

    css += `.d-${fileWithoutPNG}{background-position-x:${x}px}`;
    x -= width - spacing;
}

//css += CSSMods(mods);
return css;
} */

async function makeCSS(tiles, locTiles) {
    const base64 = await Promise.all(tiles.map(async (tile) => {
        const code = tile.slice(0, -4);
        return { code, base64: await fs.readFile(locTiles + tile, { encoding: 'base64' }) };
    }));

    const stylesheet = base64.map(tile => {
        return `.d-${tile.code}{background:url('data:image/png;base64,${tile.base64}')}`;
    }).join('');

    // console.log(stylesheet)
    return stylesheet;
}

export async function saveResolutionStylesheet({ locTiles, locCSSFile, sizing }) {
    const
        tiles = await getTilesInFolder(locTiles),
        { width, height } = sizing;

    console.log(`Creating with sizes: ${width}w x ${height}h.`);
    console.log(`Found ${tiles.length} sprites in folder ${locTiles}`);
    const stylesheet = await makeCSS(tiles, locTiles);

    await fs.writeFile(locCSSFile, stylesheet, 'utf8');
    console.log("... saved css stylesheet.");
    console.log("Done.")
}

/* export async function _createResolutionSet({ CSSStep, locTiles, locSpriteSheet, locCSSFile, sizing }) {
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
    css += `.local{background-image: url(./breed-tiles-${width}x${height}.png);}`;

    await fs.writeFile(locCSSFile, css, 'utf8');
    console.log("... saved css stylesheet.");
    console.log("Done.")
} */

export async function missingSprites(folderList) {
    const folders = await Promise.all(folderList.map(async folder => ({
        files: await getTilesInFolder(folder),
        location: folder,
        missing: []
    })));

    // get a unique set of filenames
    let files = [];
    folders.forEach(folder => files = files.concat(folder.files));
    const uniqueFiles = new Set(files);

    // examine each file list from each folder and test if
    // it contains each code
    uniqueFiles.forEach(code => {
        folders.forEach(folder => {
            if (folder.files.indexOf(code) === -1) {
                folder.missing.push(code)
            }
        })
    });

    console.log("Examining folders for missing sprites.");

    let fail = false;
    folders.forEach(folder => {
        if (folder.missing.length > 0) {
            console.log(`Missing sprites in ${folder.location}:`);
            console.log(folder.missing.join(', '));
            fail = true;
        }
    });

    return fail;
}