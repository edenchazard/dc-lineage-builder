const GLOBALS = require('./globals.js');

let utils = {
    getBreedData(breedName){
        return GLOBALS.breeds.entire.find((v) => v.name === breedName) || false;
    },

    countGenerations(root){
        // find the furthest gen back by scanning the tree
        let g = [];
        const depth = function(o, x){
            if('f' in o.parents){
              depth(o.parents.f, x+1);
              depth(o.parents.m, x+1);
            }
            g.push(x);
  
        }
        depth(root, 1);
        return g.reduce((a, b) => Math.max(a, b), 0);
    },

    countDragons(root){
        root;
    }
};

module.exports = utils;