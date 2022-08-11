<template>
    <div class="results">
        <BreedGrid
            v-if="filteredBreeds.length > 0"
            ref="results"
            :list="filteredBreeds.map(breed => ({ data: breed }))"
            :compact="filteredBreeds.length > 5"
            v-on="$listeners" />
        <div
            v-else
            class="no-results">
            {{noResultsText}}
        </div>
    </div>
</template>
<script>
import { filterGroup, filterTags } from "../app/utils";
import BreedGrid from "./BreedGrid.vue";

export default {
    name: 'BreedDropdownResults',
    components: { BreedGrid },
    props: {
        breeds: Array,
        search: String,
        noResultsText: String,
        tags: Array,
        groups: Array
    },

    data() {
        return {  }
    },

    watch:{
        search(){
            // scrolls the results back to the top to prevent
            // the view port being stuck further down
           this.$nextTick(() => this.$el.scrollTop = 0);
        }
    },

    computed: {
        filteredBreeds() {
            const search = this.search.toLowerCase().trim();

            const breeds = this.breeds
                // filter the group
                .filter(filterGroup(this.groups))
                // if we have tags, make sure to filter them
                .filter(filterTags(this.tags));

            // if the search string is empty, return the whole 
            // list
            if(search === ""){
                return breeds;
            }
            else{
                // we make two arrays, one for primary results (the search matches
                // the beginning of the breed name, and secondary results, where
                // the breed name includes the search term somewhere.
                let
                    primaryResults = [],
                    secondaryResults = [];

                for(let breed of breeds){
                    const
                        prettyName = breed.name.toLowerCase().trim(),
                        position = prettyName.indexOf(search);

                    if(position === 0){
                        primaryResults.push(breed);
                    }
                    else if(position > -1){
                        secondaryResults.push(breed);
                    }
                }
                return primaryResults.concat(secondaryResults);
            }
        }
    }
};
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