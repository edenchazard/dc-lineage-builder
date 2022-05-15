<template>
    <FocusableDialog
        aria-label="Choose a breed"
        aria-description="Select a breed."
        @close="close">
        <template v-slot:title>
            <h2>Choose a breed</h2>
        </template>
        <template v-slot:content>
            <section class='recently-used'>
                <h3>Breeds already in lineage</h3>
                <BreedDropdownReuse
                    :filterByGender="genderFilter"
                    @selected="selected" />
            </section>
            <section class='breeds'>
                <h3>Breeds</h3>
                <div class='applied-tags'>
                    <label>Showing:</label>
                    <TagList
                        :value="tagStates"
                        @updated="tagStates = [...$event]" />
                </div>
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
                    :tags="enabledTags"
                    noResultsText="There are no breeds that match this criteria."
                    @selected="selected" />
            </section>
        </template>
    </FocusableDialog>
</template>
<script>
import BreedDropdownResults from '@/components/BreedDropdownResults';
import BreedDropdownReuse from '@/components/BreedDropdownReuse';
import FocusableDialog from '@/components/FocusableDialog';
import TagList from '@/components/ui/TagList';

const SESSION_KEY = 'session';

export default {
    name: 'BreedDropdownv2',
    components: {
        BreedDropdownResults,
        BreedDropdownReuse,
        FocusableDialog,
        TagList
    },
    props: {
        breeds: Array,
        genderFilter: String
    },

    data() {
        // if we have an already stored set of tags,
        // use that instead
        const
            availableTags = ['dragon', 'drake', 'pygmy', 'two-head'],
            defaultTags = availableTags.map(tag => ({ name: tag, active: true })),
            tagStates = this.getSessionTagStates() || defaultTags;

        return {
            searchString: "",
            tagStates
        }
    },

    mounted(){
        // automatically focus the search bar if desktop
        // on mobile I personally find it annoying for the 
        // keyboard to immediately pop up
        if('ontouchstart' in document.documentElement === false){
            this.$refs.matesSearch.focus();
        }
    },

    // save the enabled tags for duration of session
    watch: {
        tagStates(tags){
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(tags));
        }
    },

    computed: {
        enabledTags(){
            return this.tagStates
                .filter(tag => tag.active)
                .map(tag => tag.name);
        }
    },

    methods: {
        selected(breed){
            this.$emit('selected', breed);
            this.close();
        },

        close(){
            this.$emit('close');
        },

        getSessionTagStates(){
            const session = sessionStorage.getItem(SESSION_KEY);
            return session ? JSON.parse(session) : null;
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
.applied-tags{
    display: flex;
    flex-direction: row;
    align-items: center;
    text-align: left;
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
h2{
    font-size: 16px;
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