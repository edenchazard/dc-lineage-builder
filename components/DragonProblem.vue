<template>
  <div class="dragon-formatting-block">
    <ul class="node">
      <li
        v-for="(value, field) in Lineage(dragon).withoutMetadata().raw()"
        :key="field"
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
          v-if="field === highlight"
          class="error"
        >
          {{ error }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { MaybePartialLineageWithMetadata } from '~/utils/shared/types';
import { hasParents } from '~/utils/shared/utils.js';
import { Lineage } from '~/utils/shared/lineageHandler';

withDefaults(
  defineProps<{
    dragon: MaybePartialLineageWithMetadata;
    highlight?: string;
    error?: string;
  }>(),
  {
    highlight: '',
    error: '',
  },
);
</script>
<style scoped>
.dragon-formatting-block {
  background: #e5e5e5;
  font-family: monospace;
  padding: 0.5rem 0;
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
