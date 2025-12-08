<template>
  <Dropdown
    :distance="0"
    auto-size="min"
    auto-boundary-max-size
    :container="container"
    placement="bottom-start"
    :overflow-padding="10"
    auto-hide
    @apply-show="focusFiltersTitle()"
  >
    <template #default="{ show }">
      <div class="applied-filters">
        <input
          :id="id"
          ref="textEl"
          readonly
          type="text"
          :value="tagStore.join(', ')"
          class="tag-list pointer"
          :placeholder="placeholder"
          @keydown.space.enter="show()"
          @keydown.space.prevent.stop
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
      <div
        class="filters-container"
        @keydown.escape.prevent.stop="
          hide();
          textEl?.focus();
        "
      >
        <div class="header">
          <p
            ref="filtersTitle"
            tabindex="0"
            class="title"
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
            @click="
              hide();
              textEl?.focus();
            "
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
              v-for="(tags, name) in filtersByGroup"
              :key="name"
            >
              <fieldset>
                <div class="group">
                  <input
                    :id="slug(name)"
                    :checked="new Set(tagStore).isSupersetOf(new Set(tags))"
                    type="checkbox"
                    @change="toggle(tags)"
                  />
                  <legend :aria-labelledby="'group-' + slug(name)">
                    <label
                      :id="'group-' + slug(name)"
                      :for="slug(name)"
                    >
                      {{ name }}
                    </label>
                  </legend>
                </div>

                <ul class="tag-set">
                  <BreedTag
                    v-for="tag in tags"
                    :key="tag"
                    as="li"
                    :tag="tag"
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
            <li>
              <fieldset>
                <div class="group">
                  <legend>Release Date Filter</legend>
                  <button
                    v-if="hasActiveDateFilter"
                    type="button"
                    class="clear-dates"
                    title="Clear date filter"
                    @click="clearDateFilter"
                  >
                    Clear
                  </button>
                </div>
                <div class="date-filter-content">
                  <div class="date-inputs">
                    <div class="date-input-group">
                      <label for="filter-start-date">From</label>
                      <input
                        id="filter-start-date"
                        v-model="dateFilterStore.startDate"
                        type="date"
                        v-bind="dateRange"
                        class="date-input"
                        placeholder="Start date"
                      />
                    </div>
                    <div class="date-input-group">
                      <label for="filter-end-date">To</label>
                      <input
                        id="filter-end-date"
                        v-model="dateFilterStore.endDate"
                        type="date"
                        class="date-input"
                        v-bind="dateRange"
                        placeholder="End date"
                      />
                    </div>
                  </div>
                  <p class="date-filter-help">
                    (Leave start date empty to filter breeds released before the
                    end date. Leave end date empty to filter breeds released
                    after the start date.)
                  </p>
                </div>
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
import type { NewTag } from '../shared/types';
import {
  dateFilterStore,
  clearDateFilter,
  hasActiveDateFilter,
} from '../store/useDateFilter';

defineProps<{
  container: string;
  id: string;
  placeholder?: string;
}>();

const filtersTitle = useTemplateRef('filtersTitle');
const textEl = useTemplateRef('textEl');

const dateRange = {
  min: '2005-01-01',
  max: new Date().toISOString().split('T')[0],
};

async function focusFiltersTitle() {
  await nextTick();
  setTimeout(() => filtersTitle.value?.focus(), 40);
}

function toggle(tags: NewTag[]) {
  const group = new Set(tags);
  const model = new Set(tagStore.value);

  if (group.size === [...group].filter((tag) => model.has(tag)).length) {
    tags.forEach((tag) => model.delete(tag));
  } else {
    tags.forEach((tag) => model.add(tag));
  }
  tagStore.value = Array.from(model);
}
</script>

<style scoped>
.filters-container {
  border-radius: 0.5rem;
  font: var(--dc-lineage-font);
  max-height: 25rem;
  padding: 0.5rem 0;
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

.date-filter-content {
  padding: 0 1rem 0.5rem 1rem;
}

.date-inputs {
  display: flex;
  gap: 2rem;
  margin-bottom: 0.5rem;
}

.date-input-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.date-input-group label {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--ui-text-colour, #333);
}

.date-input {
  padding: 0.5rem;
  border: 1px solid var(--ui-border-color, #ccc);
  border-radius: 0.25rem;
  font-size: 0.85rem;
  width: 100%;
  background: var(--ui-modal-content, #fff);
}

.date-input:focus {
  outline: none;
  border-color: var(--ui-accent-color, #007bff);
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.date-filter-help {
  font-size: 0.75rem;
  color: var(--ui-text-muted, #666);
  line-height: 1.3;
  margin: 0;
}

.clear-dates {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
  text-transform: uppercase;
}

.clear-dates:hover {
  background: #c82333;
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
  position: relative;

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
<style>
.v-popper__wrapper {
  max-width: 35rem;
}
.v-popper__inner {
  padding: 0 0.5rem;
}
</style>
