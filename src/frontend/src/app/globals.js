import breedtable from "@/breed-definitions.json";
import utils from "@/app/utils";

function isNocturneActive(){
    const hours = utils.getDCTime().getHours();
    return hours > 18 || hours <= 6;
}

// In the daytime, nocturnes
// have a different position.
// modify to daytime positioning
if(!isNocturneActive()){
    const
        nocturne = breedtable.findIndex((breed) => breed.name === 'Nocturne'),
        daytimePos = {
            code: 'OrTHo',
            x:0,
            y:-1,
            h:48,
            link: 'https://dragcave.net/image/OrTHo?daytime'
        };

    breedtable[nocturne] = {
        ...breedtable[nocturne],
        female: daytimePos,
        male: daytimePos
    }
}

// add some default metadata
breedtable.forEach((breed, index) => {
    breedtable[index].metaData.ghost = false;
});

// different breed tables for different needs
let GLOBALS ={
    placeholder_breed: {
        name: "Placeholder",
        image: "unknown",
        metaData:{
            category: "dragon",
            ghost: false
        }
    },
    breeds: {
        entire: breedtable,
        males: utils.filterBreedTableByGender(breedtable, 'm'),
        females: utils.filterBreedTableByGender(breedtable, 'f')
    }
}
//console.log(GLOBALS)
// Prevent modification
//Object.freeze(GLOBALS);

export default GLOBALS;