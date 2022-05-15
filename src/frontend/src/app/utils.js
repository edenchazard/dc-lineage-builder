import { GLOBALS } from "@/app/bundle";

const isGender = (gender, breed) => breed === false || breed === gender;

const utils = {
    getBreedData(breedName){
        return GLOBALS.breeds.entire.find((v) => v.name === breedName) || false;
    },

    filterBreedTableByGender(breeds, gender){
        let dragons = [];
        const breedGender = gender === 'm' ? 'male' : 'female';
    
        for(const breed of breeds){
            // if the genderonly attribute is active,
            // it means the breed is male only or female only
            // and will be specified in the value
    
            if(isGender(gender, breed.genderOnly)){
                dragons.push({
                    name: breed.name,
                    image: breed[breedGender],
                    metaData: breed.metaData
                });
            }
        }
    
        return dragons;
    },

    countGenerations(root){
        // find the furthest gen back by scanning the tree
        let max = 1;
        const scan = (o, x) => {
            if('f' in o.parents){
                scan(o.parents.m, x+1);
                scan(o.parents.f, x+1);
            }
            // end of branch
            else if(x > max){
                max = x;
            }
        }
        scan(root, 1);
        return max;
    },

    countDragons(root){
        let count = 0;
        utils.forEveryDragon(root, () => count++);

        return count;
    },

    forEveryDragon(root, func){
        const analyse = (dragon) => {
            func(dragon);
            if('f' in dragon.parents){
                analyse(dragon.parents.f);
                analyse(dragon.parents.m);
            }
        }

        analyse(root);
    },
    
    // count breeds in the tree recursively
    // accepts an array of trees
    countBreeds(payload){
        let breeds = [];

        const f = (tree) =>{
            utils.forEveryDragon(tree, (dragon) => {
                breeds[dragon.breed] = breeds[dragon.breed] + 1 || 1;
            });
        }
        
        if(Array.isArray(payload)){
            for(const i of payload){
                f(i);
            }
        }
        else{
            f(payload);
        }
    
        return breeds;
    },

    isPlaceholder(str){
        return str.toLowerCase() === "placeholder";
    },

    breedInList(list, breedName){
        if(typeof breedName === 'string'){
            return list.indexOf(breedName) > -1;
        }
        else if (typeof breedName === 'object'){
            return list.findIndex(breed => breedName === breed.name > -1);
        }
    
        throw new Error("not string or object of breeds, type "+typeof breedName);
    },

    addBreed(breedObj){
        const breedTable = GLOBALS.breeds.entire;

        // check stuff
        if(breedObj.name.trim() === ""){
            return false;
        }

        if(utils.breedInList(breedTable, breedObj.name)){
            return false;
        }

        breedTable.push(breedObj);

        // retain our alphabetical sort
        breedTable.sort((breed1, breed2) => breed1.name.localeCompare(breed2.name));

        // update gender tables
        GLOBALS.breeds.males = utils.filterBreedTableByGender(breedTable, 'm');
        GLOBALS.breeds.females = utils.filterBreedTableByGender(breedTable, 'f');
        return true;
    },

    getDCTime() {
       return new Date(new Date().toLocaleString('en-US', { timeZone: "America/New_York" }));
    },

    cloneObj(obj){
        return JSON.parse(JSON.stringify(obj));
    }
};

export default utils;