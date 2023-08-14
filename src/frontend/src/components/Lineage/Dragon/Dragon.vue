<template>
  <li class="tile-container">
    <BreedSelector
      v-if="showBreedSelector"
      :breeds="availableMates"
      :gender-filter="data.gender"
      @breed-selected="changeBreed"
      @close="showBreedSelector = false"
    />
    <div class="tile">
      <DragonButton
        v-if="nodesFromRoot === 0"
        class="tile-control-left"
        title="Add descendant"
        icon="arrow-left"
        @click="addDescendant"
      />
      <DragonButton
        v-if="nodesFromRoot > 0"
        class="tile-control-left tile-control-remove-desc"
        title="Remove descendants"
        icon="cut"
        @click="removeDescendants"
      />
      <button
        v-on-long-press="{
          wait: 300,
          onClick: handleClick,
          onLongPress: handleLongPress,
        }"
        class="dragon-breed-picker-button"
        :disabled="disabled"
        :class="{
          active: !disabled,
          disabled: disabled,
          selected: data.selected,
        }"
        type="button"
      >
        <DragonPortrait
          class="portrait"
          :data="getImage"
        />
      </button>
      <DragonButton
        v-if="hasAncestry"
        class="tile-control-right"
        title="Remove ancestors"
        icon="minus"
        @click="deleteAncestors"
      />
      <DragonButton
        v-if="!hasAncestry"
        class="tile-control-right"
        title="Add ancestors"
        icon="arrow-right"
        @click="addAncestors"
      />
      <DragonLabel
        :value="data.display === 1 ? data.code : data.name"
        :display="data.display"
        :disabled="disabled"
        @changed="labelChanged"
      />
      <div class="tile-bottom-controls">
        <DragonButton
          v-if="nodesFromRoot === 0 && data.gender === 'm'"
          title="Switch gender to female"
          icon="mars"
          @click="switchGender"
        />
        <DragonButton
          v-else-if="nodesFromRoot === 0 && data.gender === 'f'"
          title="Switch gender to male"
          icon="venus"
          @click="switchGender"
        />
        <DragonButton
          class="switchLabel"
          title="Switch label"
          icon="font"
          @click="switchLabel"
        />
        <DragonButton
          v-if="hasAncestry"
          title="Copy ancestors"
          icon="clone"
          @click="copyBranch"
        />
        <DragonButton
          title="Paste ancestors"
          icon="paste"
          @click="pasteBranch"
        />
        <DragonButton
          v-if="hasAncestry"
          class="tile-control-right2"
          title="Switch parents"
          icon="sync-alt"
          @click="swapParents"
        />
      </div>
    </div>
    <ul
      v-if="hasAncestry"
      class="tile-parents"
    >
      <Dragon
        :data="data.parents.m"
        :nodes-from-root="nodesFromRoot + 1"
        :disabled="disabled"
      />
      <Dragon
        :data="data.parents.f"
        :nodes-from-root="nodesFromRoot + 1"
        :disabled="disabled"
      />
    </ul>
  </li>
</template>

<script setup lang="ts">
/* eslint-disable vue/no-mutating-props */
import { computed, PropType, ref } from 'vue';
import vOnLongPress from '../../../directives/long-press/vue-3-long-press';
import GLOBALS from '../../../app/globals';
import {
  getBreedData,
  deepClone,
  forEveryDragon,
  getTable,
  breedEntryToPortrait,
  expandGender,
  hasParents,
} from '../../../app/utils';
import {
  switchParents,
  createDragonProperties,
} from '../../../app/dragonBuilder';
import { useAppStore } from '../../../store/app';

import DragonLabel from './DragonLabel.vue';
import BreedSelector from '../../BreedSelector/BreedSelector.vue';
import DragonPortrait from './DragonPortrait.vue';
import DragonButton from './DragonButton.vue';
import {
  BreedEntry,
  DragonParents,
  DragonType,
  PortraitData,
} from '../../../app/types';

const props = defineProps({
  // Dragon properties
  data: {
    type: Object as PropType<DragonType>,
    required: true,
  },
  // Whether to disable the click
  disabled: {
    type: Boolean,
    default: true,
    required: false,
  },
  // How many gens is this?
  nodesFromRoot: {
    type: Number,
    required: true,
  },
});

const ls = localStorage;
const appStore = useAppStore();
const showBreedSelector = ref(false);

const hasAncestry = computed(() => hasParents(props.data));

const availableMates = computed(() => getTable(props.data.gender));

const getImage = computed(() => {
  // return the breed data for this breed name or if no match, the placeholder
  const entry = getBreedData(props.data.breed) as BreedEntry;
  const portrait = breedEntryToPortrait(entry, expandGender(props.data.gender));

  return portrait;
});

function swapParents() {
  props.data.parents = switchParents(props.data.parents);
}

function switchGender() {
  const invertedGender = props.data.gender === 'f' ? 'm' : 'f';

  // Handle placeholder
  if (props.data.breed === 'Placeholder') {
    props.data.gender = invertedGender;
    props.data.breed = GLOBALS.placeholder.name;
  }
  // Handling a non-placeholder
  else {
    // First, check that the current breed can be gender flipped
    const entry = getBreedData(props.data.breed);

    if (!entry) return;

    if (!entry.genderOnly) {
      // This breed has both male and female genders, so flipping isn't an issue.
      props.data.gender = invertedGender;
    } else {
      // It doesn't. Replace with opposite gender and put in the placeholder.
      props.data.gender = invertedGender;
      props.data.breed = GLOBALS.placeholder.name;
    }
  }
}

// todo type this
function changeBreed(e: PortraitData) {
  showBreedSelector.value = false;

  // update the breed
  props.data.breed = e.name;
}

function pasteBranch() {
  const clipboard = ls.getItem('clipboard');

  // check there's data available
  // todo add an integrity check
  // no data... do nothing
  if (clipboard === null) return;

  // insert the new branch
  // Todo type this
  props.data.parents = JSON.parse(clipboard);
}

function copyBranch() {
  // Do nothing if no parents
  if (!hasAncestry.value) return;

  const noSelect = deepClone({ parents: props.data.parents });

  // We have to make sure we deselect all of them, or they'll
  // be copied as selected lol
  const cb = (dragon: DragonType) => (dragon.selected = false);
  forEveryDragon(noSelect.parents!.f, cb);
  forEveryDragon(noSelect.parents!.m, cb);

  ls.setItem('clipboard', JSON.stringify({ ...noSelect.parents }));
}

// this is a bit stupid. basically, we have to make a new root node
// for the parent with all the properties of this node
function removeDescendants() {
  appStore.activeTree = props.data;
}

function addDescendant() {
  appStore.addDescendant();
}

// adds a new node to the tree
function addAncestors() {
  const parents: DragonParents = {
    m: createDragonProperties({ gender: 'm' }),
    f: createDragonProperties({ gender: 'f' }),
  };
  props.data.parents = parents;
}

// deletes this node and ancestors
function deleteAncestors() {
  props.data.parents = {};
}

function labelChanged(value: string) {
  const attr = props.data.display === 1 ? 'code' : 'name';
  props.data[attr] = value;
}

function switchLabel() {
  props.data.display = props.data.display === 1 ? 0 : 1;
}

function handleLongPress() {
  if (appStore.selectionCount === 0) {
    if (!props.data.selected) {
      props.data.selected = true;
    }
  } else {
    props.data.selected = !props.data.selected;
  }
}

function handleClick() {
  // if selection mode is active, we should add to the selection
  if (appStore.selectionCount > 0) {
    props.data.selected = !props.data.selected;
  } else {
    showBreedSelector.value = true;
  }
}
</script>

<style lang="postcss">
.tile-container,
.tile-parents {
  padding: 0;
  margin: 0;
}

.tile-container {
  position: relative;
  list-style-type: none;
  border-spacing: 1px;
  border-collapse: collapse;

  &:first-child::before,
  &:last-child::after {
    border-width: 0;
  }

  &::before,
  &::after {
    content: '';
    display: block;
    width: 24px;
    position: absolute;
    height: 50%;
    left: 0;
    border-left: var(--dc-lineage-line-width) var(--dc-lineage-line-style)
      var(--dc-lineage-line-colour);
  }
  &::before {
    bottom: calc(50% + 12px);
    border-bottom: var(--dc-lineage-line-width) var(--dc-lineage-line-style)
      var(--dc-lineage-line-colour);
  }
  &::after {
    top: calc(50% - 14px);
    bottom: auto;
    border-bottom: 0 none;
    border-top: var(--dc-lineage-line-width) var(--dc-lineage-line-style)
      var(--dc-lineage-line-colour);
  }

  &:last-child > * {
    padding-bottom: 0px;
  }
  &:first-child > * {
    padding-top: 0px;
  }

  > .tile {
    text-align: center;
    position: relative;
    padding: 0 4px;
    box-sizing: border-box;
    /* prevents the tile-container ::after line from
    obscuring button click area */
    z-index: 1;

    &::after {
      content: '';
      position: absolute;
      top: calc(50% - 12px);
      right: 0;
      border-top: var(--dc-lineage-line-width) var(--dc-lineage-line-style)
        var(--dc-lineage-line-colour);
      width: 24px;
      height: 0;
    }
    &:only-child::after {
      display: none;
    }

    > .tile-control-left,
    > .tile-control-right {
      position: absolute;
    }

    > .tile-bottom-controls {
      width: 120px;
    }
    /* position the controls left and right of the tile */
    > .tile-control-right {
      margin-top: 10px;
      margin-left: 15px;
    }

    > .tile-control-left {
      margin-left: -42px;
      margin-top: 10px;
    }
  }

  > .tile,
  > .tile-parents {
    display: table-cell;
    vertical-align: middle;
  }
}
/* end of dc styling */
.dragon-breed-picker-button {
  padding: 0;
  border: 0;
  background: transparent;
}
.active {
  cursor: pointer;
}

.portrait {
  &.selected {
    background: var(--ui-builder-tile-selected-bg);
  }
}
</style>
<style lang="postcss">
.lineage-view {
  &[data-show-editor-interface='false'] .control {
    display: none;
  }

  &[data-show-editor-interface='true'] {
    .tile-container > .tile::after {
      display: none;
    }
  }

  &[data-show-labels='false'] {
    .dragon-label {
      display: none;
    }
  }
}
</style>
