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
                    @breedSelected="breedSelected" />
            </section>
            <section class='breeds'>
                <h3>Breeds</h3>
                <div class='groups'>
                    <label>Groups:</label>
                    <BreedGroupsTagSelector />
                </div>
                <div class='applied-tags'>
                    <label>Showing:</label>
                    <BreedTagsSelector />
                </div>
                <div class='search'>
                    <label for='mates-search'><font-awesome-icon icon="search" /> Filter:</label>
                    <BreedSearchControl
                        ref="mateSearchEl"
                        @update="(search) => searchString = search" />
                </div>
                <BreedDropdownResults
                    :search="searchString"
                    :breeds="breeds"
                    :tags="tagStore.enabledTags"
                    :groups="tagStore.enabledEggGroups"
                    noResultsText="There are no breeds that match this criteria."
                    @breedSelected="breedSelected" />
            </section>
        </template>
    </FocusableDialog>
</template>
<script setup lang="ts">
import { onMounted, PropType, ref } from 'vue';
import { useTagStore } from '../store/tags';
import { Gender, PortraitData } from '../app/types';
import BreedDropdownResults from './BreedDropdownResults.vue';
import BreedDropdownReuse from './BreedDropdownReuse.vue';
import FocusableDialog from './FocusableDialog.vue';
import BreedTagsSelector from './BreedTagsSelector.vue';
import BreedGroupsTagSelector from './BreedGroupsTagSelector.vue';
import BreedSearchControl from './BreedSearchControl.vue';

const props = defineProps({
    breeds: {
        type: Array<PortraitData>,
        required: true
    },
    genderFilter: {
        type: String as PropType<Gender>,
        required: true
    }
});

const emit = defineEmits<{
    (e: 'breedSelected', breed: PortraitData): void,
    (e: 'close'): void
}>();

const tagStore = useTagStore();
const searchString = ref("");
const mateSearchEl = ref<HTMLInputElement>();

onMounted(() => {
    // automatically focus the search bar if desktop
    // on mobile I personally find it annoying for the 
    // keyboard to immediately pop up
    if(mateSearchEl.value && 'ontouchstart' in document.documentElement === false)
        mateSearchEl.value.$el.focus(); // todo fix
});

function breedSelected(breed: PortraitData){
    emit('breedSelected', breed);
    close();
}

function close(){
    emit('close');
}

</script>
<style scoped>
/* hide labels on mobile screens */
.breeds label{
    display:none;
}
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
    flex:1;
}
.applied-tags, .groups{
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
@media only screen and (min-width: 500px) {
    .breeds label{
        display:unset;
    }
}
</style>