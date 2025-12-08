<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { injectBreedList } from '~/utils/shared/breeds';

// Initialize breed list on mount
onMounted(async () => {
  await injectBreedList();
});
</script>
