<!-- eslint-disable vue/no-v-html We have control over the content. -->
<template>
  <div
    v-if="compact && list.length > 0"
    class="grid"
  >
    <DragonPortrait
      v-for="breed in list"
      :key="breed.image"
      :data="breed"
      class="grid-cell"
      @click="emit('breedSelected', breed)"
    />
  </div>
  <ul
    v-else
    v-roving-tabindex-container.vertical
    class="breeds-list"
  >
    <li
      v-for="breed in list"
      :key="breed.name"
      class="breed-entry"
      @click="emit('breedSelected', breed)"
    >
      <button
        v-roving-tabindex
        type="button"
        class="breed-entry-button"
        :aria-labelledby="slug(breed.name)"
      >
        <DragonPortrait :data="breed" />
        <div class="details">
          <b
            :id="slug(breed.name)"
            class="name"
            v-html="
              search
                ? breed.name.replaceAll(searchRegExp, `<mark>$1</mark>`)
                : breed.name
            "
          />
          <div class="tags">
            <BreedTag
              v-for="filter in breed.metaData.tags"
              :key="filter"
              :tag="filter"
            />
          </div>
        </div>
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PortraitData } from '../shared/types';
import DragonPortrait from './DragonPortrait.vue';
import BreedTag from './BreedTag.vue';
import { slug } from '../shared/utils';

const emit = defineEmits<{
  (e: 'breedSelected', breed: PortraitData): void;
}>();

const props = withDefaults(
  defineProps<{
    compact: boolean;
    list: PortraitData[];
    size?: number;
    id: string;
    search?: string;
  }>(),
  {
    compact: true,
    list: () => [],
    size: 600,
    search: '',
  },
);

const margin = 4;
const searchRegExp = computed(() => new RegExp(`(${props.search})`, 'gi'));
</script>

<style scoped>
.grid > * {
  display: inline-block;
  margin: 2px;
}
.mates {
  list-style-type: none;
  margin: 0 auto;
}
.mates-compact {
  overflow: hidden auto;
}

.breed-entry {
  display: flex;
  cursor: pointer;

  & + .breed-entry {
    border-top: 1px solid var(--ui-breed-list-border);
  }
}

.breed-entry-button {
  flex: 1;
  border: 0;
  display: flex;
  grid-template-columns: auto 1fr;
  align-items: start;
  text-overflow: ellipsis;
  background: transparent;
  gap: 0.5rem;
  margin: 3px;
  color: inherit;
  cursor: inherit;
  padding: 0.5rem 0;

  & .details {
    & .name {
      text-align: left;
      margin-bottom: 0.5rem;
      display: block;
    }
  }

  & .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
}

.grid {
  margin: calc(v-bind('margin') * 1px);
}
</style>

<style>
.breed-entry-button {
  & mark {
    background: #ffff00;
  }
}
.grid-cell {
  pointer-events: all;

  &:hover {
    opacity: 0.7 !important;
  }
  &.selected {
    outline: 3px solid var(--ui-focus-colour);
  }
  &:active {
    outline: 3px solid var(--ui-focus-colour);
  }
}
</style>
