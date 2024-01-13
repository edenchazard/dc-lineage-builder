<template>
  <div
    v-if="compact && breedList.length > 0"
    ref="wrapper"
    class="wrapper"
    tabindex="0"
    @focusin="focused = true"
    @focusout="focused = false"
    @keydown="handleKeyDown"
  >
    <p
      class="active sr-only"
      tabindex="-1"
    >
      <b :id="`active-${id}`">
        Selected breed {{ breedList[activeIndex].data.breed.name }}.
      </b>
      Use arrow keys to navigate breed list.
    </p>

    <VirtualCollection
      ref="grid"
      class="mates-compact grid"
      :cell-size-and-position-getter="cellSizeAndPositionGetter"
      :collection="breedList"
      :height="abs(parentSize.height.value - scrollGutter)"
      :width="abs(parentSize.width.value - scrollGutter)"
      :section-size="size"
      :aria-labelledby="`active-${id}`"
    >
      <template #cell="{ data }">
        <DragonPortrait
          :data="data.breed"
          :data-index="data.index"
          class="grid-cell"
          :class="{
            selected: focused && data.index === activeIndex,
          }"
          @click="emit('breedSelected', data.breed)"
          @mousedown="activeIndex = data.index"
        />
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
        :aria-labelledby="strToId(breed.name)"
      >
        <DragonPortrait :data="breed" />
        <span
          :id="strToId(breed.name)"
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
  id: {
    type: String,
    required: true,
  },
});
const portraitWidth = settings.tileSizes.fullSize.width;
const portraitHeight = settings.tileSizes.fullSize.height;
const margin = 4;
const scrollGutter = 18;
const wrapper = ref<HTMLDivElement>();
const grid = ref();
const activeIndex = ref<number>(0);
const parent = useParentElement(wrapper);
const parentSize = useElementSize(parent);
const focused = ref(false);
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
  activeIndex.value = 0;
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

function handleKeyDown(e: KeyboardEvent) {
  if (['Space', 'Enter'].includes(e.code)) {
    emit('breedSelected', breedList.value[activeIndex.value].data.breed);
    e.preventDefault();
  }

  const nextIndex = determineGridAction(activeIndex.value, e);

  if (nextIndex !== -1) {
    e.preventDefault();
    navigateToCell(nextIndex);
  }
}

function isElementInViewport(el: Element) {
  const rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function navigateToCell(nextIndex: number) {
  // we'll correct "out of bounds" navs where possible
  if (nextIndex > breedList.value.length - 1) {
    nextIndex = breedList.value.length - 1;
  } else if (nextIndex < 0) {
    nextIndex = 0;
  }

  const gridEl = grid.value.$el;

  let next = parent.value?.querySelector(
    `.grid-cell[data-index='${nextIndex}']`,
  );

  if (next && !isElementInViewport(next)) {
    const pos = cellSizeAndPositionGetter({} as PortraitData, nextIndex);
    gridEl.scrollTop = pos.y;
  }
  // start
  else if (nextIndex === 0) {
    gridEl.scrollTop = 0;
  }
  // end
  else if (nextIndex === breedList.value.length - 1) {
    gridEl.scrollTop = gridEl
      .querySelector('.vue-virtual-collection-container')
      .getBoundingClientRect().height;
  }

  next = parent.value?.querySelector(`.grid-cell[data-index='${nextIndex}']`);

  next?.scrollIntoView({ behavior: 'instant', block: 'nearest' });

  activeIndex.value = nextIndex;
}

//setInterval(() => console.log(document.activeElement), 2000);
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
    case 'End':
      return breedList.value.length - 1;
    case 'Home':
      return 0;
    default:
      return -1;
  }
}

function strToId(name: string) {
  return name.replaceAll(' ', '-');
}
</script>

<style scoped lang="postcss">
.wrapper {
  padding: 0.2rem;
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
  border: 0 none;
  font-size: 0.7rem;
}

.grid {
  margin: calc(v-bind('margin') * 1px);
}
.wrapper:focus .grid {
  outline: 3px solid var(--ui-focus-colour);
}
.wrapper:focus {
  outline: none !important;
}
</style>

<style lang="postcss">
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
