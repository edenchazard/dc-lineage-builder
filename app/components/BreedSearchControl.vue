<template>
  <input
    class="breed-search interactive"
    type="search"
    @input="search"
  />
</template>

<script setup lang="ts">
import { debounce } from '../shared/utils.js';

const emit = defineEmits<{
  (e: 'update', value: string): void;
}>();

// debounced to avoid it running every key press rapidly
const search = debounce(
  (e: Event) => emit('update', (e.target as HTMLInputElement).value),
  250,
);
</script>

<style scoped>
.breed-search {
  padding-left: 1.8rem;
  background: #fff url('../assets/images/magnifying-glass-solid.svg') no-repeat
    0.5rem center;
  background-size: 0.8rem;
}
</style>
