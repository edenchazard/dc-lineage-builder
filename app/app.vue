<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { injectBreedList } from '~~/shared/breeds';

// Initialise breed list on mount
onMounted(async () => {
  await injectBreedList();
});
</script>
