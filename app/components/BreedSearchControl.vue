<template>
  <input
    type="search"
    placeholder="search"
    @input="search"
  />
</template>

<script setup lang="ts">
import { debounce } from '../app/utils.js';

const emit = defineEmits<{
  (e: 'update', value: string): void;
}>();

// debounced to avoid it running every key press rapidly
const search = debounce(
  (e: Event) => emit('update', (e.target as HTMLInputElement).value),
  250,
);
</script>
