<template>
  <div
    id="app"
    :class="skinStore.activeSkin"
  >
    <Header />
    <main id="content">
      <router-view :key="route.fullPath"></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import 'reset-css';
import { useRoute } from 'vue-router';

import './assets/theming.css';
import './assets/styling/style.css';
import Header from './components/Page/Header/Header.vue';
import { useSkinStore } from './store/skin';

const route = useRoute();
const skinStore = useSkinStore();
</script>

<style>
#app {
  color: var(--colourFG);
  background: var(--builderBG);
  height: 100%;
  flex: 1;
}

#content {
  flex: 1;
}
</style>
