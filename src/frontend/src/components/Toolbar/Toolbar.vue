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
            <Vue3ToggleButton 
                v-model:isActive="config.showInterface"
                handleColor="var(--builderControlBG)" />
            <span>Show interface</span>
        </div>
        <div class='toolbar-item'>
            <Vue3ToggleButton 
                v-model:isActive="config.showLabels"
                handleColor="var(--builderControlBG)" />
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
                @optionSelected="([crit, value]) => $emit('selectCriteria', crit, value)" />
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
                <ToolbarButton title='Switch Parents' icon="sync-alt" @click="$emit('switchParents')" />
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

<script lang="ts">
/*
                <ToolbarButton title='Choose tags' icon="tag">
                    <template #dropdown>
                        <BreedTags />
                    </template>
                </ToolbarButton> */
import { Vue3ToggleButton } from 'vue3-toggle-button';
import '../../../node_modules/vue3-toggle-button/dist/style.css';
import GLOBALS from "../../app/globals";
import {
    forEveryDragon,
    countBreeds,
    filterGroup,
    filterTags } from "../../app/utils";

import DialogExport from './DialogExport.vue';
import DialogImport from './DialogImport.vue';
import DialogGenerate from './DialogGenerate.vue';
import ToolbarButton from './ToolbarButton.vue';
import { useAppStore } from "../../store";
import { LineageConfig, LineageRoot } from "../../app/types";
import { defineComponent, PropType } from "vue";

const treeSelectedContains = (tree: LineageRoot) => {
    let
        male = false,
        female = false;

    forEveryDragon(tree, dragon => {
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

export default defineComponent({
    name: 'Toolbar',
    components: {
        DialogExport,
        DialogImport,
        DialogGenerate,
        ToolbarButton,
        Vue3ToggleButton
    },

    props:{
        tree: {
            type: Object as PropType<LineageRoot>,
            required: true
        },
        config: {
            type: Object as PropType<LineageConfig>,
            required: true
        }
    },

    setup() {
        return { appStore: useAppStore() }
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
            return this.appStore.selectionCount;
        },
        availableBreeds(){
            // no tree, ignore. prevents exception when switching routes
            if(!this.tree) return [];
            if(!this.itemsSelected) return [];

            // should we list males, females or both
            const { male, female } = treeSelectedContains(this.tree);
    
            const breedTable = GLOBALS.breeds.entire
                // filter the group
                .filter(filterGroup(this.appStore.enabledGroups))
                // if we have tags, make sure to filter them
                .filter(filterTags(this.appStore.enabledTags));

            const maleBreeds = GLOBALS.breeds.males.map(({name}) => name);
            const femaleBreeds = GLOBALS.breeds.females.map(({name}) => name);
    
            // return breeds common to both lists
            let filter;
            if(male && female){
                filter = breed =>
                        maleBreeds.indexOf(breed.name) > -1
                        && femaleBreeds.indexOf(breed.name) > -1
            }
            else{
                if(male){
                    filter = breed => maleBreeds.indexOf(breed.name) > -1;
                }
                else{
                    filter = breed => femaleBreeds.indexOf(breed.name) > -1;
                }
            }

            return breedTable.filter(filter).map(breed => breed.name);
        }
    },

    methods:{
        importLineage(tree){
            this.$emit('importTree', tree);
            this.appStore.setUsedBreeds(countBreeds(tree));
        },
    }
});
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