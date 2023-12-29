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
              <div class="tag-list">
                <BreedTagListGroups
                  id="enabled-groups"
                  name="filters-groups"
                />
              </div>
              <label for="enabled-tags">Showing:</label>
              <div class="tag-list">
                <BreedTagListTags
                  id="enabled-tags"
                  name="filters-tags"
                />
              </div>
              <label for="search">Search: </label>
              <BreedSearch
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
        <div class="gender">
          <h2>Male</h2>
          <BreedListFiltered
            :search="query"
            :breeds="malePortraits"
            :tags="tagStore.enabledTags"
            :groups="tagStore.enabledEggGroups"
            class="results"
            @breed-selected="selectMale"
          />
        </div>
        <div class="gender">
          <h2>Female</h2>
          <BreedListFiltered
            :search="query"
            :breeds="femalePortraits"
            :tags="tagStore.enabledTags"
            :groups="tagStore.enabledEggGroups"
            class="results"
            @breed-selected="selectFemale"
          />
        </div>
      </section>
      <section>
        <LineageView
          v-if="tree !== null"
          :root="tree"
          :config="{ showInterface: false, showLabels: true, disabled: true }"
        />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { PortraitData, DragonGender } from '../shared/types';
import { getBreedData } from '../shared/utils.js';
import { useTagStore } from '../store/useTagStore.js';

import LineageView from '../components/LineageView.vue';
import BreedListFiltered from '../components/BreedListFiltered.vue';
import BreedTagListTags from '../components/BreedTagListTags.vue';
import BreedTagListGroups from '../components/BreedTagListGroups.vue';
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

const tree = ref(DragonBuilder.createWithMetadata());
const tagStore = useTagStore();
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
section + section {
  margin-top: 1rem;
}
.content {
  display: flex;
  flex-direction: column;
}

#form {
  --label-width: 8rem;
  display: flex;
  flex-direction: column;
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
  gap: 0.5rem 1rem;
}

#filter .legend {
  font-weight: bold;
  padding-right: 1rem;
}

.tag-list {
  line-height: 1.2rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.25rem 0.5rem;
}

#controls {
  grid-row: 1/3;
  display: flex;
  grid-auto-columns: min-content;
  grid-column-start: 3;
}

#breeds {
  gap: 1rem;
  display: flex;
  flex: 1;
}

.gender {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.gender h2 {
  font-size: 1.5rem;
  text-align: center;
}

.tile {
  margin: 0 auto;
}

.results {
  min-height: 15rem;
  width: 100%;
}
/* todo */
:deep(#controls) {
  & .label::after {
    content: unset;
  }
}
@media (min-width: 40rem) {
  #form {
    display: grid;
  }
  #controls {
    display: grid;
  }
}
</style>
