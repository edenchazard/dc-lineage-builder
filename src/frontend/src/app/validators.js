import utils from "./utils";
import GLOBALS from "./globals";

const validators ={
    fitsBreed(obj) {
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
    },
    name(str){
        return !str.endsWith(' ') && !str.startsWith(' ') && /^[a-zA-Z0-9 '-]{0,32}$/.test(str);
    },
    code(str){
        return /^[a-zA-Z0-9]{4,5}$/.test(str);
    },
    display(value){
        return value == 0 || value == 1;
    },
    gender(value){
        return value === 'm' || value === 'f';
    },
    hasEmptyParents(parentsObj){
       return Object.getOwnPropertyNames(parentsObj).length === 0;
    },
    hasBothParents(parentsObj){
        if(Object.getOwnPropertyNames(parentsObj).length === 2){
            if('f' in parentsObj && 'm' in parentsObj){
                //check the dragon objects for each parent actually match
                return parentsObj.m.gender === 'm' && parentsObj.f.gender === 'f';
            }
        }
        return false;
    },
    hasAllKeys(obj){
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
    },
    isLineageHash(str){
        return /^[a-z0-9]{40}$/.test(str);
    },

    //assumes verify integrity has been run first.
    meetsSaveRequirements(obj){
        // fetch ghosties
        const ghosts = GLOBALS.breeds.entire
            .filter(breed => breed.metaData.ghost === true)
            .map(breed => breed.name);
        
        // our requirements are no placeholders in the lineage and
        // between 1 and 9 generations
        const gens = utils.countGenerations(obj);
        if(gens === 1 || gens > 9){
            return false;
        }

        let pass = true;
        const analyseDragon = (dragon) => {
            if(!pass){  // check failed, don't even bother
                return;
            }
            if(dragon.breed == GLOBALS.placeholder_breed.name){
                pass = false;
            }
            // reject ghosties
            if(ghosts.indexOf(dragon.breed) > -1){
                pass = false;
            }
            if(validators.hasBothParents(dragon.parents)){
                analyseDragon(dragon.parents.m);
                analyseDragon(dragon.parents.f);
            }
        };

        analyseDragon(obj);
        return pass;
    },
    verifyIntegrity(root){
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
            if(!validators.hasAllKeys(obj)){
                pass = false;
                return;
            }
            let tests ={
                name: validators.name(obj.name),
                code: validators.code(obj.code),
                display: validators.display(obj.display),
                gender: validators.gender(obj.gender),
                breed: validators.fitsBreed(obj)
            };

            for(let test in tests){
                if(!tests[test]){
                    pass = false;
                    return;
                }
            }
            
            // if tests have passed up to this point, we validate the parents
            if(pass){
                tests.emptyParents = validators.hasEmptyParents(obj.parents);
                tests.bothParents = validators.hasBothParents(obj.parents);
                
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
}
export default validators;