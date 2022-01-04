<template>
    <div class='breed-selector'>
        <h3>Breeds already in lineage</h3>
        <BreedDropdownReuse
            :filterByGender="dragon.gender"
            @selected="selected" />
        <h3>Breeds</h3>
        <div class='search'>
            <label for='mates-search'><font-awesome-icon icon="search" /> Filter:</label>
            <input
                id='mates-search'
                type="search"
                v-model="searchString"
                placeholder="search" />
        </div>
        <BreedDropdownResults
            :search="searchString"
            :breeds="breeds"
            @selected="selected" />
    </div>
</template>
<script>
import BreedDropdownResults from '@/components/BreedDropdownResults';
import BreedDropdownReuse from '@/components/BreedDropdownReuse';

export default {
    name: 'BreedDropdown',
    components: { BreedDropdownResults, BreedDropdownReuse },
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
        //for some reason next tick doesn't work here.
        window.setTimeout(() => {
            document.getElementById('mates-search').focus();
        }, 100);
    },

    methods: {
        selected(breed){
            //this.$store.commit('removeFromUsedBreeds', this.dragon.breed);
            //this.$store.commit('addToUsedBreeds', breed.name);
            this.$emit('selected', breed);
        }
    }
};
</script>
<style scoped>
.breed-selector{
    background: #fff;
    width:220px;
    background:#fff;
    -webkit-box-shadow: 0px 5px 8px -6px #000000; 
    box-shadow: 0px 5px 8px -6px #000000;
    padding:5px;
    text-align: left;
    border-radius: 5px;
    color:var(--breedDropDownColourFG);
}
.search{
    display: flex;
    align-items: flex-start;
}
.search input{
    flex:1;
    margin-left: 5px;
    width: 100%;
}

h3{
    margin:0px;
}
h3 {
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