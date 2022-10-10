import { computed, reactive, ref } from 'vue';
import { defineStore } from 'pinia';
import { LineageRoot, Tag } from '../app/types';

type SessionKey = 'session-tags' | "session-groups";

interface SessionTagSet {
    key: SessionKey,
    tags: string[]
}

const SESSION_TAGS: SessionTagSet = {
    key: 'session-tags',
    tags: ['Valentine', 'Christmas', 'Halloween', 'Hybrid', 'CB']
};

const SESSION_GROUPS: SessionTagSet = {
    key: "session-groups",
    tags: ["Standard", "Drake", "Pygmy", "Two-headed", "Other"]
};

// returns tags in session if set, or defaults
function loadTags(session: SessionTagSet){
    // get the session
    const tags = sessionStorage.getItem(session.key);

    // session exists, return the collection
    if(typeof tags === 'string') return JSON.parse(tags) as Tag[];

    // Return the default collection of tags with active set to true
    return session.tags.map(tag => ({ name: tag, active: true })) as Tag[];
}

function saveTagsToStorage(key: SessionKey, newValue: Tag[]){
    sessionStorage.setItem(key, JSON.stringify(newValue));
}

// Takes in an array of Tag types, filters for active tags
// and then creates an array of just the names
function flattenTagArray(tags: Tag[]){
    return tags
        .filter(tag => tag.active)
        .map(tag => tag.name);
}

export const useAppStore = defineStore('appStore', () => {
    const tags = reactive(loadTags(SESSION_TAGS));
    const groups = reactive(loadTags(SESSION_GROUPS));
    const stats = reactive({
        usedBreeds: []
    });
    const activeTree = ref<null | LineageRoot>(null);
    const lastID = ref(0);
    const selectionCount = ref(0);

    const enabledTags = computed(() => flattenTagArray(tags));
    const enabledGroups = computed(() => flattenTagArray(groups));

    // todo type this
    function setUsedBreeds(arr: any){
        stats.usedBreeds = arr;
    }
    
    function setSelectionCount(to = 0){
        selectionCount.value = to;
    }

    function setTags(newList: Tag[]){
        tags.length = 0;
        tags.splice(0, tags.length, ...newList);
        saveTagsToStorage(SESSION_TAGS.key, tags);
    }

    function setGroups(newList: Tag[]){
        groups.length = 0;
        groups.splice(0, groups.length, ...newList);
        saveTagsToStorage(SESSION_GROUPS.key, tags);
    }

    return {
        activeTree,
        tags,
        groups,
        stats,
        lastID,
        selectionCount,
        enabledGroups,
        enabledTags,
        setUsedBreeds,
        setSelectionCount,
        setGroups,
        setTags
    }
});