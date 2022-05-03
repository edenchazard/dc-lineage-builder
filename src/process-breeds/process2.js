const imagesLib = require("images");
const files = require('fs');
const fs = files.promises;

async function getListOfTiles(dir){
    const files = await fs.readdir(dir);
    return files;
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

function makeCSS(tiles, width){
    let
        css = '',
        x = 0; // positioning x-axis

    for(let image of tiles){
        const fileWithoutPNG = image.slice(0, -4);

        css += `.bg-${fileWithoutPNG}{background-position: ${x}px 0px }`;
        x += width;
    }

    return css;
}

async function main(){
    const
        // where to find the sprites
        locTiles = __dirname + '/sprites72/',
        // where to save the finished spritesheet
        locSpriteSheet = "./src/frontend/src/assets/breed-tiles.png",
        // where to save the css file
        locCSSFile = './src/frontend/src/assets/sprites.css',

        tiles = await getListOfTiles(locTiles),
        sizing = { width: 72, height: 96 };

    makeSpriteSheet(tiles, sizing, locTiles)
        .save(locSpriteSheet, { quality: 100 });

    await fs.writeFile(locCSSFile, makeCSS(tiles, sizing.width), 'utf8');
}

main();