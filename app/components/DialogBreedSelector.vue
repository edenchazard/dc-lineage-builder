<template>
  <DialogBreedSelectorWrapper
    ref="wrapper"
    tabindex="-1"
    aria-label="Choose a breed"
    aria-description="Select a breed."
    @close="close"
  >
    <template #content>
      <section id="recently-used">
        <h2 class="title sr-only">Already in lineage</h2>
        <BreedListReuse
          :filter-by-gender="genderFilter"
          @breed-selected="breedSelected"
        />
      </section>

      <section>
        <h2 class="sr-only">Filtering</h2>
        <div id="filtering">
          <BreedSearch
            id="results-search"
            ref="mateSearchEl"
            placeholder="Search"
            @update="(search) => (searchString = search)"
          />
          <label
            for="results-search"
            class="sr-only"
          >
            Search
          </label>
          <label class="sr-only">Groups</label>
          <BreedTagListGroups name="filters-groups" />
          <label class="sr-only">Showing</label>
          <BreedTagListTags name="filters-tags" />
        </div>
      </section>

      <section id="breeds">
        <h2 class="sr-only">Results</h2>
        <BreedListFiltered
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
import { ref } from 'vue';
import type { PropType } from 'vue';
import { onStartTyping } from '@vueuse/core';
import type { DragonGender, PortraitData } from '../shared/types';
import { useTagStore } from '../store/useTagStore.js';
import BreedListFiltered from './BreedListFiltered.vue';
import BreedListReuse from './BreedListReuse.vue';
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

const { deactivate } = useFocusTrap(wrapper, {
  immediate: true,
  escapeDeactivates: true,
  onDeactivate: close,
  initialFocus() {
    if (props.autofocusSearch) {
      setTimeout(() => {
        mateSearchEl.value?.$el.focus();
      }, 100);
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
</script>
<style scoped>
section + section {
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
