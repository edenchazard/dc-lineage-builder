<template>
  <div>
    <DialogExport
      id="dialog-export"
      :open="dialogs.showExportDialog"
      :tree="tree"
      @close="dialogs.showExportDialog = false"
    />
    <DialogImport
      id="dialog-import"
      :open="dialogs.showImportDialog"
      @close="dialogs.showImportDialog = false"
      @on-import="importLineage"
    />
    <DialogGenerate
      id="dialog-generate"
      :open="dialogs.showGenerateDialog"
      :tree="tree"
      @close="dialogs.showGenerateDialog = false"
    />
    <div
      ref="toolbar"
      class="toolbar"
      role="toolbar"
    >
      <div
        class="settings"
        aria-label="Settings toolbar"
      >
        <label>
          <input
            v-model="config.showInterface"
            type="checkbox"
          />Show interface
        </label>
        <label>
          <input
            v-model="config.showLabels"
            type="checkbox"
          />Show labels
        </label>
      </div>
      <div
        class="functions"
        aria-label="Functions toolbar"
      >
        <ToolbarButton
          v-for="button in generalFunctions"
          :key="button.label"
          v-bind="button"
          @click="button.click"
        />
      </div>
      <div
        class="selection-tools"
        aria-label="Selection toolbar"
      >
        <ToolbarGroup>
          <ToolbarButton
            title="Select all males"
            :icon="{ icon: 'mars' }"
            @click="emit('selectCriteria', 'gender', 'm')"
          />
          <ToolbarButton
            :icon="{ icon: 'venus' }"
            title="Select all females"
            @click="emit('selectCriteria', 'gender', 'f')"
          />
          <ToolbarDropDownMenu
            title="More options"
            :icon="{ icon: 'caret-down' }"
          >
            <ToolbarDropDownMenuItem
              v-for="option in selectionOptions"
              :key="option.key"
              @click="emit('selectCriteria', option.key, option.criteria)"
            >
              {{ option.label }}
            </ToolbarDropDownMenuItem>
          </ToolbarDropDownMenu>
          <ToolbarButton
            title="Unselect all"
            :icon="{ icon: 'times' }"
            :disabled="itemsSelected === 0"
            @click="emit('unselectAll')"
          />
          <template #legend>Select</template>
        </ToolbarGroup>
        <ToolbarGroup
          v-for="group in selectionActions"
          :key="group.name"
        >
          <ToolbarButton
            v-for="button in group.buttons"
            :key="button.label"
            v-bind="button"
            :disabled="itemsSelected === 0"
            @click="button.click"
          />
          <template #legend>{{ group.name }}</template>
        </ToolbarGroup>
        <ToolbarGroup>
          <select
            v-model="selectedBreed"
            class="selection-apply-breed-dropdown"
            :disabled="itemsSelected === 0"
            @change="emit('changeBreed', selectedBreed)"
          >
            <option
              v-for="breed in availableBreeds"
              :key="breed"
            >
              {{ breed }}
            </option>
          </select>
          <span title="Dragons selected">({{ itemsSelected }})</span>
          <template #legend>Breed</template>
        </ToolbarGroup>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType, reactive, ref } from 'vue';
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
import DialogExport from '../dialogs/DialogExport.vue';
import DialogImport from '../dialogs/DialogImport.vue';
import DialogGenerate from '../dialogs/DialogGenerate.vue';
import ToolbarButton from './ToolbarButton.vue';
import ToolbarDropDownMenu from './ToolbarDropDownMenu/ToolbarDropDownMenu.vue';
import ToolbarDropDownMenuItem from './ToolbarDropDownMenu/ToolbarDropDownMenuItem.vue';
import ToolbarGroup from './ToolbarGroup.vue';
import { useTagStore } from '../../store/tags';

type ToolbarButtonProps = Required<
  Pick<InstanceType<typeof ToolbarButton>['$props'], 'icon' | 'label'> & {
    click: () => void;
  } //todo why! & Partial<ButtonHTMLAttributes>
>;

const tagStore = useTagStore();
const appStore = useAppStore();
const toolbar = ref();

const generalFunctions = reactive<ToolbarButtonProps[]>(
  [
    {
      title: 'Export dragon',
      icon: 'save',
      label: 'Export',
      click: () => (dialogs.showExportDialog = true),
    },
    {
      title: 'Import dragon',
      icon: 'file-code',
      label: 'Import',
      click: () => (dialogs.showImportDialog = true),
    },
    {
      title: 'Get Link',
      icon: 'link',
      label: 'Get Link',
      click: () => (dialogs.showGenerateDialog = true),
    },
    {
      title: 'Toggle fullscreen',
      icon: 'maximize',
      label: 'Fullscreen',
      click: () => emit('fullscreen'),
    },
    {
      title: 'Undo',
      icon: 'undo',
      label: 'Undo',
      click: () => emit('undo'),
      disabled: computed(() => !appStore.treeHistory.canUndo),
    },
    {
      title: 'Redo',
      icon: 'redo',
      label: 'Redo',
      click: () => emit('redo'),
      disabled: computed(() => !appStore.treeHistory.canRedo),
    },
    // convert the string names to actual font awesome props
  ].map((button) => convertToToolbarButtonProps(button, '2x')),
);

const selectionActions = reactive<
  Array<{
    name: string;
    buttons: Array<ToolbarButtonProps>;
  }>
>(
  [
    {
      name: 'Labels',
      buttons: [
        {
          title: 'Show names',
          icon: 'font',
          label: 'Names',
          click: () => emit('displayNames'),
        },
        {
          title: 'Display codes',
          icon: 'italic',
          label: 'Codes',
          click: () => emit('displayCodes'),
        },
        {
          title: 'Randomise visible label',
          icon: 'random',
          label: 'Randomise label',
          click: () => emit('randomizeLabels'),
        },
      ],
    },
    {
      name: 'Parents',
      buttons: [
        {
          title: 'Delete Parents and Ancestors',
          icon: 'minus',
          label: 'Delete Parents',
          click: () => emit('deleteAncestors'),
        },
        {
          title: 'Add parents',
          icon: 'arrow-right',
          label: 'Add parents',
          click: () => emit('addParents'),
        },
        {
          title: 'Switch parents',
          icon: 'sync-alt',
          label: 'switch parents',
          click: () => emit('switchParents'),
        },
      ],
    },
  ].map((group) => ({
    name: group.name,
    buttons: group.buttons.map((button) =>
      convertToToolbarButtonProps(button, '1x'),
    ),
  })),
);
const selectionOptions = reactive<
  { label: string; key: keyof DragonType; criteria: string | number }[]
>([
  { label: 'All with code', key: 'display', criteria: 1 },
  { label: 'All with name', key: 'display', criteria: 0 },
  { label: 'All with placeholder', key: 'breed', criteria: 'Placeholder' },
]);

const dialogs = reactive({
  showImportDialog: false,
  showExportDialog: false,
  showGenerateDialog: false,
});

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
  (e: 'selectCriteria', key: string, value: unknown): void;
  (e: 'selectCriteria', predicate: (dragon: DragonType) => boolean): void;
  (e: 'fullscreen'): void;
  (e: 'undo'): void;
  (e: 'redo'): void;
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
  if (!props.tree || !itemsSelected.value) return [];

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

function convertToToolbarButtonProps(
  button: {
    icon: string;
    label: string;
    click: () => void;
    title: string;
  },
  size: ToolbarButtonProps['icon']['size'] = '2x',
) {
  return {
    ...button,
    title: capitalise(button.title),
    label: capitalise(button.label),
    icon: {
      size: size,
      icon: button.icon,
    },
  } as ToolbarButtonProps;
}

// capitalise the first letter of each word
function capitalise(string: string) {
  return string
    .split(' ')
    .map((substr) => substr[0].toUpperCase() + substr.slice(1))
    .join(' ');
}
</script>

<style scoped>
.toolbar {
  margin: 5px auto;
  max-width: 800px;
}
.settings,
.functions {
  display: grid;
  column-gap: 8px;
  row-gap: 5px;
}
.settings {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 5px;
  margin-bottom: 5px;
  grid-template-columns: repeat(auto-fit, minmax(115px, auto));
}
.settings label {
  padding: 5px;
}
.settings label:hover {
  background: rgba(255, 255, 255, 0.8);
}
.functions {
  grid-template-columns: repeat(auto-fit, minmax(90px, auto));
  justify-content: center;
}
.selection-tools {
  margin: 10px auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}
.selection-tools :deep(.control .label) {
  display: none;
}
.selection-tools :deep(.control) {
  margin: 4px;
  width: 26px;
  height: 26px;
}
[hidden] {
  visibility: hidden;
}
.selection-apply-breed-dropdown {
  max-width: 170px;
}

@media only screen and (min-width: 768px) {
}
@media only screen and (min-width: 470px) {
}
</style>
