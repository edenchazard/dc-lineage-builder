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
            There are no breeds that match this search.
        </div>
    </div>
</template>
<script>
import BreedGrid from "@/components/BreedGrid"

export default {
    name: 'BreedDropdownResults',
    components: { BreedGrid },
    props: {
        breeds: Array,
        search: String
    },

    data() {
        return {  }
    },

    watch:{
        'search'(){
            // scrolls the results back to the top to prevent
            // the view port being stuck further down
           this.$nextTick(() => this.$el.scrollTop = 0);
        }
    },

    computed: {
        filteredBreeds() {
            // if the search string is empty, return the whole 
            // list
            let search = this.search.toLowerCase().trim();
            if(search == ""){
                return this.breeds;
            }
            else{
                // we make two arrays, one for primary results (the search matches
                // the beginning of the breed name, and secondary results, where
                // the breed name includes the search term somewhere.
                let primaryResults = [];
                let secondaryResults = [];
                for(let breed of this.breeds){
                    let prettyName = breed.name.toLowerCase().trim();
                    let position = prettyName.indexOf(search);
                    if(position == 0){
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
    /* automatically size the results as appropriate
    but max out at 300px */
    max-height:300px;
    overflow-y: auto;
    margin: 10px 0px 0px 0px;
    scrollbar-gutter: stable;
}
.no-results{
    font-style: italic;
}
</style>