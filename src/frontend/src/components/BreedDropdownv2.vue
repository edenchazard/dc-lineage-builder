<template>
    <FocusableDialog
        aria-label="Choose a breed"
        aria-description="Select a breed."
        @close="close">
        <template v-slot:title>
            Choose a breed
        </template>
        <template v-slot:content>
            <section class='recently-used'>
                <h3>Breeds already in lineage</h3>
                <BreedDropdownReuse
                    :filterByGender="dragon.gender"
                    @selected="selected" />
            </section>
            <section class='breeds'>
                <h3>Breeds</h3>
                <div class='search'>
                    <label for='mates-search'><font-awesome-icon icon="search" /> Filter:</label>
                    <input
                        type="search"
                        v-model="searchString"
                        placeholder="search"
                        ref="matesSearch" />
                </div>
                <BreedDropdownResults
                    :search="searchString"
                    :breeds="breeds"
                    @selected="selected" />
            </section>
        </template>
    </FocusableDialog>
</template>
<script>
import BreedDropdownResults from '@/components/BreedDropdownResults';
import BreedDropdownReuse from '@/components/BreedDropdownReuse';
import FocusableDialog from '@/components/FocusableDialog';

// I know this is hacky but this is the easiest and most optimal solution
// I could think of
export default {
    name: 'BreedDropdownv2',
    components: {
        BreedDropdownResults,
        BreedDropdownReuse,
        FocusableDialog
    },
    props: {
        breeds: Array,
        dragon: Object
    },

    data() {
        return {
            searchString: ""
        }
    },

    mounted(){
        // automatically focus the search bar
        this.$refs.matesSearch.focus();
    },

    methods: {
        selected(breed){
            this.$emit('selected', breed);
            this.close();
        },
        close(){
            this.$emit('close');
        }
    }
};
</script>
<style scoped>
.breed-selector{
    color:var(--breedDropDownColourFG);
    display:flex;
    flex-direction: column;
}
.recently-used{
    flex-grow:0;
}
.breeds{
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
.search{
    display: flex;
    align-items: flex-start;
    margin: 5px 0px;
}
.search input{
    flex:1;
    margin-left: 5px;
    width: 100%;
}
h3{
    margin:0px;
    min-height: 17px;
    position: relative;
    font-size: 11px;
    z-index: 1;
    overflow: hidden;
    text-align: left;
}
h3:after {
    position: absolute;
    top: 50%;
    overflow: hidden;
    width: 100%;
    height: 1px;
    content: '\a0';
    background-color: #000;
    margin-left: 5px;
}
</style>
<style>
</style>