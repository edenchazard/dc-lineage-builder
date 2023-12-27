<template>
  <VirtualCollection
    v-if="compact && list.length > 0"
    class="mates-compact"
    :cell-size-and-position-getter="cellSizeAndPositionGetter"
    :collection="list"
    :height="sizeH"
    :width="containerWidth"
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
import { onMounted, ref, getCurrentInstance, computed, watch } from 'vue';
import type { PortraitData } from '../shared/types';
import DragonPortrait from './DragonPortrait.vue';
import { useElementSize } from '@vueuse/core';

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

const parent = ref();
const { height: sizeH, width: containerWidth } = useElementSize(parent);
const portraitWidth = 36;
const portraitHeight = 48;
const margin = 2;
const columns = computed(() =>
  Math.floor(containerWidth.value / (portraitWidth + margin)),
);
const sizeW = computed(() => containerWidth.value);
watch(containerWidth, () => {
  console.log(sizeW.value, containerWidth.value);
});
onMounted(() => {
  const instance = getCurrentInstance();
  parent.value = instance?.parent?.proxy?.$el;
});

function cellSizeAndPositionGetter(item: PortraitData, index: number) {
  // compute size and position
  return {
    width: portraitWidth,
    height: portraitHeight,
    x: (index % columns.value) * (portraitWidth + margin),
    y: Math.floor(index / columns.value) * (portraitHeight + margin),
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
