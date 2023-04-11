import { promises as fs } from 'fs';
import { setTimeout } from 'timers/promises';
import puppeteer from 'puppeteer';
import { chromiumSettings } from './files.js';

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
                const fullName = altname === '__regular__' ? breedname : breedname + " " + altname;
                let entry = createEntry(fullName, breed, altdata);
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

async function getTileFullPaths(dir) {
    return (await fs.readdir(dir)).map(file => dir + file);
}

async function getIgnoredBreeds(ignoreFile) {
    const content = (await fs.readFile(ignoreFile, { encoding: 'utf8' })).trim();
    return content.replace(/\r\n/g, '\n').split('\n');
}

export async function checkCache(
    json,
    cache,
    browserSettings,
    ignoreFile = null) {
    // get a list of codes we want to check our specified cache for
    // while ignoring any on our ignore file
    const getCodes = (breeds, ignoreList) => {
        const codes = new Set();

        breeds.forEach(breed => {
            if (breed.male !== undefined) {
                codes.add(breed.male);
            }
            if (breed.female !== undefined) {
                codes.add(breed.female);
            }
        });

        // return only the codes not in our ignore list
        return [...codes].filter(code => !ignoreList.includes(code));
    }

    const browser = await puppeteer.launch(chromiumSettings);

    console.log(`Checking cache for: ${cache.path}`);

    // remove ignored images
    const ignored = ignoreFile !== null ? await getIgnoredBreeds(ignoreFile) : [];
    console.log(`... IGNORING: ${ignored.join(', ')}`);

    const codes = getCodes(getBreedTable(json), ignored);

    let throttle = 0;
    await Promise.all(codes.map(async (code) => {
        const path = `${cache.path}${code}.png`;

        // check cache. if we don't have the image, we'll redownload it.
        try {
            // If this doesn't throw an exception, it means the file exists
            // in this cache, so we won't download it.
            await fs.access(path, fs.constants.R_OK);
        }
        catch (e) {
            // doesn't exist in cache, download it.
            // we don't want to ddos DC, so we'll throttle our requests to 1/second.
            throttle++;
            await setTimeout(throttle * 1000);
            await cache.downloadPortrait(code, browser, browserSettings);
        }
    }));

    browser.close();
    console.log(`... Cache ${cache.path} OK.`);
}


// Takes a list of *full* file paths to tiles and combines them into a single
// css file with base64 data
async function makeCSS(tilePaths) {
    const base64 = await Promise.all(tilePaths.map(async (tile) => {
        // we just want the code, so we have to parse it from the filepath
        // and exclude the extension
        const code = tile.slice(tile.lastIndexOf('/') + 1, -4);
        return { code, base64: await fs.readFile(tile, { encoding: 'base64' }) };
    }));

    const stylesheet = base64.map(tile => {
        return `.d-${tile.code}{background:url('data:image/png;base64,${tile.base64}')}`;
    }).join('');

    // console.log(stylesheet)
    return stylesheet;
}

// if we want to 'inject' additional tiles outside of the cache,
// for example our placeholders, we can use the inject folder.
export async function saveResolutionStylesheet({
    locTiles,
    locCSSFile,
    sizing,
    injectFolder = null }) {
    const { width, height } = sizing;
    const tiles = await getTileFullPaths(locTiles);
    const injectedTiles = (injectFolder !== null ? (await getTileFullPaths(injectFolder)) : []);

    console.log(`Creating stylesheet with sizes: ${width}w x ${height}h.`);
    console.log(`... Found ${tiles.length} sprites in folder ${locTiles}`);

    if (injectFolder !== null) {
        console.log(`... Found ${injectedTiles.length} injected sprites in folder ${injectFolder}`)
    }

    const stylesheet = await makeCSS([...tiles, ...injectedTiles]);

    await fs.writeFile(locCSSFile, stylesheet, 'utf8');
    console.log(`... Saved css stylesheet to ${locCSSFile}`);
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
/*
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
}*/
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