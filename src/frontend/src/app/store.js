import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const SESSION_TAGS = {
    key: 'session-tags',
    tags: ['Valentine', 'Christmas', 'Halloween', 'Hybrid', 'CB']
}

const SESSION_GROUPS = {
    key: "session-groups",
    tags: ["Standard", "Drake", "Pygmy", "Two-headed", "Other"]
}

// returns tags in session if set, or defaults
function loadTags(session){
    const defaultTags = session.tags.map(tag => ({ name: tag, active: true }));
    return JSON.parse(sessionStorage.getItem(session.key)) ?? defaultTags;
}

function saveTagsToStorage(key, newValue){
    sessionStorage.setItem(key, JSON.stringify(newValue));
}

function getTagsFromState(stateTags){
    return stateTags.filter(tag => tag.active).map(tag => tag.name);
}

const store = new Vuex.Store({
    state: {
        tags: loadTags(SESSION_TAGS),
        groups: loadTags(SESSION_GROUPS),
        stats:{
            usedBreeds: []
        },
        lastID: 0,
        selectionCount: 0
    },

    getters: {
        // save the enabled tags for duration of session
        enabledTags: (state) => getTagsFromState(state.tags),
        enabledGroups: (state) => getTagsFromState(state.groups)
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
            saveTagsToStorage(SESSION_TAGS.key, tags);
        },

        setGroups(state, tags){
            state.groups = tags;
            saveTagsToStorage(SESSION_GROUPS.key, tags);
        }
    }
});

export {
    store,
    Vuex
};