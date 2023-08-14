<template>
  <DialogExport
    v-if="dialogs.showExportDialog"
    :tree="tree"
    @close="dialogs.showExportDialog = false"
  />
  <DialogImport
    v-if="dialogs.showImportDialog"
    @close="dialogs.showImportDialog = false"
    @on-import="importLineage"
  />
  <DialogGenerate
    v-if="dialogs.showGenerateDialog"
    :tree="tree"
    @close="dialogs.showGenerateDialog = false"
  />
  <div
    ref="toolbar"
    class="toolbar"
    role="toolbar"
    v-bind="$attrs"
  >
    <div
      class="settings"
      aria-label="Settings toolbar"
    >
      <input
        id="show-interface"
        v-model="config.showInterface"
        class="item"
        type="checkbox"
      />
      <label for="show-interface">Show interface </label>
      <input
        id="show-labels"
        v-model="config.showLabels"
        class="item"
        type="checkbox"
      />
      <label for="show-labels">Show labels </label>
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
      ref="selectionTools"
      class="selection-tools"
      :class="{
        'full-width': hideSelectionToolsNavButtons,
      }"
      aria-label="Selection toolbar"
    >
      <button
        class="selection-nav left"
        :class="{
          invisible: hideSelectionToolsNavButtons,
        }"
        type="button"
        title="Scroll to start"
        @click="handleScrollLeft"
      />
      <div
        ref="selectionToolsScrollArea"
        class="selection-scrollable"
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
        <ToolbarGroup>
          <div class="selection-apply-breed-container">
            <select
              ref="breedSelector"
              v-model="selectedBreed"
              title="Apply selected breed"
              class="breed-dropdown"
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
            <span
              title="Dragons selected"
              class="count"
              @click="breedSelector?.focus()"
              >{{ itemsSelected }}</span
            >
          </div>
          <template #legend>Breed</template>
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
      </div>
      <button
        class="selection-nav right"
        type="button"
        title="Scroll to end"
        :class="{
          invisible: hideSelectionToolsNavButtons,
        }"
        @click="handleScrollRight"
      />
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
import DialogExport from './DialogExport.vue';
import DialogImport from './DialogImport.vue';
import DialogGenerate from './DialogGenerate.vue';
import ToolbarButton from './ToolbarButton.vue';
import ToolbarDropDownMenu from './ToolbarDropDownMenu/ToolbarDropDownMenu.vue';
import ToolbarDropDownMenuItem from './ToolbarDropDownMenu/ToolbarDropDownMenuItem.vue';
import ToolbarGroup from './ToolbarGroup.vue';
import { useTagStore } from '../../store/tags';
import { useResizeObserver } from '@vueuse/core';

type ToolbarButtonProps = Required<
  Pick<InstanceType<typeof ToolbarButton>['$props'], 'icon' | 'label'> & {
    click: () => void;
  } //todo why! & Partial<ButtonHTMLAttributes>
>;

const tagStore = useTagStore();
const appStore = useAppStore();

const toolbar = ref();
const breedSelector = ref();
const selectionTools = ref();
const selectionToolsScrollArea = ref();
const hideSelectionToolsNavButtons = ref(false);

// determine whether to show the scroll buttons for the selection
// tools section
useResizeObserver(selectionTools, (entries) => {
  const entry = entries[0];
  hideSelectionToolsNavButtons.value =
    entry.contentRect.width >= selectionToolsScrollArea.value.scrollWidth;
});

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
    {
      title: 'Settings',
      icon: 'cog',
      label: 'Settings',
      click: () => emit('redo'),
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

function handleScrollLeft() {
  selectionToolsScrollArea.value.scrollLeft = 0;
}

function handleScrollRight() {
  selectionToolsScrollArea.value.scrollLeft =
    selectionToolsScrollArea.value.scrollWidth;
}
</script>

<style scoped>
.invisible {
  display: none;
  grid-template-columns: 1fr;
}

:deep(.control > .label) {
  display: none;
}

.toolbar {
  user-select: none;
  box-sizing: border-box;
  align-self: center;
  min-width: 100%;
  padding: 0;
  background: var(--ui-builder-toolbar-bg);
  border-radius: 0;
  max-width: fit-content;
  display: grid;
  grid-template-areas:
    'functions'
    'selection';
  grid-template-columns: 1fr;
  grid-template-rows: auto auto;
}

.selection-apply-breed-container {
  position: relative;

  > .breed-dropdown {
    padding-right: 2.5rem;
    width: 10rem;
  }

  > .count {
    background: var(--ui-builder-toolbar-selection-count-bg);
    color: var(--ui-builder-toolbar-selection-count-fg);
    display: block;
    text-align: center;
    position: absolute;
    font-size: 0.7em;
    right: 1.1rem;
    top: 3px;
    bottom: 3px;
    width: 2.7em;
    overflow: hidden;
    border-radius: 0.25rem;
    text-overflow: ellipsis;
  }
}

.functions {
  grid-area: functions;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(1.3rem, 1fr));
  grid-template-rows: repeat(auto-fit, minmax(1.3rem, 1fr));
  gap: 0.5rem;
}

.settings {
  grid-area: settings;
  display: none;
}

.selection-tools {
  grid-area: selection;
  padding: 0.25rem 0;
  display: grid;
  gap: 0.25rem;
  grid-template-columns: auto 1fr auto;
  overflow: hidden;
  box-shadow:
    inset 0 7px 14px -15px var(--ui-builder-toolbar-selection-shadows),
    inset 0 -7px 14px -15px var(--ui-builder-toolbar-selection-shadows);

  > .selection-nav {
    padding: 0.3rem;
    margin: 0;
    border: 0;
    position: relative;
    z-index: 10;
    width: 0.5rem;
    border-radius: 0;
    background: var(--ui-builder-toolbar-selection-scrolls);
    box-shadow: 16px 0 18px -20px var(--ui-builder-toolbar-selection-shadows);

    &.left {
      box-shadow: 0 0 13px -4px var(--ui-builder-toolbar-selection-shadows);
      border-radius: 0 0.5rem 0.5rem 0;
    }

    &.right {
      box-shadow: -1px 0 13px -4px var(--ui-builder-toolbar-selection-shadows);
      border-radius: 0.5rem 0 0 0.5rem;
    }
  }

  > .selection-scrollable {
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    gap: 0.5rem;
    scroll-behavior: smooth;

    & :deep(.control) {
      min-width: 2rem;
      aspect-ratio: 1;
      justify-content: center;
    }

    & :deep(.legend) {
      display: none;
    }
  }

  & :deep(.group) {
    justify-content: center;
    border: var(--ui-builder-toolbar-selection-group-border);
    border-radius: 0.25rem;
    padding: 0 0.25rem;
  }

  &.full-width {
    grid-template-columns: 1fr;
    padding: 0;

    & :deep(.legend) {
      display: block;
    }
  }
}

@media (min-width: 445px) {
  .functions :deep(.label) {
    display: block;
  }
}

@media (min-width: 600px) {
  .toolbar {
    border-radius: 0.25rem;
  }

  .selection-tools {
    box-shadow: inset 0 7px 14px -15px var(--ui-builder-toolbar-selection-shadows);

    :deep(.group) {
      justify-content: space-between;
      border: 0 none;
      border-radius: 0;
      padding: 0;
    }
  }
}

@media (min-width: 690px) {
  .toolbar {
    --padding: 0.5rem;
    min-width: 690px;
    gap: 0.5rem;
    grid-template-columns: minmax(0, 10rem) 1fr;
    grid-template-rows: 1fr auto;
    grid-template-areas:
      'settings functions'
      'selection selection';
    padding-top: var(--padding);
  }
  .settings {
    display: grid;
    align-items: center;
    grid-template-rows: repeat(auto-fit, minmax(0, 2rem));
    grid-template-columns: 1.5rem 1fr;
    padding-left: var(--padding);
  }
  .functions {
    align-items: center;
    padding-right: var(--padding);

    & [title='Settings'] {
      display: none;
    }
  }
}
</style>
