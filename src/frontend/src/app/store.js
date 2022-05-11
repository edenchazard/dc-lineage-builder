import Vue from 'vue';
import Vuex from 'vuex';
import utils from "@/app/utils";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        stats:{
            usedBreeds: []
        },
        lastID: 0,
        selectionCount: 0
    },

    actions:{
        setUsedBreeds({commit}, arr){
            return new Promise((resolve) =>{
                commit('setUsedBreeds', arr);
                resolve();
            });
        },

        addToUsedBreeds({commit, state}, b){
            return new Promise((resolve, reject) => {
                const type = typeof b;

                if(type === 'string'){
                    // a single breed name
                    const name = b;
                    // ignore placeholder
                    commit('addBreed', {name});
                    resolve();
                }
                else if(type === 'object'){
                    // merging (e.g. from pasting)
                    const breedsToAdd = b;
                    if(Object.keys(state.stats.usedBreeds).length === 0){
                        commit('setUsedBreeds', breedsToAdd);
                        resolve();
                    }
                    else{
                        // merge existing keys with new keys and values
                        for(const name in breedsToAdd){
                            const amount = breedsToAdd[name];
                            commit('addBreed', {name, amount});
                        }
                        resolve();
                    }
                }
                else{
                    reject(new Error("used breeds - wrong type"));
                }
            });
        },

        removeFromUsedBreeds({commit}, b){
            return new Promise((resolve, reject) => {
                const type = typeof b;
                if(type === 'string'){
                    // a single breed
                    const name = b;
                    commit('removeBreed', {name});
                    resolve();
                }
                else if(type === 'object'){
                    const breedsToRemove = b;

                    // do a removal for each breed in array
                    for(const name in breedsToRemove){
                        const amount = breedsToRemove[name];
                        commit('removeBreed', {name, amount});
                    }
                    resolve();
                }
                else{
                    reject(new Error("used breeds - wrong type"));
                }
            });
        }
    },

    mutations: {
        resetSelectionCount(state){
            state.selectionCount = 0;
        },

        upSelectionCount(state){
            state.selectionCount++;
        },

        downSelectionCount(state){
            state.selectionCount--;
        },
    
        acquireID(state){
            return state.lastID++;
        },

        setUsedBreeds(state, breeds){
            state.stats.usedBreeds = breeds;
        },

        addBreed(state, { name, amount }){
            if(utils.isPlaceholder(name)){
                return;
            }
            if(!amount){
                amount = 1;
            }
            
            const instancesOfBreed = state.stats.usedBreeds[name] || 0;
            state.stats.usedBreeds[name] = instancesOfBreed + amount;
        },

        removeBreed(state, { name, amount }){
            if(utils.isPlaceholder(name)){
                return;
            }

            if(!amount){
                amount = 1;
            }
        
            // if the breed doesn't exist in our stats, default to 0
            const instancesOfBreed = state.stats.usedBreeds[name] || 0;
            if(instancesOfBreed - amount === 0){
                delete state.stats.usedBreeds[name];
            }
            else{
                state.stats.usedBreeds[name] = (instancesOfBreed - amount);
            }
        }
        /*addToUsedBreeds(state, breed){
            let recent = state.recentlyUsedBreeds;
            // create a 'queuing' effect by removing earlier instances
            // of this breed and adding it to the front of the queue (most recent)
            recent = recent.filter(rBreed => rBreed.name !== breed.name);
            recent.unshift(breed);
            if(recent.length > 4){
                recent.pop();
            }

            state.recentlyUsedBreeds = recent;
        }*/
    }
});

export {
    store,
    Vuex
};