import GLOBALS from "./globals";
import { BreedEntry, DragonType, FilterTag, Gender, EggGroupTag, PortraitData, PartialLineage } from "./types";

function validGenderForBreed(gender: Gender, breed: BreedEntry): boolean {
    // if the genderonly attribute is not false,
    // it means the breed is male only or female only
    // and will be specified in the value
    return breed.genderOnly === false || breed.genderOnly === gender;
}

export function throwBreedError(name: string){
    throw new Error(`Breed ${name} doesn't exist.`);
}

// returns undefined if breed isn't in the global list
export function getBreedData(breedName: string){
    const entry = GLOBALS.breeds.entire.find((v) => v.name === breedName);

    //if(!entry) throwBreedError(breedName);

    return entry;
}

export function breedEntryToPortrait(breed: BreedEntry, gender: "male" | "female"){
    if(!breed[gender])
        throw new Error(`Gender isn't available for ${breed.name}`);

    const data: PortraitData = {
        name: breed.name,
        image: breed[gender] as string,
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
    return 'f' in dragon.parents && 'm' in dragon.parents;
}
// Returns a list of breed entries filtered by gender
export function filterBreedTableByGender(breeds: BreedEntry[], gender: Gender){
    const expandedGender = expandGender(gender);

    return breeds
        .filter(breed => validGenderForBreed(gender, breed))
        .map(breed => breedEntryToPortrait(breed, expandedGender));
}

export function countGenerations(root: PartialLineage): number {
    // find the furthest gen back by scanning the tree
    let max = 1;
    const scan = (dragon: DragonType, x: number) => {
        if(hasParents(dragon)){
            scan(dragon.parents.m, x+1);
            scan(dragon.parents.f, x+1);
        }
        // end of branch
        else if(x > max) max = x;
    }
    scan(root, 1);
    return max;
}

export function countDragons(root: PartialLineage){
    let count = 0;
    forEveryDragon(root, () => count++);

    return count;
}

export function forEveryDragon(root: PartialLineage, callback: (Dragon: DragonType) => void){
    const analyse = (dragon: DragonType) => {
        callback(dragon);
        if(hasParents(dragon)){
            analyse(dragon.parents.f);
            analyse(dragon.parents.m);
        }
    }

    analyse(root);
}
    
// count breeds in the tree recursively
export function countBreeds(root: PartialLineage){
    const breeds = new Map<string, number>();
    forEveryDragon(root, dragon => breeds.set(dragon.breed, (breeds.get(dragon.breed) ?? 0) + 1));

    // exclude placeholder
    breeds.delete(GLOBALS.placeholder.name);
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

export function addBreed(breedObj: BreedEntry, resort: boolean = true){
    const breedTable = GLOBALS.breeds.entire;

    // Reject empty names
    if(breedObj.name.trim() === "") return false;

    // There's already a breed matching this name
    if(isBreedInList(breedTable, breedObj.name)) return false;

    // TODO: We should add some tests to check metadata etc

    breedTable.push(breedObj);

    if(resort){
        // if required retain our alphabetical sort
        const sort = (breed1: BreedEntry, breed2: BreedEntry) =>
            breed1.name.localeCompare(breed2.name);
        breedTable.sort(sort);
    }
    // update gender tables
    GLOBALS.breeds.males = filterBreedTableByGender(breedTable, 'm');
    GLOBALS.breeds.females = filterBreedTableByGender(breedTable, 'f');
    return true;
}

export function getDCTime() {
    return new Date(new Date().toLocaleString('en-US', { timeZone: "America/New_York" }));
}

export function deepClone<T>(obj: T): T{
    return JSON.parse(JSON.stringify(obj));
}

export function countSelected(root: PartialLineage){
    let count = 0;
    forEveryDragon(root, async (dragon) => {
        if(dragon.selected) count++;
    });

    return count;
}

// These two functions return filter functions for the group and the tags when
// provided a list of acceptable tags
export function filterEggGroups(enabledGroups: EggGroupTag[]){
    return (breed: PortraitData | BreedEntry) => {
        const group = breed.metaData.group;
        // A group of "*" is a match all, it should be available
        // no matter the group filter, e.g. placeholder
        if(group === "*")
            return true;

        // Check at least one tag matches
        if(enabledGroups.indexOf(group) > -1)
            return true;
        return false;
    }
}

export function filterTags(enabledTags: FilterTag[]){
    return (breed: PortraitData | BreedEntry) => {
        const tags = breed.metaData.tags;

        // an empty tag array should return true by default.
        if(tags.length === 0) return true;

        // If the breed has tags, then check against our tag list
        // for at least one tag and include it if so
        return tags.some(t => enabledTags.indexOf(t) >= 0);
    }
}

export function debounce(callback: Function, timeout = 300){
    let timer: ReturnType<typeof setTimeout>;

    return (...args: any) => {
        clearTimeout(timer);
        timer = setTimeout(() => { callback.apply(window, args); }, timeout);
    };
}

export function createLineageLink(hash: string){
    const origin = window.location.origin;
    const mountPath = import.meta.env.VITE_APP_URL;
    return `${origin}${mountPath}view/${hash}`;
}

// Solution from https://stackoverflow.com/a/40774906
export function groupBy<T, K extends keyof T>(arr: Array<T>, key: K){
    const result: {
        [x: string | number | symbol]: Array<T>
    } = arr.reduce((r, a) => {
        r[a[key]] = r[a[key]] || [];
        r[a[key]].push(a);
        return r;
    }, Object.create(null));
    return result;
}

// formats a list of strings and transforms them into a html list for use with
// feedback component
export function makeError(items: string[]){
    const failedHTML = items
        .map(item => `<li>${item}</li>`)
        .join("");
    return `<ul class='feedback-list'>${failedHTML}</ul>`;
}