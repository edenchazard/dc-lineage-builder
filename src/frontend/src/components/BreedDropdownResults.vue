<template>
    <div
        class="results">
        <BreedGrid
            ref="container"
            v-if="filteredBreeds.length > 0"
            :list="filteredBreeds.map(breed => ({ data: breed }))"
            :compact="filteredBreeds.length > 5"
            v-bind="$attrs" />
        <div
            v-else
            class="no-results">
            {{ noResultsText }}
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, ref } from "@vue/reactivity";
import { nextTick, PropType, watch } from "vue";
import { PortraitData } from "../app/types";
import { filterGroup, filterTags } from "../app/utils";
import BreedGrid from "./BreedGrid.vue";

const props = defineProps({
    breeds: {
        type: Array<PortraitData>,
        required: true
    },
    search: {
        type: String,
        default: ""
    },
    noResultsText: {
        type: String,
        default: "No results"
    },
    tags: {
        type: Array as PropType<string[]>,
        required: true
    },
    groups: {
        type: Array as PropType<string[]>,
        required: true
    }
});

const container = ref<HTMLDivElement | null>(null);

const filteredBreeds = computed(() => {
    const search = props.search.toLowerCase().trim();
    const breeds = props.breeds
        // filter the group and tags
        .filter(() => filterGroup(props.groups) && filterTags(props.tags));

    // if the search string is empty, return the whole 
    // list
    if(search === "") return breeds;

    // we make two arrays, one for primary results (the search matches
    // the beginning of the breed name, and secondary results, where
    // the breed name includes the search term somewhere.
    let
        primaryResults: PortraitData[]  = [],
        secondaryResults: PortraitData[] = [];

    for(let breed of breeds){
        const
            prettyName = breed.name.toLowerCase().trim(),
            position = prettyName.indexOf(search);

        if(position === 0)
            primaryResults.push(breed);
        else if(position > -1)
            secondaryResults.push(breed);
    }
    return primaryResults.concat(secondaryResults);
});

watch(filteredBreeds, () => console.log('BREEDS', filteredBreeds.value))

watch(container, () => {
    // scrolls the results back to the top to prevent
    // the view port being stuck further down
    if(container !== null) nextTick(() => (container.value as HTMLDivElement).scrollTop = 0);
});
</script>

<style scoped>
.results{
    padding:0px;
    overflow-y: hidden;
    flex: 1;
}
.no-results{
    font-style: italic;
}
</style>