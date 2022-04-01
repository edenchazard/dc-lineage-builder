import breedtable from "@/breed-definitions.json";
import utils from "@/app/utils";

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