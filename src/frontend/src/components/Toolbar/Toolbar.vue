<template>
<div>
    <div class='toolbar'>
        <DialogExport :show="showExportDialog" :tree="tree" @close="showExportDialog = false" />
        <DialogImport :show="showImportDialog" @close="showImportDialog = false" @onImport="importLineage" />
        <DialogGenerate :show="showGenerateDialog" :tree='tree' @close="showGenerateDialog = false" />
        <BreedDropdownv2
            v-if="showSelectBreedSelector === true"
            :breeds="availableBreeds"
            @selected="(breed) => $emit('changeBreed', breed)"
            @close="showBreedSelector=false" />

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
        <span>
            Select:
            <ToolbarButton title='Select all males' icon="mars" @click="$emit('selectCriteria', 'male')" />
            <ToolbarButton title='Select all females' icon="venus" @click="$emit('selectCriteria', 'female')" />
            <ToolbarButton
                title='More options'
                icon="caret-down"
                :options="selectionOptions"
                @optionSelected="(criteria) => $emit('selectCriteria', criteria)" />
        </span>
        <span
            class="selection-apply"
            :class="{
                'invisible': !itemsSelected
            }">
            With selected ({{itemsSelected}}):
            <ToolbarButton title='Unselect all' icon="times" @click="$emit('unselectAll')" />
            <ToolbarButton title='Change breed' icon="dragon" @click="showSelectBreedSelector = true" />
            <ToolbarButton title='Display names' icon="font" @click="$emit('displayNames')" />
            <ToolbarButton title='Display codes' icon="italic" @click="$emit('displayCodes')" />
            <ToolbarButton title='Randomize visible label' icon="random" @click="$emit('randomizeLabels')" />
        </span>
    </div>
</div>
</template>

<script>
import { utils } from '@/app/bundle.js';

import { ToggleButton } from "vue-js-toggle-button";

import DialogExport from '@/components/DialogExport';
import DialogImport from '@/components/DialogImport';
import DialogGenerate from '@/components/DialogGenerate';

import ToolbarButton from './ToolbarButton';

import BreedDropdownv2 from '@/components/BreedDropdownv2';

export default {
    name: 'Toolbar',
    components: {
        ToggleButton,
        DialogExport,
        DialogImport,
        DialogGenerate,
        ToolbarButton,
        BreedDropdownv2
    },

    props:{
        tree: Object,
        config: Object
    },

    data(){
        return {
            selectionOptions: [
                { label: "All with code", value: "code" },
                { label: "All with name", value: "name" },
                { label: "All with placeholder", value: "placeholder" },
            ],
            showImportDialog: false,
            showExportDialog: false,
            showGenerateDialog: false,
            showSelectBreedSelector: false,
        }
    },

    computed: {
        itemsSelected(){
            console.log('count', this.$store.state.selectionCount)
            return this.$store.state.selectionCount;
        }
    },

    methods:{
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
}
.selection-apply{
    display: inline-block;
    border-left: 2px solid var(--builderControlBG);
    margin-left: 5px;
    padding-left: 5px;
}
.selection-tools .control{
    margin:2px;
}
.invisible{
  visibility: hidden;
}
@media only screen and (min-width: 768px) {
  .toolbar {
    padding: 0px;
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
}
</style>