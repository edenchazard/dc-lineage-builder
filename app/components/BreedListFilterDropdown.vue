<template>
  <Dropdown
    :distance="0"
    auto-size="min"
    auto-boundary-max-size
    container="#breed-selector-wrapper"
    auto-hide
    @apply-show="focusFiltersTitle()"
  >
    <template #default="{ show }">
      <div class="applied-filters">
        <label
          for="applied-filters"
          class="sr-only"
        >
          Filters
        </label>
        <input
          readonly
          type="text"
          id="applied-filters"
          :value="tagStore.join(', ')"
          class="tag-list pointer"
          placeholder="Filters"
          @keydown.space.enter="show()"
          @click="show()"
        />
        <span
          class="tag-counter"
          title="Applied filters"
          @keydown.space.enter="show()"
          @click="show()"
        >
          {{ tagStore.length }}
        </span>
      </div>
    </template>

    <template #popper="{ hide }">
      <div class="filters-container">
        <div class="header">
          <p
            tabindex="0"
            class="title"
            ref="filtersTitle"
          >
            Show breeds with...
          </p>
          <button
            class="clear-all pointer"
            type="button"
            @click="tagStore = []"
          >
            Clear All
          </button>
          <button
            class="close pointer"
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
                      new Set(tagStore).isSupersetOf(new Set(group.tags))
                    "
                    type="checkbox"
                    :id="slug(group.name)"
                  />
                  <legend>
                    <label
                      class="label"
                      :for="slug(group.name)"
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
                      :id="slug(tag)"
                      v-model="tagStore"
                      type="checkbox"
                      :value="tag"
                      class="white"
                    />
                    <label :for="slug(tag)">{{ resolveLabel(tag) }}</label>
                  </BreedTag>
                </ul>
              </fieldset>
            </li>
          </ul>
        </form>
      </div>
    </template>
  </Dropdown>
</template>

<script setup lang="ts">
import { nextTick, useTemplateRef } from 'vue';
import { Dropdown } from 'floating-vue';
import 'floating-vue/dist/style.css';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { resolveLabel, slug } from '../shared/utils';
import BreedTag from './BreedTag.vue';
import { filtersByGroup, tagStore } from '../store/useTagStore';

const filtersTitle = useTemplateRef('filtersTitle');

async function focusFiltersTitle() {
  await nextTick();
  setTimeout(() => filtersTitle.value?.focus(), 40);
}
</script>

<style scoped lang="postcss">
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

.applied-filters {
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
  padding: 0;
  text-align: left;
  border: none;
  display: flex;
  align-items: center;

  & .tag-list {
    flex: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 100%;
    padding-right: 2.2rem;
  }

  & .tag-counter {
    position: absolute;
    right: 1rem;
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
</style>
