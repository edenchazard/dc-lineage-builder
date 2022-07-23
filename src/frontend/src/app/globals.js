import breedtable from "../breed-definitions.json";
import { getDCTime, filterBreedTableByGender } from "../app/utils";

function isNocturneActive(){
    const hours = getDCTime().getHours();
    return hours > 18 || hours <= 6;
}

// In the daytime, nocturnes
// have a different position.
// modify to daytime positioning
if(!isNocturneActive()){
    const
        nocturne = breedtable.findIndex((breed) => breed.name === 'Nocturne'),
        daytime = "OrTHo_day";

    breedtable[nocturne] = {
        ...breedtable[nocturne],
        female: daytime,
        male: daytime
    }
}

const placeholder = {
    name: "Placeholder",
    male: "aabb",
    female: "aabb",
    genderOnly: false,
    metaData: {
        category: "dragon",
        src: "local"
    }
};

breedtable.unshift(placeholder);

// different breed tables for different needs
let GLOBALS ={
    placeholder_breed: placeholder,
    breeds: {
        entire: breedtable,
        males: filterBreedTableByGender(breedtable, 'm'),
        females: filterBreedTableByGender(breedtable, 'f')
    }
}

// Prevent modification
//Object.freeze(GLOBALS);

export default GLOBALS;