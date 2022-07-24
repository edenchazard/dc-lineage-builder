<template>
    <div class="results">
        <BreedGrid
            v-if="filteredBreeds.length > 0"
            ref="results"
            :breeds="filteredBreeds"
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
import BreedGrid from "./BreedGrid.vue"

export default {
    name: 'BreedDropdownResults',
    components: { BreedGrid },
    props: {
        breeds: Array,
        search: String,
        tags: Array,
        noResultsText: String
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
            // These two functions return filter functions for
            // the group and the tags
            // eslint-disable-next-line
            const filterGroup = (enabledGroup) => {
                // A group of "*" is a match all, it should be available
                // no matter the group filter, e.g. placeholder
                return (breed) => breed.metaData.group  === enabledGroup
                                    || breed.metaData.group === "*";
            }

            const filterTags = (enabledTags) => {
                return (breed) => {
                    const tags = breed.metaData.tags;
                    // If it's an empty tag list, automatically include the breed
                    if(tags.length === 0)
                        return true;

                    // If the breed has tags, then check against our tag list
                    // for at least one tag and include it if so
                    for(let tag of tags){
                        if(enabledTags.indexOf(tag) > -1)
                            return true;
                    }
                    return false;
                }
            }

            const search = this.search.toLowerCase().trim();

            const breeds = this.breeds
                // filter the group
                //.filter(filterGroup('standard'))
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
    overflow-y: auto;
    flex: 1;
    scrollbar-gutter: stable;
}
.no-results{
    font-style: italic;
}
</style>