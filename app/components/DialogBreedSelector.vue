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
          <Multiselect
            multiple
            v-model="tagStore"
            :options="filtersByGroup"
            group-values="tags"
            group-label="name"
            :max-height="240"
            selectLabel=""
            selectedLabel=""
            deselectLabel=""
            placeholder=""
            searchable
            group-select
            :option-height="30"
            :close-on-select="false"
          >
            <template #selection="{ values }">
              <div class="tags">
                <span class="tag-list">{{ values.join(', ') }}</span>
                <span class="tag-counter">{{ values.length }}</span>
              </div>
            </template>

            <template #option="{ option }">
              <template v-if="option.$isLabel">
                <span>{{ option.$groupLabel }}</span>
              </template>
              <template v-else> <BreedTag :tag="option" /> </template>
            </template>
          </Multiselect>
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
import { computed, nextTick, ref } from 'vue';
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import { onStartTyping } from '@vueuse/core';
import {
  type DragonGender,
  type PortraitData,
  filtersByGroup,
} from '../shared/types';
import BreedListFiltered from './BreedListFiltered.vue';
import DialogBreedSelectorWrapper from './DialogBreedSelectorWrapper.vue';
import BreedSearch from './BreedSearch.vue';
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap';
import BreedTag from './BreedTag.vue';
import { tagsFromModel, tagStore } from '../store/useTagStore.js';

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
const chosenTags = computed(() => tagsFromModel(tagStore));

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

#results-search {
}

#breeds {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.tabs {
  display: flex;
  flex: 1;
  padding: 0.5rem;
}

[name='tab'] {
  display: none;

  &:checked + label {
    background: #b9dfee;
    border-radius: 0.25rem 0.25rem 0 0;
  }
  & + label {
    background: #f0f0f0;
    border-radius: 0.25rem 0.25rem 0 0;
    padding: 0.5rem 0.75rem 1rem 0.75rem;

    &:not(:first-child) {
      border-left: 1px solid #ccc;
    }
  }
}

.tab-body {
  display: flex;
  gap: 0.5rem;
  background: #b9dfee;
  padding: 0.5rem;
  width: 100%;
  border-radius: 0.25rem;
  flex-wrap: wrap;
}

.tags {
  display: flex;
  gap: 0.5rem;
}

.tag-list {
  flex: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
}

.tag-counter {
  font-size: 0.75rem;
  color: #666;
  background: #b9dfee;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
}
</style>
<style>
.multiselect__content-wrapper {
  /*  display: block !important; */
}
.multiselect__tags {
}
.multiselect__option {
  /*   padding: 0.5rem;
  min-height: 1rem;
  line-height: 0.5rem; */
}
.multiselect__element {
  font-size: 0.8rem;
}
.multiselect__placeholder {
  display: none;
}
/* .multiselect__element[role='option'] {
  display: inline-block;
}
.multiselect__option--group {
  display: block !important;
} */
</style>
