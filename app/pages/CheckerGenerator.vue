<template>
  <DialogExport
    v-if="showExportDialog"
    :tree="tree"
    @close="showExportDialog = false"
  />
  <DialogGenerate
    v-if="showGenerateDialog"
    :tree="tree"
    @close="showGenerateDialog = false"
  />

  <div class="constrain-width content">
    <div class="content-limit">
      <section>
        <h1>Checker Generator</h1>
        <p>
          On this page you can build checkers quickly. Simply select how many
          generations you want it to be, the male breed (top) and the female
          breed (bottom).
        </p>
        <p>You can then export it and import it for use with the editor.</p>
      </section>
    </div>
    <div>
      <section
        id="checker-controls"
        class="content-limit"
      >
        <form
          id="form"
          class="form"
        >
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
          <fieldset id="filter">
            <legend class="legend">Search and filter</legend>
            <div
              id="filter-controls"
              class="form"
            >
              <label for="enabled-groups">Groups:</label>
              <BreedGroupsTagSelector id="enabled-groups" />
              <label for="enabled-tags">Showing:</label>
              <BreedTagsSelector id="enabled-tags" />
              <label for="search">Search: </label>
              <BreedSearchControl
                id="search"
                class="interactive pointer"
                placeholder="Search breeds"
                @update="(search: string) => (query = search)"
              />
            </div>
          </fieldset>
          <div id="controls">
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
        </form>
      </section>
      <section id="breeds">
        <FilteredBreedList
          :search="query"
          :breeds="malePortraits"
          :tags="tagStore.enabledTags"
          :groups="tagStore.enabledEggGroups"
          class="results"
          @breed-selected="selectMale"
        />
        <div id="mini-preview">
          <DragonPortrait
            :data="male"
            class="tile"
          />
          <label>Male breed</label>
          <DragonPortrait
            :data="male"
            class="tile"
          />
          <label>Female breed</label>
        </div>
        <FilteredBreedList
          :search="query"
          :breeds="femalePortraits"
          :tags="tagStore.enabledTags"
          :groups="tagStore.enabledEggGroups"
          class="results"
          @breed-selected="selectFemale"
        />
      </section>
      <section>
        <Lineage
          v-if="tree !== null"
          :root="tree"
          :config="{ showInterface: false, showLabels: true, disabled: true }"
        />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { PortraitData, DragonGender, BreedEntry } from '../shared/types';
import {
  breedEntryToPortrait,
  expandGender,
  getBreedData,
} from '../shared/utils.js';
import { useTagStore } from '../store/useTagStore.js';

import Lineage from '../components/Lineage.vue';
import FilteredBreedList from '../components/FilteredBreedList.vue';
import BreedTagsSelector from '../components/BreedTagsSelector.vue';
import BreedGroupsTagSelector from '../components/BreedGroupsTagSelector.vue';
import DialogExport from '../components/DialogExport.vue';
import DialogGenerate from '../components/DialogGenerate.vue';
import ToolbarButton from '../components/ToolbarButton.vue';
import BreedSearchControl from '../components/BreedSearchControl.vue';
import DragonPortrait from '../components/DragonPortrait.vue';
import { DragonBuilder } from '../shared/dragonBuilder.js';
import {
  femalePortraits,
  malePortraits,
  placeholder,
} from '../shared/breeds.js';

const tree = ref(DragonBuilder.createWithMetadata());
const tagStore = useTagStore();
const maleBreed = ref(placeholder.name);
const hoverMaleBreed = ref(placeholder.name);
const femaleBreed = ref(placeholder.name);
const genCount = ref(2);
const query = ref('');
const showExportDialog = ref(false);
const showGenerateDialog = ref(false);

function portraitFor(which, gender: DragonGender) {
  // return the breed data for this breed name or if no match, the placeholder
  const entry = getBreedData(which) as BreedEntry;
  const portrait = breedEntryToPortrait(entry, expandGender(gender));

  return portrait;
}

const male = computed(() => portraitFor(hoverMaleBreed.value, 'm'));

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
.content {
  display: flex;
  flex-direction: column;
}
#form {
  --label-width: 8rem;
  display: grid;
  column-gap: 1rem;
  grid-template-columns: var(--label-width) 1fr 1fr;
  align-items: center;
}

#filter {
  grid-column: 1/3;
  border-top: 1px solid;
}

#filter-controls {
  display: grid;
  grid-template-columns: var(--label-width) 1fr;
  column-gap: 1rem;
}

#filter .legend {
  font-weight: bold;
  padding-right: 1rem;
}

#controls {
  grid-row: 1/3;
  display: grid;
  grid-auto-columns: min-content;
  grid-column-start: 3;
}

#breeds {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

#mini-preview {
  align-self: center;
  text-align: center;
}
.tile {
  margin: 0 auto;
}
.breed-list {
}
.results {
  min-height: 15rem;
  width: 100%;
  max-width: 40rem;
  flex: 1;
}

@media (min-width: 62.5em) {
  #breeds {
    flex-direction: row;
  }
}
</style>
