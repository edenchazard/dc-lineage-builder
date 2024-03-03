<template>
  <div id="dialogs"></div>
  <Header />
  <main id="content">
    <router-view :key="route.fullPath" />
  </main>
  <footer id="bottom">
    <div
      id="footer"
      class="constrain-width"
    >
      <div id="footer-external-links">
        <a href="https://ko-fi.com/dctools">
          <FontAwesomeIcon
            icon="fa-solid fa-mug-hot"
            size="2x"
          />Donation link
        </a>
        <a href="https://github.com/edenchazard/dc-lineage-builder">
          <FontAwesomeIcon
            icon="fa-brands fa-github"
            size="2x"
          />Github
        </a>
      </div>
      v{{ appStore.appVersion }} &copy; eden chazard
      <SkinSwitcher id="desktop-menu-skin-switcher" />
    </div>
  </footer>
</template>

<script setup lang="ts">
import 'reset-css';
import { onMounted, watch } from 'vue';
import { useDevicePixelRatio } from '@vueuse/core';
import { useRoute } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import './assets/styling/style.css';
import './assets/layouts/theming.css';
import { useAppStore } from './store/useAppStore.js';
import Header from './components/TheHeader.vue';
import SkinSwitcher from './components/SkinSwitcher.vue';
import { adjustTiles, injectBreedList } from './shared/breeds.js';

const route = useRoute();
const appStore = useAppStore();

const { pixelRatio } = useDevicePixelRatio();
let use72 = false;

/* dynamically load and apply the correct spritesheet depending on
 pixel ratio. If we've requested the 72x set, we should prioritise it
 over the 36x res. */
watch(
  pixelRatio,
  () => {
    if (pixelRatio.value > 1) {
      import('./assets/tile-rendering/sprites-72x96.css');
      use72 = true;
    } else if (!use72) {
      import('./assets/tile-rendering/sprites-36x48.css');
    }
  },
  { immediate: true },
);

onMounted(async () => {
  await injectBreedList();
  adjustTiles();
});
</script>

<style>
#content {
  color: var(--ui-content-fg);
  flex: 1;
  font-size: 1rem;
  line-height: 1.7em;
  background: var(--dc-background);
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
}

#bottom {
  background: var(--ui-footer-bg);
  color: var(--ui-footer-fg);
  text-align: center;
  padding: 0.5rem;
}

#footer {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0.5rem;
  flex-wrap: wrap;
}

#footer-external-links {
  display: flex;
  gap: 0.5rem;
}

#footer-external-links a {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  text-align: center;
  white-space: nowrap;
}

@media (min-width: 38em) {
  #footer {
    flex-direction: row;
  }
}
</style>
./directives
