<template>
    <div
        class="results">
        <BreedGrid
            ref="container"
            v-if="filteredBreeds.length > 0"
            :list="filteredBreeds.map(breed => ({ data: breed }))"
            :compact="filteredBreeds.length > 5"
            v-bind="$attrs"
            @breedSelected="(breed) => emit('breedSelected', breed)" />
        <div
            v-else
            class="no-results">
            {{ noResultsText }}
        </div>
    </div>
</template>
<script setup lang="ts">
import { nextTick, PropType, watch, computed, ref } from "vue";
import { FilterTag, GroupTag, PortraitData } from "../app/types";
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
        type: Array as PropType<FilterTag[]>,
        required: true
    },
    groups: {
        type: Array as PropType<GroupTag[]>,
        required: true
    }
});

const emit = defineEmits<{
    (e: 'breedSelected', breed: PortraitData): void
}>();

const container = ref<HTMLDivElement | null>(null);

const filteredBreeds = computed(() => {
    const search = props.search.toLowerCase().trim();
    const breeds = props.breeds
        // filter the group and tags
        .filter(filterGroup(props.groups))
        .filter(filterTags(props.tags));

    // if the search string is empty, return the whole 
    // list
    if(search === "") return breeds;

    // we make two arrays, one for primary results (the search matches
    // the beginning of the breed name, and secondary results, where
    // the breed name includes the search term somewhere.
    const
        primary: PortraitData[]  = [],
        secondary: PortraitData[] = [];

    for(let breed of breeds){
        const position = breed.name.toLowerCase().trim().indexOf(search);
        if(position === 0)
            primary.push(breed);
        else if(position > -1)
            secondary.push(breed);
    }
    return primary.concat(secondary);
});

watch(container, () => {
    // scrolls the results back to the top to prevent
    // the view port being stuck further down
    if(container.value !== null) nextTick(() => (container.value as HTMLDivElement).scrollTop = 0);
});
</script>

<style scoped>
.results{
    padding:0px;
    flex: 1;
}
.no-results{
    font-style: italic;
}
</style>