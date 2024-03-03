<template>
  <LineageWrapper
    :generations="generations"
    :data-show-labels="config.showLabels"
    :data-show-editor-interface="config.showInterface"
  >
    <ul
      v-if="root !== null"
      class="lineage-root"
    >
      <LineageViewNode
        :data="root"
        :nodes-from-root="0"
        :disabled="config.disabled"
      />
    </ul>
  </LineageWrapper>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type {
  LineageConfig,
  PartialLineageWithMetadata,
} from '../shared/types';
import { computed } from 'vue';
import LineageViewNode from './LineageViewNode.vue';
import { Lineage } from '../shared/lineageHandler';
import LineageWrapper from './LineageWrapper.vue';

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

const generations = computed(() =>
  props.root ? Lineage(props.root).generations() : 0,
);
</script>

<style scoped>
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
