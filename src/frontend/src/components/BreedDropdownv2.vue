<template>
    <div class='breed-selector' role="dialog">
        <section class='recently-used'>
            <button class='close'
                @click="close">[x]</button>
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
    </div>
</template>
<script>
import BreedDropdownResults from '@/components/BreedDropdownResults';
import BreedDropdownReuse from '@/components/BreedDropdownReuse';

// I know this is hacky but this is the easiest and most optimal solution
// I could think of
export default {
    name: 'BreedDropdownv2',
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
        this.$el.outsideEvent = (e) =>{
            //console.log('b', this.$el)
            //console.log('t', e.target)
            if (this.$el.parentNode && !this.$el.parentNode.contains(e.target) ) {
                this.close();
            }
        };

        document.addEventListener('click', this.$el.outsideEvent);

        // automatically focus the search bar
        this.$refs.matesSearch.focus();
    },

    // clean up
    beforeDestroy(){
        this.cleanUp();
    },

    methods: {
        cleanUp(){
            document.removeEventListener('click', this.$el.outsideEvent);
            this.$el.outsideEvent = null;
        },

        selected(breed){
            this.$emit('selected', breed);
            this.close();
        },
        close(){
            this.$emit('close');
            this.cleanUp();
        }
    }
};
</script>
<style scoped>
.breed-selector{
    background: #fff;
    padding:5px;
    color:var(--breedDropDownColourFG);
    z-index: 9999;
    position: fixed;
    bottom: 0;
    top: 0;
    left: 0;
    right: 0;
    width: 100vw;
    height: 100%;
    display:flex;
    flex-direction: column;
    margin:0px;
}
.recently-used{
    flex-grow:0;
}
.breeds{
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
@media only screen and (min-width: 768px){
    .breed-selector{
        width:500px;
        height:500px;
        /* https://stackoverflow.com/questions/2005954/center-a-positionfixed-element */
        margin-top: -250px;
        margin-left: -250px;
        left: 50%;
        top: 50%;
        -webkit-box-shadow:0px 0px 200px 0px #000000; 
        box-shadow: 0px 0px 200px 0px #000000;
    }
    .close{
        display: none;
    }
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