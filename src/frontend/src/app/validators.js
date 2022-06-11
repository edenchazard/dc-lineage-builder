import { breedInList, countGenerations } from "./utils";
import GLOBALS from "./globals";

// returns a list of ghost breed names
const findGhosts = () => {
    return GLOBALS.breeds.entire
        .filter(breed => breed.metaData.ghost === true)
        .map(breed => breed.name);
}

function fitsBreed(obj) {
    const breed = GLOBALS.breeds.entire.find((v) => v.name === obj.breed);

    // breed doesn't exist
    if(!breed) {
        return false;
    }
    // dragon's gender doesn't match the available genders
    // for this breed
    else if(breed.genderOnly){
        return obj.gender === breed.genderOnly;
    }
    return true;
}

function validateName(str){
    return !str.endsWith(' ') && !str.startsWith(' ') && /^[a-zA-Z0-9 '-]{0,32}$/.test(str);
}

function validateCode(str){
    return /^[a-zA-Z0-9]{4,5}$/.test(str);
}

function display(value){
    return value == 0 || value == 1;
}

function gender(value){
    return value === 'm' || value === 'f';
}

function hasEmptyParents(parentsObj){
    return Object.getOwnPropertyNames(parentsObj).length === 0;
}

function hasBothParents(parentsObj){
    if(Object.getOwnPropertyNames(parentsObj).length === 2){
        if('f' in parentsObj && 'm' in parentsObj){
            //check the dragon objects for each parent actually match
            return parentsObj.m.gender === 'm' && parentsObj.f.gender === 'f';
        }
    }
    return false;
}

function hasAllKeys(obj){
    let pass = true;
    const keys = ['parents', 'name', 'code', 'display', 'gender', 'breed'];
    if(Object.getOwnPropertyNames(obj).length !== keys.length){
        return false;
    }
    keys.forEach((v) => {
        if(obj[v] == undefined){
            pass = false;
        }
    });
    return pass;
}

function isLineageHash(str){
    return /^[a-z0-9]{40}$/.test(str);
}

//assumes verify integrity has been run first.
function meetsSaveRequirements(obj){
    // fetch ghosties
    const ghosts = findGhosts();
    
    // our requirements are no placeholders in the lineage and
    // between 1 and 9 generations
    const gens = countGenerations(obj);
    if(gens === 1 || gens > 12){
        return false;
    }

    let pass = true;
    const analyseDragon = (dragon) => {
        if(!pass){  // check failed, don't even bother
            return;
        }
        /*if(dragon.breed == GLOBALS.placeholder_breed.name){
            pass = false;
        }*/
        // reject ghosties
        if(breedInList(ghosts, dragon.breed)){
            pass = false;
        }
        if(hasBothParents(dragon.parents)){
            analyseDragon(dragon.parents.m);
            analyseDragon(dragon.parents.f);
        }
    };

    analyseDragon(obj);
    return pass;
}

function verifyIntegrity(root){
    let pass = true;

    // this operates on a fail first sequence. we check the pass
    // variable every phase and if it's false,
    // it means we failed a check somewhere and should stop
    // checking.
    const analyseDragon = (obj) => {
        if(!pass){ // integrity check failed, don't even bother
            return;
        }

        // fail first if not all the keys are present
        if(!hasAllKeys(obj)){
            pass = false;
            return;
        }
        let tests ={
            name: validateName(obj.name),
            code: validateCode(obj.code),
            display: display(obj.display),
            gender: gender(obj.gender),
            breed: fitsBreed(obj)
        };

        for(let test in tests){
            if(!tests[test]){
                pass = false;
                return;
            }
        }
        
        // if tests have passed up to this point, we validate the parents
        if(pass){
            tests.emptyParents = hasEmptyParents(obj.parents);
            tests.bothParents = hasBothParents(obj.parents);
            
            if(tests.emptyParents){
                pass = true;
            }
            else if(tests.bothParents){
                pass = true;
                // this particular dragon has passed the test.
                // but we still need to check any parent nodes.
                analyseDragon(obj.parents.m);
                analyseDragon(obj.parents.f);
            }
            else{
                pass = false;
            }
        }
    };

    analyseDragon(root);
    return pass;
}

export {
    validateCode,
    validateName,
    meetsSaveRequirements,
    isLineageHash,
    verifyIntegrity
}