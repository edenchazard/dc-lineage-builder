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
      <TileButton
        v-if="nodesFromRoot === 0"
        class="tile-button-left tile-button-add-desc"
        title="Add descendant"
        icon="arrow-left"
        @click="addDescendant"
      />
      <TileButton
        v-if="nodesFromRoot > 0"
        class="tile-button-left tile-button-remove-desc"
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
        class="dragon-breed-picker-button pointer"
        :disabled="disabled"
        type="button"
      >
        <DragonPortrait
          :data="getImage"
          :class="{
            selected: data.selected,
          }"
        />
      </button>
      <FontAwesomeIcon
        icon="warning"
        :class="{ visible: problems.length > 0 }"
        class="label-warning"
        :title="problems"
        :aria-label="problems"
      />
      <TileButton
        v-if="hasAncestry"
        class="tile-button-right"
        title="Remove ancestors"
        icon="minus"
        @click="deleteAncestors"
      />
      <TileButton
        v-else
        class="tile-button-right"
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
      <div class="tile-bottom-controls tile-button-group">
        <TileButton
          v-if="nodesFromRoot === 0 && data.gender === 'm'"
          title="Switch gender to female"
          icon="mars"
          @click="switchGender"
        />
        <TileButton
          v-else-if="nodesFromRoot === 0 && data.gender === 'f'"
          title="Switch gender to male"
          icon="venus"
          @click="switchGender"
        />
        <TileButton
          class="switchLabel"
          title="Switch label"
          icon="font"
          @click="switchLabel"
        />
        <TileButton
          v-if="hasAncestry"
          title="Copy ancestors"
          icon="clone"
          @click="copyBranch"
        />
        <TileButton
          title="Paste ancestors"
          icon="paste"
          @click="pasteBranch"
        />
      </div>
    </div>
    <ul
      v-if="hasAncestry"
      class="tile-parents"
    >
      <Dragon
        :data="data.parents.m as DragonTypeWithMetadata"
        :nodes-from-root="nodesFromRoot + 1"
        :disabled="disabled"
      />
      <Dragon
        :data="data.parents.f as DragonTypeWithMetadata"
        :nodes-from-root="nodesFromRoot + 1"
        :disabled="disabled"
      />
    </ul>
  </li>
</template>

<script setup lang="ts">
/* eslint-disable vue/no-mutating-props */
import { computed, ref } from 'vue';
import type { PropType } from 'vue';
import vOnLongPress from '../../../directives/long-press/vue-3-long-press';
import type {
  BreedEntry,
  DragonParents,
  DragonTypeWithMetadata,
  PartialLineageWithMetadata,
  PortraitData,
} from '../../../app/types';
import GLOBALS from '../../../app/globals';
import {
  getBreedData,
  getTable,
  breedEntryToPortrait,
  expandGender,
  hasParents,
} from '../../../app/utils';
import { useAppStore } from '../../../store/app';
import DragonLabel from './DragonLabel.vue';
import BreedSelector from '../../BreedSelector/BreedSelector.vue';
import DragonPortrait from './DragonPortrait.vue';
import TileButton from './TileButton.vue';
import { Lineage } from '../../../app/lineageHandler';
import { DragonBuilder } from '../../../app/dragonBuilder';
import { validateCode, validateName } from '../../../app/validation';

const props = defineProps({
  // Dragon properties
  data: {
    type: Object as PropType<PartialLineageWithMetadata>,
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

const problems = computed(() => {
  const errs = [];

  if (!validateName(props.data.name)) {
    errs.push('Name is invalid.');
  }

  if (!validateCode(props.data.code)) {
    errs.push('Code is invalid.');
  }

  return errs.join('');
});

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

  const raw = Lineage(props.data).raw();

  if (!hasParents(raw)) return;
  ls.setItem(
    'clipboard',
    JSON.stringify({
      m: Lineage(raw.parents.m).withoutMetadata(),
      f: Lineage(raw.parents.f).withoutMetadata(),
    }),
  );
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
  props.data.parents = {
    m: DragonBuilder.createWithMetadata({ gender: 'm' }),
    f: DragonBuilder.createWithMetadata({ gender: 'f' }),
  };
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

<style scoped lang="postcss">
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

    > .tile-button-left,
    > .tile-button-right {
      position: absolute;
    }

    > .tile-bottom-controls {
      width: 120px;
    }
    /* position the controls left and right of the tile */
    > .tile-button-right {
      margin-top: 10px;
      right: 5px;
    }

    > .tile-button-left {
      margin-top: 10px;
      left: 6px;
    }
  }

  > .tile,
  > .tile-parents {
    display: table-cell;
    vertical-align: middle;
  }
}
.dragon-breed-picker-button {
  padding: 0;
  border: 0;
  background: transparent;
}
.selected {
  background: var(--ui-builder-tile-selected-bg);
  outline: var(--ui-builder-tile-selected-outline);
  outline-offset: 2px;
}

.label-warning {
  position: absolute;
  color: var(--ui-builder-tile-label-warning);
  padding: 3px;
  border-radius: 50%;
  width: 13px;
  height: 13px;
  border: 1px solid var(--ui-builder-tile-label-warning);
  opacity: 0;
  z-index: -1;
  margin-top: -10px;
  right: 28px;
}
.visible {
  animation: scale 0.5s ease-in forwards;
}

@keyframes scale {
  0% {
    transform: scale(0);
    z-index: 2;
  }

  100% {
    transform: scale(1);
    transform-origin: bottom left;
    opacity: 1;
    z-index: 3;
  }
}
</style>
