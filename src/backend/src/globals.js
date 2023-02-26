const breedtable = require('./breed-definitions.json');

// different breed tables for different needs
let precompiled_breeds = {};

precompiled_breeds.entire = breedtable;

const placeholder = {
  name: 'Placeholder',
  male: 'aabb',
  female: 'aabb',
  genderOnly: false,
  metaData: {
    category: 'dragon',
    ghost: false,
  },
};

precompiled_breeds.entire.unshift(placeholder);

// different breed tables for different needs
let GLOBALS = {
  placeholder_breed: placeholder,
  breeds: precompiled_breeds,
};

Object.assign(GLOBALS, {
  pool: null,
  default_error: 'Sorry, an error has occurred.',
});

module.exports = GLOBALS;
