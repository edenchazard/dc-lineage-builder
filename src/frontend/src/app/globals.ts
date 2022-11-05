import breeds from "../breed-definitions.json";
import { getDCTime, filterBreedTableByGender } from "./utils";
import { BreedEntry } from "./types";

const breedTable = breeds as BreedEntry[];

function isNocturneActive(){
    const hours = getDCTime().getHours();
    return hours > 18 || hours <= 6;
}

// In the daytime, nocturnes
// have a different position.
// modify to daytime positioning
if(isNocturneActive()){
    const
        nocturne = breedTable.findIndex((breed) => breed.name === 'Nocturne'),
        daytime = "OrTHo_day";
    if(nocturne !== -1){
        breedTable[nocturne] = {
            ...breedTable[nocturne],
            female: daytime,
            male: daytime
        }
    }
}

const placeholder: BreedEntry = {
    name: "Placeholder",
    male: "aabb",
    female: "aabb",
    genderOnly: false,
    metaData: {
        group: "*",
        src: "local",
        tags: []
    }
};

breedTable.unshift(placeholder);

// different breed tables for different needs
const GLOBALS ={
    placeholder,
    breeds: {
        entire: breedTable,
        males: filterBreedTableByGender(breedTable, 'm'),
        females: filterBreedTableByGender(breedTable, 'f')
    }
}

// Prevent modification
//Object.freeze(GLOBALS);

export default GLOBALS;