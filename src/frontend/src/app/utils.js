import GLOBALS from "./globals";

function isGender(gender, breed) {
    return breed === false || breed === gender;
}

export function getBreedData(breedName){
    return GLOBALS.breeds.entire.find((v) => v.name === breedName) || false;
}

export function filterBreedTableByGender(breeds, gender){
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
}

export function countGenerations(root){
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
}

export function countDragons(root){
    let count = 0;
    forEveryDragon(root, () => count++);

    return count;
}

export function forEveryDragon(root, func){
    const analyse = (dragon) => {
        func(dragon);
        if('f' in dragon.parents){
            analyse(dragon.parents.f);
            analyse(dragon.parents.m);
        }
    }

    analyse(root);
}
    
// count breeds in the tree recursively
// accepts an array of trees
export function countBreeds(payload){
    let breeds = [];

    const f = (tree) =>{
        forEveryDragon(tree, (dragon) => {
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

    // exclude placeholders
    breeds['Placeholder'] && delete breeds['Placeholder'];
    return breeds;
}

export function isPlaceholder(str){
    return str.toLowerCase() === "placeholder";
}

export function breedInList(list, breedName){
    if(typeof breedName === 'string'){
        return list.indexOf(breedName) > -1;
    }
    else if (typeof breedName === 'object'){
        return list.findIndex(breed => breedName === breed.name > -1);
    }

    throw new Error("not string or object of breeds, type "+typeof breedName);
}

export function addBreed(breedObj){
    const breedTable = GLOBALS.breeds.entire;

    // check stuff
    if(breedObj.name.trim() === ""){
        return false;
    }

    if(breedInList(breedTable, breedObj.name)){
        return false;
    }

    breedTable.push(breedObj);

    // retain our alphabetical sort
    breedTable.sort((breed1, breed2) => breed1.name.localeCompare(breed2.name));

    // update gender tables
    GLOBALS.breeds.males = filterBreedTableByGender(breedTable, 'm');
    GLOBALS.breeds.females = filterBreedTableByGender(breedTable, 'f');
    return true;
}

export function getDCTime() {
    return new Date(new Date().toLocaleString('en-US', { timeZone: "America/New_York" }));
}

export function cloneObj(obj){
    return JSON.parse(JSON.stringify(obj));
}

export function countSelected(tree){
    let count = 0;
    forEveryDragon(tree, async (dragon) => {
        if(dragon.selected){
            count++;
        }
    });

    return count;
}

// These two functions return filter functions for the group and the tags when
// provided a list of acceptable tags
export function filterGroup(enabledGroups){
    return (breed) => {
        const group = breed.metaData.group;
        // Small op: Most breeds are not 
        if(enabledGroups.indexOf(group) > -1)
            return true;

        // A group of "*" is a match all, it should be available
        // no matter the group filter, e.g. placeholder
        if(group === "*")
            return true;

        return false;
    }
}

export function filterTags(enabledTags){
    return (breed) => {
        const tags = breed.metaData.tags;
        // If it's an empty tag list, automatically include the breed
        if(tags.length === 0)
            return true;

        // If the breed has tags, then check against our tag list
        // for at least one tag and include it if so
        for(let tag of tags){
            if(enabledTags.indexOf(tag) > -1)
                return true;
        }
        return false;
    }
}