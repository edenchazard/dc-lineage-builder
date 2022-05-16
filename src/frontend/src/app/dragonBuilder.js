import { uniqueNamesGenerator, names, colors, animals } from 'unique-names-generator';
import GLOBALS from './globals';
/*
const builder = {
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

    createDragonProperties(overrides){
        return {
            code: this.generateCode(),
            name: this.generateName(),
            parents: { },
            breed: GLOBALS.placeholder_breed.name,
            gender: "m",
            display: 1,
            selected: false,
            ...overrides
        };
    }
};

function Dragon(dragon, storeDispatchFunction){
    const dispatch = function(key, value){
        if(!storeDispatchFunction){
            return;
        }

        return storeDispatchFunction(key, value)
    }

    // an empty dragon object, return an object for creating
    // things
    if(!dragon){
        return builder;
    }
    
    return {
        switchParents(){
    
        },

        switchGender(){

        },

        changeBreed(){

        },
    
        isPlaceholder(){
            return dragon.breed.toLowerCase() === "placeholder";
        }
    }
}

Dragon;*/
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
    }
};

export default dragonBuilder;