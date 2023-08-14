<template>
  <div
    class="lineage-view"
    :data-show-labels="config.showLabels"
    :data-show-editor-interface="config.showInterface"
  >
    <LineageGenerationCounter :count="generations" />
    <ul
      v-if="root !== null"
      class="lineage-root"
    >
      <Dragon
        :data="root"
        :nodes-from-root="0"
        :disabled="config.disabled"
      />
    </ul>
  </div>
</template>
<script setup lang="ts">
import { computed, PropType } from 'vue';
import { LineageConfig, LineageRoot } from '../../app/types';
import { countGenerations } from '../../app/utils';

import Dragon from './Dragon/Dragon.vue';
import LineageGenerationCounter from './LineageGenerationCounter.vue';

const props = defineProps({
  root: {
    type: Object as PropType<LineageRoot> | null,
    required: true,
    default: null,
  },
  config: {
    type: Object as PropType<LineageConfig>,
    required: false,
    default: () => ({
      showLabels: true,
      showInterface: false,
      disabled: true,
    }),
  },
});

const generations = computed(() => {
  if (props.root === null) return 0;
  return countGenerations(props.root);
});
</script>

<style scoped>
.lineage-view {
  margin: 0 auto;
  font: var(--dc-lineage-font);
  background: var(--dc-background);
  color: var(--dc-lineage-colour);
  display: flex;
  flex-direction: column;
  overflow-x: auto;
  width: 100%;
  padding: 0 1rem;
  box-sizing: border-box;
}
.lineage-root {
  margin: 0 auto;
}
</style>
