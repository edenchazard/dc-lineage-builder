<template>
  <DialogBreedSelectorWrapper @close="breedSelectorDialog.hide()">
    <template #content>
      <form
        role="search"
        @submit.prevent="jumpToFirstResult()"
        @keydown.enter.prevent="jumpToFirstResult()"
      >
        <h2 class="sr-only">Filtering</h2>
        <div id="filtering">
          <BreedSearch
            id="results-search"
            ref="mateSearchEl"
            v-model="searchString"
            placeholder="Search"
            enterkeyhint="search"
          />
          <label
            for="results-search"
            class="sr-only"
          >
            Search
          </label>
          <label
            for="applied-filters"
            class="sr-only"
          >
            Filters
          </label>
          <BreedListFilterDropdown
            id="applied-filters"
            placeholder="Filters"
            container="#breed-selector-wrapper"
          />
          <DateRangeFilter />
        </div>
      </form>

      <section
        id="breeds"
        ref="resultsEl"
      >
        <h2 class="sr-only">Results</h2>
        <BreedListFiltered
          v-show="breedSelectorDialog.forGender.value === 'm'"
          id="filtered-breeds"
          :search="searchString"
          :breeds="getTable('m')"
          :tags="chosenTags"
          no-results-text="There are no breeds that match this criteria."
          @breed-selected="breedSelected"
        />
        <BreedListFiltered
          v-show="breedSelectorDialog.forGender.value === 'f'"
          id="filtered-breeds"
          :search="searchString"
          :breeds="getTable('f')"
          :tags="chosenTags"
          no-results-text="There are no breeds that match this criteria."
          @breed-selected="breedSelected"
        />
      </section>
    </template>
  </DialogBreedSelectorWrapper>
</template>

<script setup lang="ts">
import { nextTick, useTemplateRef, watch } from 'vue';
import { onStartTyping, useSessionStorage } from '@vueuse/core';
import { type PortraitData } from '../shared/types';
import BreedListFiltered from './BreedListFiltered.vue';
import DialogBreedSelectorWrapper from './DialogBreedSelectorWrapper.vue';
import BreedSearch from './BreedSearch.vue';
import { chosenTags } from '../store/useTagStore.js';
import BreedListFilterDropdown from './BreedListFilterDropdown.vue';
import DateRangeFilter from './DateRangeFilter.vue';
import { getTable } from '../shared/utils';
import useBreedSelector from '../composables/useBreedSelector';

const emit = defineEmits<{
  (e: 'breedSelected', breed: PortraitData): void;
}>();

const searchString = useSessionStorage('search', '');
const mateSearchEl = useTemplateRef('mateSearchEl');
const resultsEl = useTemplateRef('resultsEl');
const breedSelectorDialog = useBreedSelector();

// focus search bar when begin typing
onStartTyping(() => {
  if (!mateSearchEl.value) return;
  if (document.activeElement !== mateSearchEl.value.$el)
    mateSearchEl.value.$el.focus();
});

watch(breedSelectorDialog.autofocus, async (value) => {
  await nextTick();
  if (value && mateSearchEl.value) {
    mateSearchEl.value.$el.focus();
  }
});

function breedSelected(breed: PortraitData) {
  const openTime = parseInt(
    breedSelectorDialog.dialogRef.value?.dataset.openTime ?? '0',
  );

  // In mobile desktop mode, the click on the lineage view node
  // gets intercepted and the breedSelected event is emitted.
  if (Date.now() - openTime < 250) {
    return;
  }

  breedSelectorDialog.handleBreedSelected(breed);
  emit('breedSelected', breed);
}

async function jumpToFirstResult() {
  await nextTick();
  if (resultsEl.value) {
    resultsEl.value
      .querySelector<HTMLElement>(
        "[tabindex='-1'], .breed-entry-button, .grid-cell",
      )
      ?.focus();
  }
}
</script>

<style scoped>
section + section,
section + form,
form + section {
  margin-top: 0.5rem;
}

#recently-used {
  flex-grow: 0;
}

#breeds-inline-search {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0.5rem 0;
}

#filtering {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

#breeds {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>
