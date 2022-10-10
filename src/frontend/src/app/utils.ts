import GLOBALS from "./globals";
import { BreedEntry, DragonType, Gender, LineageRoot, PortraitData, Tag } from "./types";

function validGenderForBreed(gender: Gender, breed: BreedEntry): boolean {
    // if the genderonly attribute is not false,
    // it means the breed is male only or female only
    // and will be specified in the value
    return breed.genderOnly === false || breed.genderOnly === gender;
}

export function throwBreedError(name: string){
    throw new Error(`Breed ${name} doesn't exist.`);
}

export function getBreedData(breedName: string){
    const entry = GLOBALS.breeds.entire.find((v) => v.name === breedName);

    if(!entry) throwBreedError(breedName);

    return entry;
}

export function breedEntryToPortrait(breed: BreedEntry, gender: "male" | "female"){
    if(!breed[gender])
        throw new Error(`Gender isn't available for ${breed.name}`);

    const data: PortraitData = {
        name: breed.name,
        image: breed[gender],
        metaData: breed.metaData
    };

    return data;
}

// Expands m or f to male/female
export function expandGender(gender: Gender){
    return gender === 'm' ? 'male' : 'female';
}

export function portraitToBreedEntry(data: PortraitData){
    return getBreedData(data.name);
}

export function getTable(gender: Gender): PortraitData[]{
    return gender === 'm' ? GLOBALS.breeds.males : GLOBALS.breeds.females
}

export function hasParents(dragon: DragonType){
    return dragon.parents !== null;
}
// Returns a list of breed entries filtered by gender
export function filterBreedTableByGender(breeds: BreedEntry[], gender: Gender){
    const expandedGender = expandGender(gender);

    return breeds
        .filter(breed => validGenderForBreed(gender, breed))
        .map(breed => breedEntryToPortrait(breed, expandedGender));
}

export function countGenerations(root: LineageRoot): number {
    // find the furthest gen back by scanning the tree
    let max = 1;
    const scan = (dragon: DragonType, x: number) => {
        if(hasParents(dragon)){
            scan(dragon.parents!.m, x+1);
            scan(dragon.parents!.f, x+1);
        }
        // end of branch
        else if(x > max) max = x;
    }
    scan(root, 1);
    return max;
}

export function countDragons(root: LineageRoot){
    let count = 0;
    forEveryDragon(root, () => count++);

    return count;
}

export function forEveryDragon(root: LineageRoot, func: (Dragon: DragonType) => void){
    const analyse = (dragon: DragonType) => {
        func(dragon);
        if(hasParents(dragon)){
            analyse(dragon.parents!.f);
            analyse(dragon.parents!.m);
        }
    }

    analyse(root);
}
    
// count breeds in the tree recursively
export function countBreeds(root: LineageRoot /*| LineageRoot[]*/){
    const breeds: { [key: string]: number }[] = [];

    //const f = (tree: LineageRoot) =>{
    forEveryDragon(root, (dragon) => {
        breeds[dragon.breed] = breeds[dragon.breed] + 1 || 1;
    });
    //}
    
    /*if(Array.isArray(payload)){
        for(const i of payload){
            f(i);
        }
    }
    else f(payload);*/

    // exclude placeholder
    breeds['Placeholder'] && delete breeds['Placeholder'];
    return breeds;
}

export function isPlaceholder(str: string){
    return str.toLowerCase() === "placeholder";
}

export function isBreedInList(list: BreedEntry[], breedName: string){
    //if(typeof breedName === 'string'){
        return list.findIndex(breed => breed.name === breedName) > -1;
    //}
    /*else if (typeof breedName === 'object'){
        placeholder.log('r');
        return list.findIndex(breed => breed.name === breedName) > -1;
    }*/
    //throw new Error("not string or object of breeds, type "+typeof breedName);
}

export function addBreed(breedObj: BreedEntry){
    const breedTable = GLOBALS.breeds.entire;

    // Reject empty names
    if(breedObj.name.trim() === "") return false;

    // There's already a breed matching this name
    if(isBreedInList(breedTable, breedObj.name)) return false;

    // TODO: We should add some tests to check metadata etc

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

export function deepClone(obj: Object){
    return JSON.parse(JSON.stringify(obj));
}

export function countSelected(root: LineageRoot){
    let count = 0;
    forEveryDragon(root, async (dragon) => {
        if(dragon.selected) count++;
    });

    return count;
}

// These two functions return filter functions for the group and the tags when
// provided a list of acceptable tags
export function filterGroup(enabledGroups: string[]){
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

export function filterTags(enabledTags: string[]){
    return (breed: BreedEntry) => {
        const tags = breed.metaData.tags;
        // If it's an empty tag list, automatically include the breed
        if(tags.length === 0) return true;

        // If the breed has tags, then check against our tag list
        // for at least one tag and include it if so
        return tags.some(t => enabledTags.indexOf(t) >= 0);
    }
}

export function debounce(func: Function, timeout = 300){
    let timer: NodeJS.Timeout;

    return (...args: any) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(window, args); }, timeout);
    };
}