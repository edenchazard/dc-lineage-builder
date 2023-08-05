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
import { getCurrentInstance, onMounted, ref } from 'vue';
import { PortraitData } from '../../app/types';
import DragonPortrait from '../Lineage/Dragon/DragonPortrait.vue';

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

const emit = defineEmits<{
  (e: 'breedSelected', breed: PortraitData): void;
}>();

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
</script>

<style scoped>
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
