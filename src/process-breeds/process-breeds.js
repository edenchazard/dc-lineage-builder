
/*
    this is a script to be run every time a new breed is added
    only available in development.
    It creates a developer-friendly json file with processed breed
    definitions
*/
const files = require('fs');
const fs = files.promises;
const local_breeds = require('./local-breeds.js');
const fallback_breeds =  require('./fallback-breeds.js');

function entireBreedTable_FromLocals(){
    let entries = [];

    const createEntry = function(name, breed, spritedata){
        let entry = {
            name: name,
            genderOnly: breed.genderOnly,
            category: breed.category
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

    let createEntry = (sprite, name, genderOnly, category) => {
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
        entry.category = category;
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
                let entry = createEntry(spritedata[alt], name + " " + alt, fallback_breeds[breed].genderOnly, fallback_breeds[breed].category);
                breeds.push(entry);
            }
        }
        else {
            let entry = createEntry(spritedata, name, fallback_breeds[breed].genderOnly, fallback_breeds[breed].category);
            breeds.push(entry);
        }
    }

    return breeds;
}

async function processJSON(fileName){
    try{
        let table = entireBreedTable_FromFallbacks().concat(entireBreedTable_FromLocals());
        table.sort((a, b) => a.name.localeCompare(b.name));

        const json = JSON.stringify(table);

        console.log('done processing breeds, new json created.');

        // copy
        await Promise.all([
            fs.writeFile('./src/frontend/src/'+fileName, json, 'utf8'),
            fs.writeFile('./src/backend/'+fileName, json, 'utf8')
        ]);

        console.log('... copied JSON to SPA and Server.');
    }
    catch(err){
        console.log(err, "... ERROR processing JSON files.");
    }
}

// sprite generator: https://www.toptal.com/developers/css/sprite-generator/
async function processCSS(src, output){
    try{
        let data = await fs.readFile(src, {encoding: 'utf8'});
        // do replacements
        data = data
                .replace(/\nx/gm, '')
                .replace(/    width: 36px; height: 48px;/g, '')
                .replace(/url\('css_sprites.png'\) /g, '')
                .replace(/background/g, 'background-position')
                .replace(/\{(\r\n|\n|\r)/gm, '{');
                //.replace(/(\r\n|\n|\r)/gm, '');
        await fs.writeFile('./src/frontend/src/assets/'+output, data, 'utf8');

        console.log("... processed CSS file.");
    }
    catch(err){
        console.log(err, "... ERROR processing CSS file.");
    }
}

async function copyTiles(src){
    try{
        const target = `./src/frontend/src/assets/breed-tiles.png`;
        await fs.copyFile(src, target);
        console.log("... copied tiles png to frontend.");
    }
    catch(err){
        console.log(err, "... ERROR copying tiles png.");
    }
}

// process everything
(function(){
    processJSON("breed-definitions.json");
    processCSS("./src/process-breeds/breeds.txt", "sprites.css");
    copyTiles("./src/process-breeds/tiles.png");
})();

