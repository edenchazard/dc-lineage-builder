<template>
  <div
    ref="lineageView"
    class="lineage-view"
    :class="{ 'fixed-background': lineageVisible }"
  >
    <LineageViewGenerationCounter
      :count="generations"
      :limit="generationCutOff"
    />
    <slot />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useScroll } from '@vueuse/core';
import LineageViewGenerationCounter from './LineageViewGenerationCounter.vue';

defineProps({
  generations: {
    type: Number,
    required: true,
  },
  generationCutOff: {
    type: Number,
    required: false,
    default: -1,
  },
});

const lineageView = ref<HTMLElement>();
const lineageVisible = ref(false);

useScroll(window, {
  onScroll() {
    const containerTop = lineageView.value?.getBoundingClientRect().top ?? 0;
    lineageVisible.value = containerTop <= 113;
  },
});
</script>

<style scoped>
.lineage-view {
  margin: 0 auto;
  font: var(--dc-lineage-font);
  color: var(--dc-lineage-colour);
  display: flex;
  flex-direction: column;
  overflow-x: auto;
  width: 100%;
  padding: 0 1rem;
  box-sizing: border-box;
  flex: 1;
}

.fixed-background {
  background-attachment: fixed;
  background-position: 0 0;
}
</style>
