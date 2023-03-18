<template>
  <div>
    <DialogExport
      v-if="dialogs.showExportDialog"
      :tree="tree"
      @close="dialogs.showExportDialog = false"
    />
    <DialogImport
      v-if="dialogs.showImportDialog"
      @close="dialogs.showImportDialog = false"
      @onImport="importLineage"
    />
    <DialogGenerate
      v-if="dialogs.showGenerateDialog"
      :tree="tree"
      @close="dialogs.showGenerateDialog = false"
    />

    <div class="toolbar">
      <div class="toolbar-item">
        <Vue3ToggleButton
          v-model:isActive="config.showInterface"
          trackActiveColor="var(--builderControlBG)"
          trackHeight="20px"
          handleDiameter="18px"
          handleDistance="52px"
        />
        <span>Show interface</span>
      </div>
      <div class="toolbar-item">
        <Vue3ToggleButton
          v-model:isActive="config.showLabels"
          trackActiveColor="var(--builderControlBG)"
          trackHeight="20px"
          handleDiameter="18px"
          handleDistance="52px"
        />
        <span>Show labels</span>
      </div>
      <div class="toolbar-item">
        <ToolbarButton
          title="Export dragon"
          icon="save"
          label="Export"
          @click="dialogs.showExportDialog = true"
        />
        <br />
        <ToolbarButton
          title="Import dragon"
          icon="file-code"
          label="Import"
          @click="dialogs.showImportDialog = true"
        />
      </div>
      <div class="toolbar-item">
        <ToolbarButton
          title="Get Link"
          icon="link"
          label="Get Link"
          @click="dialogs.showGenerateDialog = true"
        />
      </div>
    </div>
    <div class="selection-tools">
      <div>
        Select:
        <ToolbarButton
          title="Select all males"
          icon="mars"
          @click="emit('selectCriteria', 'gender', 'm')"
        />
        <ToolbarButton
          title="Select all females"
          icon="venus"
          @click="emit('selectCriteria', 'gender', 'f')"
        />
        <ToolbarButton
          title="More options"
          icon="caret-down"
          :options="selectionOptions"
          @optionSelected="
            ({ value: [crit, value] }) => emit('selectCriteria', crit, value)
          "
        />
        <ToolbarButton
          :class="{
            invisible: !itemsSelected,
          }"
          title="Unselect all"
          icon="times"
          @click="emit('unselectAll')"
        />
      </div>
      <div
        class="selection-apply"
        :class="{
          invisible: !itemsSelected,
        }"
      >
        <div class="selection-apply-left">
          <ToolbarButton
            title="Display names"
            icon="font"
            @click="emit('displayNames')"
          />
          <ToolbarButton
            title="Display codes"
            icon="italic"
            @click="emit('displayCodes')"
          />
          <ToolbarButton
            title="Randomize visible label"
            icon="random"
            @click="emit('randomizeLabels')"
          />
          <ToolbarButton
            title="Delete Parents and Ancestors"
            icon="minus"
            @click="emit('deleteAncestors')"
          />
          <ToolbarButton
            title="Add Parents"
            icon="arrow-right"
            @click="emit('addParents')"
          />
          <ToolbarButton
            title="Switch Parents"
            icon="sync-alt"
            @click="emit('switchParents')"
          />
        </div>
        <div class="selection-apply-breed">
          <select
            class="selection-apply-breed-dropdown"
            v-model="selectedBreed"
            @change="emit('changeBreed', selectedBreed)"
          >
            <option
              v-for="breed in availableBreeds"
              :key="breed"
            >
              {{ breed }}
            </option>
          </select>
          ({{ itemsSelected }})
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/*
                <ToolbarButton title='Choose tags' icon="tag">
                    <template #dropdown>
                        <BreedTags />
                    </template>
                </ToolbarButton> */
import { computed, PropType, reactive, ref } from 'vue';

import { Vue3ToggleButton } from 'vue3-toggle-button';
import '../../../node_modules/vue3-toggle-button/dist/style.css';

import GLOBALS from '../../app/globals';
import { forEveryDragon, filterEggGroups, filterTags } from '../../app/utils';
import { useAppStore } from '../../store/app';
import {
  BreedEntry,
  DragonType,
  LineageConfig,
  LineageRoot,
  PortraitData,
} from '../../app/types';
import DialogExport from './DialogExport.vue';
import DialogImport from './DialogImport.vue';
import DialogGenerate from './DialogGenerate.vue';
import ToolbarButton from './ToolbarButton.vue';
import { useTagStore } from '../../store/tags';

const props = defineProps({
  tree: {
    type: Object as PropType<LineageRoot>,
    required: true,
  },
  config: {
    type: Object as PropType<LineageConfig>,
    required: true,
  },
});

const emit = defineEmits<{
  (e: 'addParents'): void;
  (e: 'switchParents'): void;
  (e: 'unselectAll'): void;
  (e: 'displayNames'): void;
  (e: 'displayCodes'): void;
  (e: 'randomizeLabels'): void;
  (e: 'deleteAncestors'): void;
  (e: 'importTree', tree: LineageRoot): void;
  (e: 'changeBreed', value: string): void;
  (e: 'selectCriteria', key: string, value: any): void;
  (e: 'selectCriteria', predicate: (dragon: DragonType) => boolean): void;
}>();

const treeSelectedContains = (tree: LineageRoot) => {
  let male = false,
    female = false;

  forEveryDragon(tree, (dragon) => {
    if (!dragon.selected) return;
    if (dragon.gender === 'm') male = true;
    else if (dragon.gender === 'f') female = true;
  });

  return { male, female };
};

const tagStore = useTagStore();
const appStore = useAppStore();

const selectionOptions = reactive<
  { label: string; value: [keyof DragonType, any] }[]
>([
  { label: 'All with code', value: ['display', 1] },
  { label: 'All with name', value: ['display', 0] },
  { label: 'All with placeholder', value: ['breed', 'Placeholder'] },
]);
const dialogs = reactive({
  showImportDialog: false,
  showExportDialog: false,
  showGenerateDialog: false,
});
// default to placeholder
const selectedBreed = ref(GLOBALS.placeholder.name);

/*watch:{
    selectedBreed(){
        this.selectedBreed = null;
    }
},*/
const itemsSelected = computed(() => appStore.selectionCount);

const availableBreeds = computed(() => {
  // no tree, ignore. prevents exception when switching routes
  if (!props.tree || !itemsSelected) return [];

  // should we list males, females or both
  const { male, female } = treeSelectedContains(props.tree);

  const breedTable = GLOBALS.breeds.entire
    // filter the group
    .filter(filterEggGroups(tagStore.enabledEggGroups))
    // if we have tags, make sure to filter them
    .filter(filterTags(tagStore.enabledTags));

  const getNames = (breed: PortraitData) => breed.name;
  const maleBreeds = GLOBALS.breeds.males.map(getNames);
  const femaleBreeds = GLOBALS.breeds.females.map(getNames);

  // return breeds common to both lists
  let filter: (breed: BreedEntry) => boolean;
  const hasBreed = (list: string[], name: string) => list.includes(name);

  // Dealing with a tree containing selections of male + female
  if (male && female) {
    filter = (breed) =>
      hasBreed(maleBreeds, breed.name) && hasBreed(femaleBreeds, breed.name);
  }
  // Only female or only male
  else {
    filter = male
      ? (breed) => hasBreed(maleBreeds, breed.name)
      : (breed) => hasBreed(femaleBreeds, breed.name);
  }

  return breedTable.filter(filter).map((breed) => breed.name);
});

function importLineage(tree: LineageRoot) {
  emit('importTree', tree);
}
</script>

<style scoped>
.toolbar {
  margin: 20px auto;
  max-width: 800px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;
}
.toolbar-item {
  margin: 5px;
  text-align: center;
}
.toolbar-item span {
  margin: 5px;
}
.toolbar-item .control {
  width: 100%;
}
.selection-tools {
  margin: 5px auto;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.selection-apply {
  display: flex;
  flex-direction: column;
  display: inline-block;
  border-top: 2px solid var(--builderControlBG);
}
.selection-apply-left .control:first-child {
  margin-left: 0px;
}
.selection-apply-breed {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  /*background: var(--builderControlBG);*/
}
.selection-tools .control {
  margin: 4px;
}
.invisible {
  visibility: hidden;
}
.selection-apply-breed-dropdown {
  max-width: 170px;
}
@media only screen and (min-width: 768px) {
  .toolbar {
    padding: 0px;
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
}
@media only screen and (min-width: 470px) {
  .toolbar {
    padding: 0px;
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
  .selection-apply {
    margin-left: 5px;
    padding-left: 5px;
    border-left: 2px solid var(--builderControlBG);
    border-top: 0px none;
  }
  .selection-tools {
    flex-direction: row;
  }
}
</style>
