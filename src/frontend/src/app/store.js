import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const SESSION_KEY = 'session';

// returns tags in session if set, or defaults
function getTags(){
    const
        availableTags = ['Valentine', 'Christmas', 'Halloween', 'Hybrid',
                        'CB'],
        defaultTags = availableTags.map(tag => ({ name: tag, active: true }));

    const session = sessionStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : defaultTags;
}

const store = new Vuex.Store({
    state: {
        tags: getTags(),
        stats:{
            usedBreeds: []
        },
        lastID: 0,
        selectionCount: 0
    },

    getters: {
        // save the enabled tags for duration of session
        enabledTags: state => state.tags
            .filter(tag => tag.active)
            .map(tag => tag.name)
    },

    actions:{
        setUsedBreeds({commit}, arr){
            return new Promise((resolve) =>{
                commit('setUsedBreeds', arr);
                resolve();
            });
        }
    },

    mutations: {
        setSelectionCount(state, to = 0){
            state.selectionCount = to;
        },

        setUsedBreeds(state, breeds){
            state.stats.usedBreeds = breeds;
        },

        setTags(state, tags){
            state.tags = tags;
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(tags));
        }
    }
});

export {
    store,
    Vuex
};