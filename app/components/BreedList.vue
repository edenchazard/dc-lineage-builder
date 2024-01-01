<template>
  <div
    v-if="compact && breedList.length > 0"
    ref="wrapper"
  >
    <VirtualCollection
      ref="grid"
      :tabindex="breedList.length > 0 ? 0 : -1"
      class="mates-compact grid"
      :cell-size-and-position-getter="cellSizeAndPositionGetter"
      :collection="breedList"
      :height="abs(parentSize.height.value - scrollGutter)"
      :width="abs(parentSize.width.value - scrollGutter)"
      :section-size="size"
      @focusout="handleFocusOut"
      @keyup.enter="navigateToCell(0, $event)"
      @vnode-updated="checkFocus"
    >
      <template #cell="{ data }">
        <button
          type="button"
          class="grid-cell"
          :tabindex="-1"
          :data-index="data.index"
          @click="emit('breedSelected', data.breed)"
          @focus="focused = true"
          @keydown.down.up.left.right="
            navigateToCell(determineGridAction(data.index, $event), $event)
          "
        >
          <DragonPortrait :data="data.breed" />
        </button>
      </template>
    </VirtualCollection>
  </div>
  <ul
    v-else
    class="breeds-list"
  >
    <li
      v-for="{ data: { breed } } in breedList"
      :key="breed.name"
      class="breed-entry"
      @click="emit('breedSelected', breed)"
    >
      <button
        type="button"
        class="breed-entry-button"
        :aria-labelledby="id(breed.name)"
      >
        <DragonPortrait :data="breed" />
        <span
          :id="id(breed.name)"
          class="breed-entry-name"
          >{{ breed.name }}</span
        >
        <span class="tag-group">{{ breed.metaData.group }}</span>
        <span
          v-for="filter in breed.metaData.tags"
          :key="filter"
          class="tag-filter"
          >{{ filter }}</span
        >
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useElementSize, useParentElement } from '@vueuse/core';
import VirtualCollection from 'vue-virtual-collection/src/VirtualCollection.vue';
import type { PortraitData } from '../shared/types';
import DragonPortrait from './DragonPortrait.vue';
import settings from '../shared/settings.js';

const emit = defineEmits<{
  (e: 'breedSelected', breed: PortraitData): void;
}>();

const props = defineProps({
  compact: {
    type: Boolean,
    default: true,
  },
  list: {
    type: Array<PortraitData>,
    default: [],
  },
  size: {
    type: Number,
    default: 600,
  },
});
const portraitWidth = settings.tileSizes.fullSize.width;
const portraitHeight = settings.tileSizes.fullSize.height;
const margin = 4;
const scrollGutter = 18;
const wrapper = ref();
const grid = ref();
const focused = ref(false);
const activeIndex = ref<number>(0);
const parent = useParentElement(wrapper);
const parentSize = useElementSize(parent);
const abs = Math.abs;

// We want our grid to be fluid, which means we have to employ a somewhat
// hacky solution to ensure it takes up the parent container's space even when
// resized
const columns = computed(() =>
  Math.floor(
    (parentSize.width.value - portraitWidth - margin) /
      (portraitWidth + margin),
  ),
);

const breedList = computed(() =>
  props.list.map((breed, index) => ({ data: { index, breed } })),
);

// scroll the collection back to the top if the list changes
watch(breedList, () => {
  if (!parent.value) return;

  parent.value.querySelector('.vue-virtual-collection')?.scroll(0, 0);
});

function cellSizeAndPositionGetter(_: PortraitData, index: number) {
  const column = index % columns.value;
  return {
    width: portraitWidth,
    height: portraitHeight + margin,
    x: margin + column * (portraitWidth + margin),
    y: margin + Math.floor(index / columns.value) * (portraitHeight + margin),
  };
}

function handleFocusOut() {
  requestAnimationFrame(() => {
    if (parent.value && !parent.value.contains(document.activeElement)) {
      focused.value = false;
      activeIndex.value = 0;
    }
  });
}

/**
 * Unfortunately, the way virtual scroll works means focus can be lost
 * as it replaces cells
 */
function checkFocus() {
  if (!focused.value) return;

  const next = parent.value?.querySelector<HTMLButtonElement>(
    `.grid-cell[data-index='${activeIndex.value}']`,
  );

  if (next) {
    next.focus();
  }
}

function navigateToCell(nextIndex: number, e: KeyboardEvent) {
  e.preventDefault();

  const next = parent.value?.querySelector<HTMLButtonElement>(
    `.grid-cell[data-index='${nextIndex}']`,
  );

  if (next) {
    activeIndex.value = nextIndex;
    next.focus();
  }
}

function determineGridAction(currentIndex: number, e: KeyboardEvent) {
  switch (e.key) {
    case 'ArrowUp':
      return currentIndex - columns.value;
    case 'ArrowDown':
      return currentIndex + columns.value;
    case 'ArrowLeft':
      return currentIndex - 1;
    case 'ArrowRight':
      return currentIndex + 1;
    default:
      return -1;
  }
}

function id(name: string) {
  return name.replaceAll(' ', '-');
}
</script>

<style scoped>
.grid-cell {
  border: 0px none;
  padding: 0;
  margin: 0;
  background: none;
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
}

.breed-entry + .breed-entry {
  border-top: 1px solid var(--ui-breed-list-border);
}

.breed-entry-button {
  flex: 1;
  border: 0;
  display: flex;
  align-items: center;
  text-overflow: ellipsis;
  overflow: hidden;
  background: transparent;
  gap: 0.5rem;
  margin: 3px;
  color: inherit;
  cursor: inherit;
}
.breed-entry-name {
  flex: 1;
  text-align: left;
}

.tag-group,
.tag-filter {
  display: inline-block;
  padding: 0.3rem;
  border-radius: 0.5rem;
  border: 0px none;
  font-size: 0.7rem;
}

.grid-cell:focus {
  outline: 3px solid var(--ui-focus-colour);
}
.grid {
  margin: calc(v-bind('margin') * 1px);
}
.grid:focus-within {
  outline: 3px solid var(--ui-focus-colour);
}
</style>
