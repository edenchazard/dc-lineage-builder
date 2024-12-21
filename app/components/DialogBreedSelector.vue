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

          <Dropdown
            :distance="0"
            auto-size="min"
            auto-boundary-max-size
            :triggers="['click']"
            container="#breed-selector-wrapper"
          >
            <button
              class="applied-filters interactive"
              type="button"
            >
              <span class="tag-list">{{ tagStore.join(', ') }}</span>
              <span
                class="tag-counter"
                title="Applied filters"
                >{{ tagStore.length }}</span
              >
            </button>

            <template #popper="{ hide }">
              <div class="filters-container">
                <div class="header">
                  <span
                    tabindex="0"
                    class="title"
                  >
                    Show breeds with...
                  </span>
                  <button
                    class="clear-all"
                    type="button"
                    @click="tagStore = []"
                  >
                    Clear All
                  </button>
                  <button
                    class="close"
                    type="button"
                    aria-label="Close filters"
                    title="Close filters"
                    @click="hide()"
                  >
                    <FontAwesomeIcon
                      size="2x"
                      icon="times"
                    />
                  </button>
                </div>
                <form>
                  <ul class="filter-menu">
                    <li
                      v-for="group in filtersByGroup"
                      :key="group.name"
                    >
                      <fieldset>
                        <div class="group">
                          <input
                            :checked="
                              new Set(tagStore).isSupersetOf(
                                new Set(group.tags),
                              )
                            "
                            type="checkbox"
                            :id="group.name"
                          />
                          <legend>
                            <label
                              class="label"
                              :for="group.name"
                            >
                              {{ group.name }}
                            </label>
                          </legend>
                        </div>

                        <ul class="tag-set">
                          <BreedTag
                            as="li"
                            :tag="tag"
                            v-for="tag in group.tags"
                            :key="tag"
                          >
                            <input
                              :id="tag"
                              v-model="tagStore"
                              type="checkbox"
                              :value="tag"
                              class="white"
                            />
                            <label :for="tag">{{ resolveLabel(tag) }}</label>
                          </BreedTag>
                        </ul>
                      </fieldset>
                    </li>
                  </ul>
                </form>
              </div>
            </template>
          </Dropdown>
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
import { onStartTyping } from '@vueuse/core';
import { type DragonGender, type PortraitData } from '../shared/types';
import BreedListFiltered from './BreedListFiltered.vue';
import DialogBreedSelectorWrapper from './DialogBreedSelectorWrapper.vue';
import BreedSearch from './BreedSearch.vue';
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap';
import BreedTag from './BreedTag.vue';
import {
  tagsFromModel,
  tagStore,
  filtersByGroup,
} from '../store/useTagStore.js';
import { Dropdown } from 'floating-vue';
import 'floating-vue/dist/style.css';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { resolveLabel } from '../shared/utils';

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

#breeds {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.applied-filters {
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  margin: 0;
  padding: 0.25rem 0.5rem;
  text-align: left;
  background: #fff;
  border: none;
  display: flex;
  align-items: center;

  & .tag-list {
    flex: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 100%;
  }

  & .tag-counter {
    font-size: 0.75rem;
    width: 1.5rem;
    height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    background: var(--ui-builder-toolbar-selection-count-bg);
    color: var(--ui-builder-toolbar-selection-count-fg);
  }
}

.filters-container {
  border-radius: 0.5rem;
  padding: 0.5rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  letter-spacing: 0.075rem;
  gap: 1rem;

  & .title {
    flex: 1;
  }

  & button {
    padding: 0;
    background: none;
    border: none;
    color: var(--ui-text-colour);
  }

  & .clear-all {
    text-transform: uppercase;
    font-size: 0.75rem;
    background: #cc0000;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    color: #fff;
  }
}

.filter-menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  & .group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    top: 0;
    position: sticky;
    z-index: 2;
    background: var(--ui-modal-content);

    & .label {
      flex: 1;
    }
  }

  & .group {
    padding: 0.5rem 0;
    gap: 0.5rem;
  }

  & .tag-set {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0 1rem;

    & input {
      background: transparent;

      & + label {
        padding-left: 0.5rem;
      }
    }
  }
}
</style>
