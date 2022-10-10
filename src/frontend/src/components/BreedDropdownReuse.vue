<template>
    <div class="reuse">
        <BreedGrid v-if="recentlyUsed.length > 0"
            :list="recentlyUsed.map(breed => ({ data: breed }))"
            :compact="true" />
        <p v-else class='information'>Unavailable.</p>
    </div>
</template>
<script setup lang="ts">
import { computed, PropType } from 'vue';
import { Gender } from '../app/types';
import { getBreedData, filterBreedTableByGender } from '../app/utils';
import { useAppStore } from '../store';
import BreedGrid from "./BreedGrid.vue";

const props = defineProps({
    filterByGender: {
        type: String as PropType<Gender>,
        required: true
    }
});

const appStore = useAppStore();
const recentlyUsed = computed(() => {
    const uniqueBreedNames = Object.keys(appStore.stats.usedBreeds);
    const uniqueBreeds = uniqueBreedNames.map(breedName => getBreedData(breedName))
    return filterBreedTableByGender(uniqueBreeds, props.filterByGender);
});
</script>

<style scoped>
.reuse{
    /* limit to two rows */
    max-height: 108px;
    /* fixes the annoying scroll bar from appearing with a single row */
    min-height: 54px;
    overflow-y: auto;
    scrollbar-gutter: stable;
}
.information{
    font-style: italic;
    font-size: 11px;
}
</style>