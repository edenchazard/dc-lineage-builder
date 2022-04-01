import { uniqueNamesGenerator, names, colors, animals } from 'unique-names-generator';
import GLOBALS from './globals';

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
            display: 1
        };
    
        Object.assign(defaults, changes);
        return defaults;
    },

    copyTreeFromComponent(dragon){
        return { ...dragon }
    }
};

export default dragonBuilder;