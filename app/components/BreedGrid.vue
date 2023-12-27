<template>
  <VirtualCollection
    v-if="compact && list.length > 0"
    class="mates-compact"
    :cell-size-and-position-getter="cellSizeAndPositionGetter"
    :collection="list"
    :height="sizeH"
    :width="sizeW"
    :section-size="size"
  >
    <template #cell="{ data: breed }">
      <DragonPortrait
        :data="breed"
        @click="emit('breedSelected', breed)"
      />
    </template>
  </VirtualCollection>
  <ul
    v-else
    class="breeds-list"
  >
    <li
      v-for="{ data: breed } in list"
      :key="breed.name"
      @click="emit('breedSelected', breed)"
      class="breed-entry"
    >
      <button
        type="button"
        class="breed-entry-button"
        :aria-labelledby="id(breed.name)"
      >
        <DragonPortrait :data="breed" />
        <span
          class="breed-entry-name"
          :id="id(breed.name)"
          >{{ breed.name }}</span
        >
        <span class="tag-group">{{ breed.metaData.group }}</span>
        <span
          v-for="filter in breed.metaData.tags"
          :key="filter"
          class="tag-filter"
        >
          {{ filter }}</span
        >
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import VirtualCollection from 'vue-virtual-collection/src/VirtualCollection.vue';
import { onMounted, ref, getCurrentInstance } from 'vue';
import type { PortraitData } from '../shared/types';
import DragonPortrait from './DragonPortrait.vue';

const emit = defineEmits<{
  (e: 'breedSelected', breed: PortraitData): void;
}>();

defineProps({
  compact: {
    type: Boolean,
    required: true,
  },
  list: {
    type: Array<{ data: PortraitData }>,
    default: [],
  },
  size: {
    type: Number,
    default: 600,
  },
});

const obs: {
  func: (() => void) | null;
  observer: ResizeObserver | null;
} = {
  func: null,
  observer: null,
};

const sizeH = ref(0);
const sizeW = ref(0);

// We want our grid to be fluid, which means we have to employ a somewhat
// hacky solution to ensure it takes up the parent container's space
// once on initiation and there again when it's resized
onMounted(() => {
  const instance = getCurrentInstance();
  const parent = instance?.parent?.proxy?.$el;

  if (!parent) return;

  obs.func = () => {
    if (!parent) return;

    // the breed grid should expand to fill the space of the parent,
    // so we have to manually calculate the width and height
    const { width, height } = (parent as HTMLElement).getBoundingClientRect();
    sizeW.value = width;
    sizeH.value = height;
  };

  // once on initiation
  obs.func();

  // and again when the parent is resized
  obs.observer = new ResizeObserver(() => {
    if (obs.func) obs.func();
  });
  obs.observer.observe(parent);
});

function cellSizeAndPositionGetter(item: PortraitData, index: number) {
  const containerWidth = sizeW.value,
    portraitWidth = 36,
    portraitHeight = 48,
    margin = 2,
    columns = Math.floor(containerWidth / (portraitWidth + margin * 2));

  // compute size and position
  return {
    width: portraitWidth,
    height: portraitHeight,
    x: (index % columns) * (portraitWidth + margin),
    y: Math.floor(index / columns) * (portraitHeight + margin),
  };
}

function id(name: string) {
  return name.replaceAll(' ', '-');
}
</script>

<style scoped>
.grid {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
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
</style>
