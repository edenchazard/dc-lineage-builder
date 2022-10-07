import { computed, reactive, ref } from 'vue';
import { defineStore } from 'pinia';

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

export const useAppStore = defineStore('appStore', () => {
    const tags = ref(loadTags(SESSION_TAGS));
    const groups = ref(loadTags(SESSION_GROUPS));
    const stats = reactive({
        usedBreeds: []
    });
    const activeTree = reactive({ });
    const lastID = ref(0);
    const selectionCount = ref(0);

    const enabledTags = computed(() =>  getTagsFromState(tags));
    const enabledGroups = computed(() => getTagsFromState(groups));

    function setUsedBreeds(arr){
        stats.usedBreeds = arr;
    }
    
    function setSelectionCount(to = 0){
        selectionCount.value = to;
    }

    function setTags(tags){
        tags.value = tags;
        saveTagsToStorage(SESSION_TAGS.key, tags);
    }

    function setGroups(tags){
        groups.value = tags;
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