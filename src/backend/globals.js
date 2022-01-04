const breedtable = require("./breed-definitions.json");

// different breed tables for different needs
let precompiled_breeds = {};

precompiled_breeds.entire = breedtable;

// this will never change and may enhance perf
Object.freeze(precompiled_breeds); 

let GLOBALS ={
    placeholder_breed: {name: "Placeholder", image: "unknown"},
    breeds: precompiled_breeds
}

Object.assign(GLOBALS, {
    pool: null,
    default_error: "Sorry, an error has occurred."
});

module.exports = GLOBALS;