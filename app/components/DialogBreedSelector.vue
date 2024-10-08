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
          <span class="sr-only">Groups</span>
          <BreedTagListGroups name="filters-groups" />
          <span class="sr-only">Showing</span>
          <BreedTagListTags name="filters-tags" />
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
          :tags="tagStore.enabledTags"
          :groups="tagStore.enabledEggGroups"
          no-results-text="There are no breeds that match this criteria."
          @breed-selected="breedSelected"
        />
      </section>
    </template>
  </DialogBreedSelectorWrapper>
</template>
<script setup lang="ts">
import { nextTick, ref } from 'vue';
import type { PropType } from 'vue';
import { onStartTyping } from '@vueuse/core';
import type { DragonGender, PortraitData } from '../shared/types';
import { useTagStore } from '../store/useTagStore.js';
import BreedListFiltered from './BreedListFiltered.vue';
import DialogBreedSelectorWrapper from './DialogBreedSelectorWrapper.vue';
import BreedTagListTags from './BreedTagListTags.vue';
import BreedTagListGroups from './BreedTagListGroups.vue';
import BreedSearch from './BreedSearch.vue';
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap';

const props = defineProps({
  breeds: {
    type: Array<PortraitData>,
    required: true,
  },
  genderFilter: {
    type: String as PropType<DragonGender>,
    required: true,
  },
  autofocusSearch: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (e: 'breedSelected', breed: PortraitData): void;
  (e: 'close'): void;
}>();

const tagStore = useTagStore();
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
  align-items: center;
  flex-wrap: wrap;
  gap: 0.25rem 0.5rem;
}

#results-search {
  max-width: 8rem;
}

#breeds {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>
