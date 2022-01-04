import { uniqueNamesGenerator, names, colors, animals } from 'unique-names-generator';
import GLOBALS from './globals';

const dragonBuilder = {
    generateCode(){
        const characters = "1234567890ABCDEFGHIJKLMNOPQRTUVWXYZabcdefghijklmnopqrstuvwyz";
    
        let arr = [];
        for(let i = 0; i < 5; ++i){
            arr.push(characters[Math.floor(Math.random() * characters.length)]);
        }
    
        return arr.join("");
    },

    generateName(){
        return uniqueNamesGenerator({
            dictionaries: [names, colors, animals],
            length: 2,
            separator: ' '
        });
    },

    createDragonProperties(changes){
        let defaults = {
            code: dragonBuilder.generateCode(),
            name: dragonBuilder.generateName(),
            parents: { },
            breed: GLOBALS.placeholder_breed.name,
            gender: "m",
            display: 1
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
            display: dragon.display
        }
    }
};

export default dragonBuilder;