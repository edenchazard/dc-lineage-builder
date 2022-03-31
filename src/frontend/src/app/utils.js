import { GLOBALS } from "@/app/bundle";

const Utils = {
    getBreedData(breedName){
        return GLOBALS.breeds.entire.find((v) => v.name === breedName) || false;
    },

    filterBreedTableByGender(breeds, gender){
        let dragons = [];
        const g = gender === 'm' ? 'male' : 'female';
    
        for(const breed of breeds){
            // if the genderonly attribute is active,
            // it means the breed is male only or female only
            // and will be specified in the value
    
            if(breed.genderOnly === false || breed.genderOnly === gender){
                dragons.push({
                    name: breed.name,
                    image: breed[g],
                    metaData: breed.metaData
                });
            }
        }
    
        return dragons;
    },

    countGenerations(root){
        // find the furthest gen back by scanning the tree
        let g = [];
        const depth = (o, x) => {
            if('f' in o.parents){
                depth(o.parents.m, x+1);
                depth(o.parents.f, x+1);
            }
            // end of branch
            else{
                g.push(x);
            }
        }
        depth(root, 1);
        return g.reduce((a, b) => Math.max(a, b), 0) || 1;
    },

    countDragons(root){
        let count = 0;
        this.forEveryDragon(root, () =>{
            count++;
        });

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
            this.forEveryDragon(tree, (dragon) => {
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

    addBreed(breedObj){
        const breedTable = GLOBALS.breeds.entire;

        // check name is unique
        if(breedTable.findIndex(breed => breed.name === breedObj.name) > -1){
            return false;
        }

        breedTable.push(breedObj);

        // retain our alphabetical sort
        breedTable.sort((breed1, breed2) => breed1.name.localeCompare(breed2.name));

        // update gender tables
        GLOBALS.breeds.males = Utils.filterBreedTableByGender(breedTable, 'm');
        GLOBALS.breeds.females = Utils.filterBreedTableByGender(breedTable, 'f');
        return true;
    }
    /*mergeBreedCounts(arr){
        let breeds = [];
        for(const obj of arr){
            for(const name in obj){
                breeds[name] = breeds[name] + obj[name] || obj[name];
            }
        }
        return breeds;
    }*/
};

export default Utils;