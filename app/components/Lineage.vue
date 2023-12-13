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
import { computed } from 'vue';
import type { PropType } from 'vue';
import type {
  LineageConfig,
  PartialLineageWithMetadata,
} from '../shared/types';

import Dragon from './Dragon.vue';
import LineageGenerationCounter from './LineageGenerationCounter.vue';
import { Lineage } from '../shared/lineageHandler';

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

<style lang="postcss">
.lineage-view {
  &[data-show-editor-interface='false'] .tile-button {
    display: none;
  }

  &[data-show-editor-interface='true'] {
    .tile-container > .tile::after {
      display: none;
    }
  }

  &[data-show-labels='false'] {
    .label-block {
      display: none;
    }
  }
}
</style>
../../../../shared/types ../shared/lineageHandler
