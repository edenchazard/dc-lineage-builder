<template>
  <span class="generation-counter">
    <span
      v-for="gen in gens"
      :key="gen"
      class="generation"
    >
      {{ gen }}
    </span>
  </span>
</template>
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  count: {
    type: Number,
    default: 1,
  },
  // when set to 1, the lineage will not be cut off at any gen
  limit: {
    type: Number,
    default: -1,
  },
});

const gens = computed<number[]>(() => {
  let length: number;
  if (props.limit > -1 && props.limit > props.count) length = props.count;
  else if (props.limit === -1) length = props.count;
  else length = props.limit;
  return Array.from({ length }, (_, i) => props.count - i);
});
</script>
<style scoped>
.generation-counter {
  position: relative;
  display: flex;
  left: 2px;
  height: 16px;
  line-height: 16px;
  margin: 0px auto;
}
.generation,
.generation::after,
.generation::before {
  border-style: var(--dc-lineage-line-style);
  border-color: var(--dc-lineage-line-colour);
}
.generation:first-child {
  border-width: 0 var(--dc-lineage-line-width) 0 var(--dc-lineage-line-width);
}
.generation {
  position: relative;
  width: 128px;
  box-sizing: border-box;
  text-align: center;
  color: var(--dc-lineage-gen-text-colour);
  border-width: 0 var(--dc-lineage-line-width) 0 0;
}
.generation::before {
  left: 0;
}
.generation::after {
  right: 0;
}
.generation::before,
.generation::after {
  content: '';
  position: absolute;
  top: 8px;
  width: 52px;
  border-width: var(--dc-lineage-line-width) 0 0 0;
}
</style>
