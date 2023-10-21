<template>
  <div>
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

    <div class="central-block">
      <section>
        <h2>Checker Generator</h2>
        <p>
          On this page you can build checkers quickly. Simply select the male
          breed (top), the female breed (bottom) and how many generations you
          want it to be. You can then export it and import it for use with the
          editor.
        </p>
      </section>
      <section id="checker-controls">
        <div class="left">
          <div class="applied-tags">
            <label>Groups:</label>
            <BreedGroupsTagSelector />
          </div>
          <div class="applied-tags">
            <label>Showing:</label>
            <BreedTagsSelector />
          </div>
          <div>
            <label for="search">Search: </label>
            <BreedSearchControl
              id="search"
              placeholder="Search breeds"
              @update="(search: string) => (query = search)"
            />
          </div>
        </div>
        <div class="right">
          <ToolbarGroup>
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
          </ToolbarGroup>
          <div>
            <label for="generations">Generations: </label>
            <select
              id="generations"
              v-model="genCount"
              title="Generations"
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
      </section>
      <section id="breeds">
        <div>
          <label>Male breed</label>
          <FilteredBreedList
            :search="query"
            :breeds="GLOBALS.breeds.males"
            :tags="tagStore.enabledTags"
            :groups="tagStore.enabledEggGroups"
            class="results"
            @breed-selected="selectMale"
          />
        </div>
        <div>
          <label>Female breed</label>
          <FilteredBreedList
            :search="query"
            :breeds="GLOBALS.breeds.females"
            :tags="tagStore.enabledTags"
            :groups="tagStore.enabledEggGroups"
            class="results"
            @breed-selected="selectFemale"
          />
        </div>
      </section>
    </div>
    <section>
      <Lineage
        v-if="tree !== null"
        :root="tree"
        :config="{ showInterface: false, showLabels: true, disabled: true }"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { PortraitData, DragonGender } from '../app/types';
import GLOBALS from '../app/globals';
import { getBreedData } from '../app/utils';
import { useTagStore } from '../store/tags';

import Lineage from '../components/Lineage/Lineage.vue';
import FilteredBreedList from '../components/BreedFiltering/FilteredBreedList.vue';
import BreedTagsSelector from '../components/BreedFiltering/BreedTagsSelector.vue';
import BreedGroupsTagSelector from '../components/BreedFiltering/BreedGroupsTagSelector.vue';
import DialogExport from '../components/Toolbar/DialogExport.vue';
import DialogGenerate from '../components/Toolbar/DialogGenerate.vue';
import ToolbarGroup from '../components/Toolbar/ToolbarGroup.vue';
import ToolbarButton from '../components/Toolbar/ToolbarButton.vue';
import BreedSearchControl from '../components/BreedFiltering/BreedSearchControl.vue';
import { DragonBuilder } from '../app/dragonBuilder';

const tree = ref(DragonBuilder.createWithMetadata());
const tagStore = useTagStore();
const maleBreed = ref(GLOBALS.placeholder.name);
const femaleBreed = ref(GLOBALS.placeholder.name);
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
    getBreedData(breed.value)?.genderOnly
      ? GLOBALS.placeholder.name
      : breed.value,
  );

  maleBreed.value = newMale;
  femaleBreed.value = newFemale;
  updateTree(tree.value.gender);
}
</script>
<style scoped>
#checker-controls {
  display: flex;
  flex-direction: column;
}
#checker-controls .left > div {
  margin-bottom: 5px;
}
#breeds {
  display: flex;
  margin: 10px 0px;
}
#breeds > div {
  width: 100%;
  text-align: center;
}
.breed-list {
  overflow: auto;
  height: 300px;
}
label {
  font-weight: bold;
}
.results {
  height: 30vh;
}
.applied-tags {
  display: flex;
  align-items: center;
}
.right {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.buttons {
  margin: 5px 0px 0px 0px;
}
.buttons button {
  width: unset;
  margin: 2px;
}
@media only screen and (min-width: 700px) {
  #checker-controls {
    flex-direction: row;
  }
  .right {
    margin-left: 10px;
  }
}
</style>
