<template>
  <DialogBreedSelectorWrapper
    ref="wrapper"
    @close="close"
  >
    <template #content>
      <form
        role="search"
        @submit.prevent="jumpToFirstResult"
      >
        <h2 class="sr-only">Filtering</h2>
        <div id="filtering">
          <BreedSearch
            id="results-search"
            ref="mateSearchEl"
            placeholder="Search"
            enterkeyhint="search"
            @update="(search) => (searchString = search)"
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
        </div>
      </form>

      <section
        id="breeds"
        ref="resultsEl"
      >
        <h2 class="sr-only">Results</h2>
        <BreedListFiltered
          id="filtered-breeds"
          :search="searchString"
          :breeds="breeds"
          :tags="chosenTags"
          no-results-text="There are no breeds that match this criteria."
          @breed-selected="breedSelected"
        />
      </section>
    </template>
  </DialogBreedSelectorWrapper>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue';
import { onStartTyping } from '@vueuse/core';
import { type DragonGender, type PortraitData } from '../shared/types';
import BreedListFiltered from './BreedListFiltered.vue';
import DialogBreedSelectorWrapper from './DialogBreedSelectorWrapper.vue';
import BreedSearch from './BreedSearch.vue';
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap';
import { chosenTags } from '../store/useTagStore.js';
import BreedListFilterDropdown from './BreedListFilterDropdown.vue';

const props = withDefaults(
  defineProps<{
    breeds: PortraitData[];
    genderFilter: DragonGender;
    autofocusSearch?: boolean;
  }>(),
  {
    autofocusSearch: false,
  },
);

const emit = defineEmits<{
  (e: 'breedSelected', breed: PortraitData): void;
  (e: 'close'): void;
}>();

const searchString = ref('');
const mateSearchEl = ref<HTMLInputElement>();
const wrapper = ref();
const resultsEl = ref<HTMLElement>();

const { deactivate } = useFocusTrap(wrapper, {
  immediate: true,
  escapeDeactivates: true,
  clickOutsideDeactivates: true,
  onDeactivate: close,
  initialFocus() {
    if (props.autofocusSearch) {
      nextTick(() => mateSearchEl.value?.$el.focus());
      return false;
    }

    return undefined;
  },
});

// focus search bar when begin typing
onStartTyping(() => {
  if (!mateSearchEl.value) return;
  if (document.activeElement !== mateSearchEl.value.$el)
    mateSearchEl.value.$el.focus();
});

function breedSelected(breed: PortraitData) {
  emit('breedSelected', breed);
  deactivate();
}

function close() {
  emit('close');
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
