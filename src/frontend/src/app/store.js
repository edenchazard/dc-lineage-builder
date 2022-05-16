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

        addToUsedBreeds({commit, state}, breedNameOrObj, quantity){
            return new Promise((resolve, reject) => {
                const type = typeof breedNameOrObj;

                if(type === 'string'){
                    // a single breed name
                    const breedName = breedNameOrObj;
                    const amount = quantity || 1; //default 1
                    // ignore placeholder
                    commit('addBreed', {breedName, amount});
                    resolve();
                }
                else if(type === 'object'){
                    // merging (e.g. from pasting)
                    const breedsToAdd = breedNameOrObj;
                    if(Object.keys(state.stats.usedBreeds).length === 0){
                        commit('setUsedBreeds', breedsToAdd);
                        resolve();
                    }
                    else{
                        // merge existing keys with new keys and values
                        for(const breedName in breedsToAdd){
                            const amount = breedsToAdd[breedName];
                            commit('addBreed', {breedName, amount});
                        }
                        resolve();
                    }
                }
                else{
                    reject(new Error("used breeds - wrong type"));
                }
            });
        },

        removeFromUsedBreeds({commit}, breedNameOrObj, quantity){
            return new Promise((resolve, reject) => {
                const type = typeof breedNameOrObj;

                if(type === 'string'){
                    const breedName = breedNameOrObj;
                    const amount = quantity || 1; //default 1
                    commit('removeBreed', {breedName, amount});
                    resolve();
                }
                else if(type === 'object'){
                    const breedsToRemove = breedNameOrObj;

                    // do a removal for each breed in array
                    for(const breedName in breedsToRemove){
                        const amount = breedsToRemove[breedName];
                        commit('removeBreed', {breedName, amount});
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

        upSelectionCount(state, count = 1){
            state.selectionCount+= count;
        },

        downSelectionCount(state, count = 1){
            state.selectionCount-= count;
        },

        setUsedBreeds(state, breeds){
            const a = Date.now();
            state.stats.usedBreeds = breeds;
            console.log(Date.now() - a, 'time')
        },

        addBreed(state, { breedName, amount }){
            if(utils.isPlaceholder(breedName)){
                return;
            }

            amount = amount || 1;
            
            const instancesOfBreed = state.stats.usedBreeds[breedName] || 0;
            state.stats.usedBreeds[breedName] = instancesOfBreed + amount;
        },

        removeBreed(state, { breedName, amount }){
            if(utils.isPlaceholder(breedName)){
                return;
            }

            amount = amount || 1;
        
            // if the breed doesn't exist in our stats, default to 0
            const instancesOfBreed = state.stats.usedBreeds[breedName] || 0;
            if(instancesOfBreed - amount === 0){
                delete state.stats.usedBreeds[breedName];
            }
            else{
                state.stats.usedBreeds[breedName] = (instancesOfBreed - amount);
            }
        }
    }
});

export {
    store,
    Vuex
};