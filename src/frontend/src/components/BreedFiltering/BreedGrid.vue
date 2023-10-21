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
    class="mates-list"
  >
    <li
      v-for="{ data: breed } in list"
      :key="breed.name"
      @click="emit('breedSelected', breed)"
    >
      <DragonPortrait :data="breed" />
      {{ breed.name }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import VirtualCollection from 'vue-virtual-collection/src/VirtualCollection.vue';
import { onMounted, ref, getCurrentInstance, computed, watch } from 'vue';
import type { PortraitData } from '../../app/types';
import DragonPortrait from '../Lineage/Dragon/DragonPortrait.vue';
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
.mates-compact .imgbox,
.mates-list li {
  cursor: pointer;
}
.mates-compact {
  overflow: hidden auto;
}
.mates-list li {
  text-overflow: ellipsis;
  /*white-space: nowrap;*/
  overflow: hidden;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--breedDropDownColourFG);
}
.mates-list li:last-child {
  border: none;
}
.mates-list li .imgbox-fullsize {
  /* fix bug with flexbox */
  min-width: 34px;
  margin: 3px;
}
</style>
