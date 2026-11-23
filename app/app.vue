<template>
  <NuxtLayout>
    <NuxtPage :key="route.fullPath" />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useDevicePixelRatio } from '@vueuse/core';

const route = useRoute();

useHead({
  titleTemplate: (title) => `${title} | Lineage Builder`,
});

const { pixelRatio } = useDevicePixelRatio();
let use72 = false;

if (import.meta.client) {
  // Move focus to the page heading after navigation (skip the first render).
  let hasNavigated = false;
  watch(
    () => route.fullPath,
    () => {
      if (!hasNavigated) {
        hasNavigated = true;
        return;
      }

      setTimeout(() => {
        const h1 = document.querySelector('h1');
        if (!h1) return;
        h1.tabIndex = -1;
        h1.focus();
      }, 50);
    },
  );
}

/* dynamically load and apply the correct spritesheet depending on
 pixel ratio. If we've requested the 72x set, we should prioritise it
 over the 36x res. */
if (import.meta.client)
  watch(
    pixelRatio,
    async () => {
      if (pixelRatio.value > 1) {
        await Promise.all([
          import('./assets/tile-rendering/sprites-72x96-0.css'),
          import('./assets/tile-rendering/sprites-72x96-1.css'),
          import('./assets/tile-rendering/sprites-72x96-2.css'),
          import('./assets/tile-rendering/sprites-72x96-3.css'),
          import('./assets/tile-rendering/sprites-72x96-4.css'),
          import('./assets/tile-rendering/sprites-72x96-5.css'),
        ]);
        use72 = true;
      } else if (!use72) {
        await Promise.all([
          import('./assets/tile-rendering/sprites-36x48-0.css'),
          import('./assets/tile-rendering/sprites-36x48-1.css'),
          import('./assets/tile-rendering/sprites-36x48-2.css'),
          import('./assets/tile-rendering/sprites-36x48-3.css'),
          import('./assets/tile-rendering/sprites-36x48-4.css'),
          import('./assets/tile-rendering/sprites-36x48-5.css'),
        ]);
      }
    },
    { immediate: true },
  );
</script>
