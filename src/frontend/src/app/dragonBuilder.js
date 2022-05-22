import { uniqueNamesGenerator, names, colors, animals } from 'unique-names-generator';
import GLOBALS from './globals';
import utils from './utils';

const { getBreedData } = utils;

const dragonBuilder = {
    generateCode(){
        const characters = "1234567890ABCDEFGHIJKLMNOPQRTUVWXYZabcdefghijklmnopqrstuvwyz";
        let str = "";
        for(let i = 0; i < 5; ++i){
            str += characters[~~(Math.random() * characters.length)];
        }
        return str;
    },

    generateName(){
        return uniqueNamesGenerator({
            dictionaries: [names, colors, animals],
            length: 2,
            separator: ' ',
            style: 'capital'
        });
    },

    createDragonProperties(changes){
        let defaults = {
            code: dragonBuilder.generateCode(),
            name: dragonBuilder.generateName(),
            parents: { },
            breed: GLOBALS.placeholder_breed.name,
            gender: "m",
            display: 1,
            selected: false
        };
    
        Object.assign(defaults, changes);
        return defaults;
    },

    copyTreeFromComponent(dragon){
        return {
            code: dragon.code,
            gender: dragon.gender,
            breed: dragon.breed,
            name: dragon.name,
            parents: dragon.parents,
            display: dragon.display,
            selected: false
        }
    },

    async switchParents(dragon, $store){
        // make a new branch
        const newParents = {
            m: {...dragon.parents.f, gender: 'm'},
            f: {...dragon.parents.m, gender: 'f'}
        };

        // validate breed only requirements for each parent 
        const male = getBreedData(newParents.m.breed);

        // if a genderonly flag is set, it means we must replace the breed
        // with the placeholder
        if(male.genderOnly){
            newParents.m.breed = GLOBALS.placeholder_breed.name;
            // update store to reflect we removed the breed
            await $store.dispatch('removeFromUsedBreeds', dragon.parents.f.breed);
        }

        const female = getBreedData(newParents.f.breed);
        if(female.genderOnly){
            newParents.f.breed = GLOBALS.placeholder_breed.name;
            await $store.dispatch('removeFromUsedBreeds', dragon.parents.m.breed);
        }

        return newParents;
    }
};

export default dragonBuilder;