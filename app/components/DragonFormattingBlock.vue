<template>
  <div class="dragon-formatting-block">
    <ul class="node">
      <li
        v-for="(value, field) in Lineage(dragon).withoutMetadata().raw()"
        class="node-line"
      >
        <div
          class="key-value"
          :class="{ highlighted: field === highlight }"
        >
          {{ field }}:
          {{ field === 'parents' && hasParents(dragon) ? '{ ... }' : value }}
        </div>
        <div
          class="error"
          v-if="field === highlight"
        >
          {{ error }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { MaybePartialLineageWithMetadata } from '../shared/types';
import { hasParents } from '../app/utils';
import { Lineage } from '../shared/lineageHandler';

const props = defineProps({
  dragon: {
    type: Object as PropType<MaybePartialLineageWithMetadata>,
    required: true,
  },

  highlight: {
    type: String,
    required: false,
    default: '',
  },

  error: {
    type: String,
    required: false,
    default: '',
  },
});
</script>
<style scoped>
.dragon-formatting-block {
  background: #e5e5e5;
  font-family: monospace;
  padding: 0.5rem 0;
}

.node {
}
.node-line {
  margin: 0;
  line-height: 1.5rem;
}
.key-value {
  padding: 0 1rem 0 1rem;
}
.highlighted {
  background: rgba(255, 34, 34, 0.5);
  font-weight: bold;
}

.error {
  font-size: 0.7rem;
  padding: 0 1rem 0 2rem;
  background: rgba(255, 34, 34, 0.2);
}
</style>
