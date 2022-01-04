import breedtable from "@/breed-definitions.json";
import utils from "@/app/utils";

// different breed tables for different needs
let GLOBALS ={
    placeholder_breed: {name: "Placeholder", image: "unknown"},
    breeds: {
        entire: breedtable,
        males: utils.filterBreedTableByGender(breedtable, 'm'),
        females: utils.filterBreedTableByGender(breedtable, 'f')
    }
}

// Prevent modification
Object.freeze(GLOBALS);

export default GLOBALS;