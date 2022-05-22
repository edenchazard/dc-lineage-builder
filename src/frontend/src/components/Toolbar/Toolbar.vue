<template>
<div>
    <DialogExport
        v-if="showExportDialog"
        :tree="tree"
        @close="showExportDialog = false" />
    <DialogImport
        v-if="showImportDialog"
        @close="showImportDialog = false" 
        @onImport="importLineage" />
    <DialogGenerate
        v-if="showGenerateDialog"
        :tree='tree'
        @close="showGenerateDialog = false" />

    <div class='toolbar'>
        <div class='toolbar-item'>
            <toggle-button v-model="config.showInterface" color="var(--builderControlBG)" />
            <span>Show interface</span>
        </div>
        <div class='toolbar-item'>
            <toggle-button v-model="config.showLabels" color="var(--builderControlBG)" />
            <span>Show labels</span>
        </div>
        <div class='toolbar-item'>
            <ToolbarButton
                title='Export dragon'
                icon="save"
                label="Export"
                @click="showExportDialog = true" />
            <br />
            <ToolbarButton
                title='Import dragon'
                icon="file-code"
                label="Import"
                @click="showImportDialog = true" />
        </div>
        <div class='toolbar-item'>
            <ToolbarButton
                title='Get Link'
                icon="link"
                label="Get Link"
                @click="showGenerateDialog = true" />
        </div>
    </div>
    <div class="selection-tools">
        <div>Select:
            <ToolbarButton title='Select all males' icon="mars" @click="$emit('selectCriteria', 'gender', 'm')" />
            <ToolbarButton title='Select all females' icon="venus" @click="$emit('selectCriteria', 'gender', 'f')" />
            <ToolbarButton
                title='More options'
                icon="caret-down"
                :options="selectionOptions"
                @optionSelected="(value) => $emit('selectCriteria', value[0], value[1])" />
            <ToolbarButton
                :class="{
                    'invisible': !itemsSelected
                }"
                title='Unselect all'
                icon="times"
                @click="$emit('unselectAll')" />
        </div>
        <div
            class="selection-apply"
            :class="{
                'invisible': !itemsSelected
            }">
            <div class="selection-apply-left">
                <ToolbarButton title='Display names' icon="font" @click="$emit('displayNames')" />
                <ToolbarButton title='Display codes' icon="italic" @click="$emit('displayCodes')" />
                <ToolbarButton title='Randomize visible label' icon="random" @click="$emit('randomizeLabels')" />
                <ToolbarButton title='Delete Parents and Ancestors' icon="minus" @click="$emit('deleteAncestors')" />
                <ToolbarButton title='Add Parents' icon="arrow-right" @click="$emit('addParents')" />
            </div>
            <div class="selection-apply-breed">
                <select
                    class="selection-apply-breed-dropdown"
                    v-model="selectedBreed"
                    @change="$emit('changeBreed', selectedBreed)">
                    <option
                        v-for="breed in availableBreeds"
                        :key="breed">
                        {{breed}}
                    </option>
                </select>
                ({{itemsSelected}}) 
            </div>
        </div>
    </div>
</div>
</template>

<script>
/*
                <ToolbarButton title='Choose tags' icon="tag">
                    <template #dropdown>
                        <BreedTags />
                    </template>
                </ToolbarButton> 
                <ToolbarButton title='Switch Parents' icon="sync-alt" @click="$emit('switchParents')" />*/
import { utils, GLOBALS } from '@/app/bundle.js';

import { ToggleButton } from "vue-js-toggle-button";

import DialogExport from './DialogExport';
import DialogImport from './DialogImport';
import DialogGenerate from './DialogGenerate';

import ToolbarButton from './ToolbarButton';

//import BreedTags from '@/components/BreedTags';

const treeSelectedContains = (tree) => {
    let
        male = false,
        female = false;

    utils.forEveryDragon(tree, dragon => {
        if(!dragon.selected){
            return;
        }

        if(dragon.gender === 'm'){
            male = true;
        }
        else if(dragon.gender === 'f'){
            female = true;
        }
    });

    return { male, female }
}          

export default {
    name: 'Toolbar',
    components: {
        ToggleButton,
        DialogExport,
        DialogImport,
        DialogGenerate,
        ToolbarButton,
        //BreedTags
    },

    props:{
        tree: Object,
        config: Object
    },

    data(){
        return {
            selectionOptions: [
                { label: "All with code", value: ["display", 1] },
                { label: "All with name", value: ["display", 0] },
                { label: "All with placeholder", value: ["breed", "Placeholder"] },
            ],
            showImportDialog: false,
            showExportDialog: false,
            showGenerateDialog: false,
            showSelectBreedSelector: false,
            selectedBreed: null
        }
    },

    /*watch:{
        selectedBreed(){
            this.selectedBreed = null;
        }
    },*/

    computed: {
        itemsSelected(){
            return this.$store.state.selectionCount;
        },

        availableBreeds(){
            if(!this.itemsSelected){
                return [];
            }

            // should we list males, females or both
            const { male, female } = treeSelectedContains(this.tree);
    
            //filter by tags
            const breedTable = GLOBALS.breeds.entire.filter(breed =>
                this.$store.getters.enabledTags.indexOf(breed.metaData.category) > -1
            );

            const maleBreeds = GLOBALS.breeds.males.map(({name}) => name);
            const femaleBreeds = GLOBALS.breeds.females.map(({name}) => name);
    
            let breedList;

            // return breeds common to both lists
            if(male && female){
                breedList = breedTable
                    .filter(breed =>
                        maleBreeds.indexOf(breed.name) > -1
                        && femaleBreeds.indexOf(breed.name) > -1)
            }
            else{
                if(male){
                    breedList = breedTable.filter(breed => maleBreeds.indexOf(breed.name) > -1);
                }
                else{
                    breedList = breedTable.filter(breed => femaleBreeds.indexOf(breed.name) > -1);
                }
            }

            return breedList.map(breed => breed.name);
        }
    },

    methods:{
        test(r){
            r;
        },

        importLineage(tree){
            this.$emit('importTree', tree);
            this.$store.dispatch('setUsedBreeds', utils.countBreeds(tree));
        },
    }
}
</script>

<style scoped>
.toolbar{
  margin:20px auto;
  max-width: 800px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;
}
.toolbar-item{
  margin: 5px;
  text-align: center;
}
.toolbar-item span{
  margin: 5px;
}
.toolbar-item .control{
  width:100%;
}
.selection-tools{    
  margin:5px auto;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  justify-content:center;
  align-items: center;
}
.selection-tools > div{
    
}
.selection-apply{
    display: flex;
    flex-direction: column;
    display: inline-block;
    border-top: 2px solid var(--builderControlBG);
}
.selection-apply-left .control:first-child{
    margin-left: 0px;
}
.selection-apply-breed{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    /*background: var(--builderControlBG);*/
}
.selection-tools .control{
    margin:4px;
}
.invisible{
  visibility: hidden;
}
.selection-apply-breed-dropdown{
    max-width: 170px;
}
@media only screen and (min-width: 768px) {
    .toolbar {
        padding: 0px;
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }
    /*.selection-apply{
        display: flex;
        flex-direction: row;
    }*/
    .selection-apply-breed{
    }
}
@media only screen and (min-width: 470px) {
    .toolbar {
        padding: 0px;
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }
    .selection-apply{
        margin-left: 5px;
        padding-left: 5px;
        border-left: 2px solid var(--builderControlBG);
        border-top:0px none;
    }
    .selection-tools{
        flex-direction: row;
    }
}
</style>