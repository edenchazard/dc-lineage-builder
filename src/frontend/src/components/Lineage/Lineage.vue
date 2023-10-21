<template>
  <div class="lineage-container">
    <div
      class="lineage-view"
      :class="{
        hideLabels: !config.showLabels,
        hideEdit: !config.showInterface,
      }"
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
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';
import type {
  LineageConfig,
  PartialLineageWithMetadata,
} from '../../app/types';

import Dragon from './Dragon/Dragon.vue';
import LineageGenerationCounter from './LineageGenerationCounter.vue';
import { Lineage } from '../../app/lineageHandler';

const props = defineProps({
  root: {
    type: Object as PropType<PartialLineageWithMetadata> | null,
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
  return props.root ? Lineage(props.root).generations() : 0;
});
</script>

<style scoped>
.lineage-container {
  overflow: auto;
  margin: 0px 3px;
}
.lineage-view {
  margin: 0px auto;
  font-family: var(--lineageFont);
  background: inherit;
  line-height: 19.6px;
  display: flex;
  flex-direction: column;
}
.lineage-root {
  padding: 1px;
  background: inherit;
  display: flex;
  margin: 0px auto;
}
</style>
