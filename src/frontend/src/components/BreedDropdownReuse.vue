<template>
    <div class="reuse">
        <BreedGrid v-if="recentlyUsed.length > 0"
            :breeds="recentlyUsed"
            :compact="true"
            v-on="$listeners" />
        <p v-else class='information'>Unavailable.</p>
    </div>
</template>
<script>
import { getBreedData, filterBreedTableByGender } from '../app/utils';

import BreedGrid from "./BreedGrid.vue";

export default {
    name: 'BreedDropdownReuse',
    components: { BreedGrid },
    props: {
        filterByGender: String
    },
    computed: {
        recentlyUsed(){
            const uniqueBreedNames = Object.keys(this.$store.state.stats.usedBreeds);
            const uniqueBreeds = uniqueBreedNames.map(breedName => getBreedData(breedName))
            const r = filterBreedTableByGender(uniqueBreeds, this.filterByGender);
            return r;
        }
    }
};
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