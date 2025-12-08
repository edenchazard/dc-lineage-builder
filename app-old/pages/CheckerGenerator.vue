<template>
  <DialogExport
    id="Export lineage"
    :open="showExportDialog"
    :tree="tree"
    @close="showExportDialog = false"
  />
  <DialogGenerate
    id="Generate lineage"
    :open="showGenerateDialog"
    :tree="tree"
    @close="showGenerateDialog = false"
  />
  <div id="dialogs"></div>

  <section class="constrain-width section">
    <div class="content-limit">
      <h1>Checker Generator</h1>
      <p>
        On this page you can build checkers quickly. Simply select how many
        generations you want it to be, the male breed (top) and the female breed
        (bottom).
      </p>
      <p>You can then export it and import it for use with the editor.</p>
    </div>
  </section>
  <div>
    <div
      role="toolbar"
      class="section"
    >
      <form
        id="checker-toolbar"
        class="form constrain-width content-limit"
        @submit.prevent
      >
        <div id="checker-toolbar-top">
          <div id="section-2">
            <ToolbarButton
              title="Get Link"
              :icon="{ icon: 'link', size: '2x' }"
              label="Get Link"
              @click="showGenerateDialog = true"
            />
            <ToolbarButton
              title="Export dragon"
              :icon="{ icon: 'save', size: '2x' }"
              label="Export"
              @click="showExportDialog = true"
            />
            <ToolbarButton
              title="Switch breeds"
              :icon="{ icon: 'exchange-alt', size: '2x' }"
              label="Switch breeds"
              @click="switchBreeds"
            />
          </div>
          <div id="section-1">
            <label for="generations">Generations: </label>
            <select
              id="generations"
              v-model="genCount"
              title="Generations"
              class="interactive pointer"
            >
              <option
                v-for="index in 6"
                :key="index"
                :value="index + 1"
              >
                {{ index + 1 }}
              </option>
            </select>
          </div>
        </div>

        <div id="checker-toolbar-bottom">
          <div
            id="filter-controls"
            class="tag-list"
          >
            <label for="search">Search:</label>
            <BreedSearch
              id="search"
              v-model="query"
            />
            <label for="applied-filters">Filters:</label>
            <BreedListFilterDropdown
              id="applied-filters"
              container="#filter-controls"
            />
          </div>
        </div>
      </form>
    </div>
    <div
      id="breeds"
      class="section"
    >
      <section class="gender">
        <h2
          id="males"
          tabindex="0"
        >
          Male
        </h2>
        <BreedListFiltered
          id="males"
          aria-labelledby="males"
          :tags="chosenTags"
          :search="query"
          :breeds="malePortraits"
          class="results"
          @breed-selected="selectMale"
        />
      </section>
      <section class="gender">
        <h2
          id="females"
          tabindex="0"
        >
          Female
        </h2>
        <BreedListFiltered
          id="females"
          aria-labelledby="females"
          :search="query"
          :breeds="femalePortraits"
          class="results"
          :tags="chosenTags"
          @breed-selected="selectFemale"
        />
      </section>
    </div>
  </div>
  <LineageView
    v-if="tree !== null"
    id="lineage-wrapper"
    :root="tree"
    :config="{ showInterface: false, showLabels: true, disabled: true }"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { PortraitData, DragonGender } from '../shared/types';
import { getBreedData } from '../shared/utils.js';

import LineageView from '../components/LineageView.vue';
import BreedListFiltered from '../components/BreedListFiltered.vue';
import DialogExport from '../components/DialogExport.vue';
import DialogGenerate from '../components/DialogGenerate.vue';
import ToolbarButton from '../components/ToolbarButton.vue';
import BreedSearch from '../components/BreedSearch.vue';
import { DragonBuilder } from '../shared/dragonBuilder.js';
import {
  femalePortraits,
  malePortraits,
  placeholder,
} from '../shared/breeds.js';
import { chosenTags } from '../store/useTagStore';
import BreedListFilterDropdown from '../components/BreedListFilterDropdown.vue';

const tree = ref(DragonBuilder.createWithMetadata());
const maleBreed = ref(placeholder.name);
const femaleBreed = ref(placeholder.name);
const genCount = ref(2);
const query = ref('');
const showExportDialog = ref(false);
const showGenerateDialog = ref(false);

// whenever the gen count changes, the tree should update to reflect it
watch(genCount, () => updateTree(tree.value.gender));

function selectMale(breed: PortraitData) {
  maleBreed.value = breed.name;
  updateTree('m');
}

function selectFemale(breed: PortraitData) {
  femaleBreed.value = breed.name;
  updateTree('f');
}

function updateTree(finalGenGender?: DragonGender) {
  const createParents = (gen: number) => {
    const branch = {
      m: DragonBuilder.createWithMetadata({
        gender: 'm',
        breed: maleBreed.value,
      }),
      f: DragonBuilder.createWithMetadata({
        gender: 'f',
        breed: femaleBreed.value,
      }),
    };

    if (gen < genCount.value) {
      branch.m.parents = createParents(gen + 1);
      branch.f.parents = createParents(gen + 1);
    }
    return branch;
  };

  // The breed and gender of the final dragon (meaning) the highest gen
  // should always be the last selected
  const final: { gender: DragonGender; breed: string } =
    finalGenGender === 'f'
      ? { gender: 'f', breed: femaleBreed.value }
      : // defaults to male
        { gender: 'm', breed: maleBreed.value };

  // update our tree
  tree.value = DragonBuilder.createWithMetadata({
    ...final,
    parents: createParents(2),
  });
}

function switchBreeds() {
  // Check that the breed can be gender flipped
  // or should be replaced with the placeholder
  const [newFemale, newMale] = [maleBreed, femaleBreed].map((breed) =>
    getBreedData(breed.value)?.genderOnly ? placeholder.name : breed.value,
  );

  maleBreed.value = newMale;
  femaleBreed.value = newFemale;
  updateTree(tree.value.gender);
}
</script>
<style scoped>
.section + .section {
  margin-top: 1rem;
}

.content {
  display: flex;
  flex-direction: column;
}
#checker-toolbar {
  background: var(--ui-builder-toolbar-bg);
  color: var(--ui-builder-toolbar-button-fg);
  padding: 0.5rem;
  border-radius: 0;
  overflow: hidden;
  margin: 1rem auto;
}
#form {
  --label-width: 8rem;
  display: flex;
  flex-direction: column;
  column-gap: 1rem;
}
#checker-toolbar-top {
  display: flex;
  justify-content: center;
  flex-direction: column;
}
#checker-toolbar-bottom {
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
}
#section-1 {
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
}
#generations {
  width: 100%;
  min-width: 8rem;
}

#filter-controls {
  width: 100%;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.5rem;
}

#section-3 {
  display: flex;
  flex-direction: column;
  gap: 0.5rem 1rem;
}
#section-3-1 {
  display: flex;
  gap: 0.5rem 1rem;
  align-items: center;
}
#section-3-2 {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.legend {
  text-align: center;
  font-weight: bold;
}

#section-2 {
  display: flex;
}

#breeds {
  display: flex;
}

.gender {
  width: 50%;
}

.gender h2 {
  font-size: 1.5rem;
  text-align: center;
}

.tile {
  margin: 0 auto;
}

.results {
  width: 100%;
  height: 20rem;
}
#lineage {
  margin-top: 1rem;
  flex: 1;
}
:deep(#checker-toolbar) {
  & .label::after {
    content: unset;
  }
}

@media (min-width: 33rem) {
  #checker-toolbar-top {
    justify-content: space-between;
    flex-direction: row;
  }
}
</style>
