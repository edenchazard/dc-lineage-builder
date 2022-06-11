import { uniqueNamesGenerator, names, colors, animals } from 'unique-names-generator';

import GLOBALS from './globals';
import { getBreedData } from './utils';

export function generateCode(){
    const characters = "1234567890ABCDEFGHIJKLMNOPQRTUVWXYZabcdefghijklmnopqrstuvwyz";
    let str = "";
    for(let i = 0; i < 5; ++i){
        str += characters[~~(Math.random() * characters.length)];
    }
    return str;
}

export function generateName(){
    return uniqueNamesGenerator({
        dictionaries: [names, colors, animals],
        length: 2,
        separator: ' ',
        style: 'capital'
    });
}

export function createDragonProperties(changes){
    let defaults = {
        code: generateCode(),
        name: generateName(),
        parents: { },
        breed: GLOBALS.placeholder_breed.name,
        gender: "m",
        display: 1,
        selected: false
    };

    Object.assign(defaults, changes);
    return defaults;
}

export function copyTreeFromComponent(dragon){
    return {
        code: dragon.code,
        gender: dragon.gender,
        breed: dragon.breed,
        name: dragon.name,
        parents: dragon.parents,
        display: dragon.display,
        selected: false
    }
}

export function switchGender(dragon){
    const newGender = (dragon.gender === 'f' ? 'm': 'f');

    const breed = getBreedData(dragon.breed);

    if(breed.genderOnly){
        dragon.breed = GLOBALS.placeholder_breed.name;
    }

    dragon.gender = newGender;
}

export function switchParents(dragon){
    // make a new branch with the parents switched
    const newParents = {
        m: dragon.parents.f,
        f: dragon.parents.m
    };

    switchGender(newParents.m);
    switchGender(newParents.f);

    return newParents;
}