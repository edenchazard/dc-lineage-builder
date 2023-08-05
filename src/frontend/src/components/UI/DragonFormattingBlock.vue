<template>
  <pre class="dragon-formatting-block">{{ format() }}</pre>
</template>
<script setup lang="ts">
import { PropType } from 'vue';
import { DragonType } from '../../app/types';
import { hasParents } from '../../app/utils';

const props = defineProps({
  dragon: {
    type: Object as PropType<DragonType>,
    required: true,
  },
});

function format() {
  // the data we show the user for context needs to be modified slightly.
  // omit selected and parents types
  const display: Omit<DragonType, 'selected' | 'parents'> & {
    parents: string;
  } = {
    ...props.dragon,
    parents: hasParents(props.dragon) ? '{ ... }' : 'none',
  };
  return JSON.stringify(display, null, 4);
}
</script>
<style scoped>
.dragon-formatting-block {
  background: #e5e5e5;
  padding: 5px;
}
</style>
